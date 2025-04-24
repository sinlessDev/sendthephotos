import express from "express";
import config from "./config.ts";

const app = express();

app.use(express.json());

if (config.enableHttpRequestLogging) {
  const morgan = await import("morgan").then((module) => module.default);

  app.use(morgan("tiny"));
}

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

export default app;
