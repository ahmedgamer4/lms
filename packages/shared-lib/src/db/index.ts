import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const envPath = [__dirname.split("/").slice(0, 5).join("/"), ".env"].join("/");
config({ path: envPath });

export const db = drizzle(process.env.DATABASE_URL!, { schema });
export * from "./schema";
