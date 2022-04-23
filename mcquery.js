import { queryBasic, queryFull } from "minecraft-server-util";

export async function basicQuery(host, port, timeout) {
  let text;
  let err = false;
  try {
    const stat = await queryBasic(host, port);
    text = `[${stat.players.online}/${stat.players.max}]`;
  } catch (error) {
    err = true;
    text = "[查询失败]";
  }
  return { err, text };
}

export async function fullQuery(host, port, timeout) {
  let text;
  let err = false;
  try {
    const stat = await queryFull(host, port);
    console.log(stat.description);
    text = `\
${stat.version} [${stat.players.online}/${stat.players.max}]
${host}:${port}\
${stat.players.online === 0 ? "" : "\n---------------\n- "}\
${stat.players.sample.join("\n- ")}`;
  } catch (error) {
    err = true;
    text = `查询失败: ${error}`;
  }
  return { err, text };
}
