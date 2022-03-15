import process from "process";
import fs from "fs";
import { Bot, Message, Middleware } from "mirai-js";
import { MinecraftQuery } from "minecraft-status";

const conf = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const servers = JSON.parse(fs.readFileSync("servers.json", "utf-8")).servers;

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
      switch (data.text) {
        case "list":
          for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            const stat = await MinecraftQuery.fullQuery(
              server.host,
              server.port,
              5000
            );
            let msgText;
            try {
              msgText = `${server.name} 查询成功!\n在线人数: ${stat.players.online}/${stat.players.max}`;
              for (let i = 0; i < stat.players.sample.length; i++) {
                msgText += `\n- ${stat.players.sample[i]}`;
              }
            } catch (error) {
              msgText = `查询 ${server.name} 时发生错误: ${error}`;
            }
            await bot.sendMessage({
              group: data.sender.group.id, // 群消息目前似乎在风控
              message: new Message().addText(msgText),
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
