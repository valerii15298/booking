import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "./config.js";
import * as schema from "./schema.js";

const sql = postgres(env.POSTGRES_URL);
export const db = drizzle(sql, { schema });
// eslint-disable-next-line id-length
export const s = schema;
