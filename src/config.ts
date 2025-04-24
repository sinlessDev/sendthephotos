const config = Object.freeze({
  enableHttpRequestLogging: process.env.ENABLE_HTTP_REQUEST_LOGGING === "true",
});

export default config;
