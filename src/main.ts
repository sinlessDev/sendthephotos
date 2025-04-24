import app from "./app.ts";

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  });
});
