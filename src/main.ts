import { createApp } from "./app.ts";
import { createEnvConf } from "./conf.ts";
import { createDB } from "./db.ts";

const conf = createEnvConf();
const db = createDB(conf);
const deps = Object.freeze({ conf, db });

const app = await createApp(deps);

const server = app.listen(conf.port, conf.host, () => {
  console.info(`Server: Server is running on http://${conf.host}:${conf.port}`);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.info("Server: Gracefully shutting down");

    server.close((err) => {
      if (err) {
        console.warn("Server: Error closing connection", err);
        process.exit(1);
      } else {
        console.info("Server: Successfully closed connection");
        process.exit(0);
      }
    });

    setTimeout(() => {
      console.warn("Server: Force closing all connections");
      server.closeAllConnections();
      process.exit(0);
    }, 5000);
  });
});
