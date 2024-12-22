import { config } from "dotenv";
import path from "path";
import { defineConfig } from "drizzle-kit";

const envPath = path.join(__dirname.split("/").slice(0, 5).join("/"), ".env");
config({ path: envPath });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
