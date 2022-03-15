# fdcraft-bot-qq

为 FDCraft 打造的基于 [Mirai](https://github.com/mamoe/mirai) 的 QQ 机器人

## 开始使用

```
yarn install
```

需要启动 [mirai-api-http](https://github.com/project-mirai/mirai-api-http) 并将 `http` 和 `ws` 适配器设置为同一端口

> 请勿开启 `singleMode` !

请参考如下创建 `config.json` 和 `servers.json`

#### config.json 模板

```json5
{
  mirai: {
    addr: "http://127.0.0.1:8080", // 你的 mirai-api-http 地址
    key: "ABCDEFGHIJKLMN", // 你的 mirai-api-http 中设置的 authKey
    qq: 123456789, // 机器人的 QQ 号
  },
  groups: [1234567890, 9876543210], // 允许使用机器人的 QQ 群号
}
```

#### servers.json 模板

> 服务器需开启 `query` 并启用 UDP

```json5
{
  servers: [
    {
      name: "FDCraft",
      host: "example.org",
      port: 25565, // query 端口
    },
    {
      name: "Example",
      host: "example.org",
      port: 11451,
    },
  ],
}
```

## 依赖

- [Mirai-js](https://github.com/Drincann/Mirai-js)
- [minecraft-status](https://github.com/mathhulk/minecraft-status)
