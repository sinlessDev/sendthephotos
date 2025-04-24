import { createServer } from "node:http";

createServer((req, res) => {
  res.writeHead(200, "Ok", ["content-type", "text/html", "kotak", "bas"]).end();
}).listen(3000);
