import { MinecraftQuery } from "minecraft-status";

export async function basic(host, port, timeout) {
  let text;
  let err = false;
  try {
    const stat = await MinecraftQuery.query(host, port, timeout);
    text = `[${stat.players.online}/${stat.players.max}]`;
  } catch (error) {
    err = true;
    text = "[查询失败]";
  }
  return { err, text };
}

export async function full(host, port, timeout) {
  let text;
  let err = false;
  try {
    const stat = await MinecraftQuery.fullQuery(host, port, timeout);
    text = `${stat.version.name} [${stat.players.online}/${stat.players.max}]\n${host}:${port}\n---------------`;
    for (let i = 0; i < stat.players.sample.length; i++) {
      text += `\n- ${stat.players.sample[i]}`;
    }
  } catch (error) {
    err = true;
    text = `查询失败: ${error}`;
  }
  return { err, text };
}
