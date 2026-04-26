import { defineConfig } from "-kit";

export default defineConfig({
  schema: "./lib/schema.ts", // Path to your schema file 
  out: "./",          // Where migrations will be stored
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});