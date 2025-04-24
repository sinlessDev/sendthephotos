import { createApp } from "./app.ts";
import { createDeps } from "./deps.ts";

const deps = createDeps();
const app = await createApp(deps);

const server = app.listen(deps.config.port, deps.config.host, () => {
  console.info(
    `Server: Server is running on http://${deps.config.host}:${deps.config.port}`
  );
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
  });
});
