import { createApp } from "./app/app.ts";
import { createConfigFromEnv } from "./app/config.ts";
import { createDB } from "./app/db.ts";
import { createTusd } from "./app/tusd/tusd.ts";

const SHUTDOWN_TIMEOUT = 10_000 as const;

const config = createConfigFromEnv();
const db = createDB(config);

const app = await createApp(config, db);

const tusd = createTusd(db);

const server = app.listen(config.port, config.host, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  console.info(`Server started at http://${config.host}:${config.port}`);
});

const tusdServer = tusd.listen(config.tusd.port, config.tusd.host, (err) => {
  if (err) {
    console.error("Failed to start tusd:", err);
    process.exit(1);
  }

  console.info(
    `Tusd started at http://${config.tusd.host}:${config.tusd.port}`
  );
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    tusdServer.close((err) => {
      if (err) {
        console.error("Failed to close tusd:", err);
      } else {
        console.info("Tusd closed");
      }
    });

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
    }, SHUTDOWN_TIMEOUT);
  });
});
