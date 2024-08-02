import * as d from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "./config.js";
import * as s from "./schema.js";

const sql = postgres(env.POSTGRES_URL);
export const db = drizzle(sql, { schema: s });

export { d, s };
