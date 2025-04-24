import { createApp } from "./app.ts";
import config from "./config.ts";
import { createDBConn } from "./db.ts";

const deps = Object.freeze({
  db: createDBConn(config),
});

const app = await createApp(config, deps);

const server = app.listen(3000, "localhost", () => {
  console.info("Server is running on port 3000");
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.info("Gracefully shutting down the server...");
    server.close((err) => {
      if (err) {
        console.warn("Error closing server", err);
        process.exit(1);
      } else {
        console.info("Successfully closed server");
        process.exit(0);
      }
    });
  });
});
