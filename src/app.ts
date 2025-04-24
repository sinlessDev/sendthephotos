import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import express from "express";
import config from "./config.ts";
const app = express();

// app.use(express.json());

if (config.enableHttpRequestLogging) {
  const morgan = await import("morgan").then((module) => module.default);

  app.use(morgan("tiny"));
}

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const uploads = express();

const server = new Server({
  path: "/uploads",
  datastore: new FileStore({
    directory: config.fileStoreDirectoryPath,
  }),
});

uploads.all("*", server.handle.bind(server));

app.use("/uploads", uploads);

app.use(express.static("static"));

export default app;
