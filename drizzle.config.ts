import { defineConfig } from "drizzle-kit";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
    }
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./db.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
