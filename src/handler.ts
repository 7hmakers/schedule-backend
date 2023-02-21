import { promises as fsp } from "node:fs";
import { createError, eventHandler, getRouterParam, readBody } from "h3";

const fsExists = (path: string) =>
  fsp.access(path).then(
    () => true,
    () => false,
  );

const utf8 = (s: string) => Buffer.from(s, "utf-8");

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const numberId = +id;
  const body = await readBody<{ txt: string }>(event);

  if (!id) { throw createError({ fatal: true, statusMessage: "No ID", status: 400 }); }
  if (numberId > 9999 || numberId < 1000) { throw createError({ fatal: true, statusMessage: "Illegal ID", status: 400 }); }
  if (!body || !body.txt) { throw createError({ fatal: true, statusMessage: "No Content", status: 400 }); }

  const { txt } = body;

  const path = `data/${id}.txt`;

  if (await fsExists(path)) {
    throw createError({ fatal: true, statusMessage: "ID", status: 400 });
  }

  await fsp.writeFile(path, txt, "utf8");

  return utf8("成功");
});
