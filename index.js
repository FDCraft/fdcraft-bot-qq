import process from "process";
import fs from "fs";
import { Bot, Message, Middleware } from "mirai-js";
import { basicQuery, fullQuery } from "./mcquery.js";

const conf = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const servers = JSON.parse(fs.readFileSync("servers.json", "utf-8")).servers;
let serversIndex = new Object();
for (const server of servers) {
  serversIndex[server.id] = {
    name: server.name,
    host: server.host,
    port: server.port,
  };
}

const bot = new Bot();

await bot.open({
  baseUrl: conf.mirai.addr,
  verifyKey: conf.mirai.key,
  qq: conf.mirai.qq,
});

bot.on(
  "GroupMessage",
  new Middleware()
    .groupFilter(conf.groups)
    .textProcessor()
    .done(async (data) => {
      data.text = data.text.match(/\S+/g);
      if (data.text === null) {
        return;
      }
      switch (data.text[0]) {
        case "dev":
          if (data.text.length > 1) {
            if (data.text[1] in serversIndex) {
              const server = serversIndex[data.text[1]];
              const response = await fullQuery(server.host, server.port, 5000);
              await bot.sendMessage({
                group: data.sender.group.id,
                message: new Message().addText(
                  `【${data.text[1]}】${server.name}\n${response.text}`
                ),
              });
            } else {
              await bot.sendMessage({
                group: data.sender.group.id,
                message: new Message().addText("代号不存在捏"),
              });
            }
          } else {
            let queries = new Array();
            for (const server of servers) {
              queries.push(basicQuery(server.host, server.port, 3000));
            }
            const responses = await Promise.all(queries);
            let message = new Message().addText(
              "基岩社的叶宝\n---------------"
            );
            for (const i in servers) {
              message.addText(
                `\n【${servers[i].id}】${servers[i].name} ${responses[i].text}`
              );
            }
            await bot.sendMessage({
              group: data.sender.group.id,
              message: message.addText(
                "\n---------------\n输入\u0022list 代号\u0022查看详情"
              ),
            });
          }
      }
    })
);

process.on("SIGINT", async (_signal) => {
  console.log(`Process ${process.pid} interrupted. Closing...`);
  await bot.close();
  process.exit(0);
});
