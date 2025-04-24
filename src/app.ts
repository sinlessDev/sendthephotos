import express from "express";
import config from "./config.ts";
import { createUploadsRouter } from "./uploads.ts";

const app = express();

app.use(express.json());

if (config.enableHttpRequestLogging) {
  const { default: morgan } = await import("morgan");

  app.use(morgan("tiny"));
}

app.use("/uploads", createUploadsRouter(config));

export default app;
