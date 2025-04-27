import { createApp } from "./app/app.ts";
import { createConfigFromEnv } from "./app/config.ts";
import { createDB } from "./app/db.ts";

const config = createConfigFromEnv();
const db = createDB(config);

const app = await createApp(config, db);

const server = app.listen(config.port, config.host, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  console.info(`Server started at http://${config.host}:${config.port}`);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.info("Shutdown initiated");

    server.close((err) => {
      if (err) {
        console.error("Failed to close server:", err);
        process.exit(1);
      } else {
        console.info("Server closed");
        process.exit(0);
      }
    });

    setTimeout(() => {
      console.warn("Forcing shutdown - terminating connections");
      server.closeAllConnections();
      process.exit(0);
    }, config.forceShutdownTimeoutSec * 1000);
  });
});
