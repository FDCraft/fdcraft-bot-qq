import process from "process";
import fs from "fs";
import { Bot, Message, Middleware } from "mirai-js";

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
      data.text = data.text.split();
      switch (data.text[0]) {
        case "dev":
          if (data.text.length > 1) {
            // await bot.sendMessage({
            //   group: data.sender.group.id,
            //   message: new Message().addText(),
            // });
            return;
          } else {
            await bot.sendMessage({
              group: data.sender.group.id,
              message: new Message()
                .addText("基岩社的叶宝\n---------------")
                .addText(
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
