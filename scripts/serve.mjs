import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const htmlUrl = new URL("../index.html", import.meta.url);

const server = createServer(async (request, response) => {
  if (request.url !== "/" && request.url !== "/index.html") {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  try {
    const html = await readFile(htmlUrl);
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(html);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`读取页面失败：${error.message}`);
  }
});

server.listen(port, host, () => {
  console.log(`前端面试概念动画：http://${host}:${port}`);
});
