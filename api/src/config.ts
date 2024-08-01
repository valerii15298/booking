import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

import { zStr } from "./zod.js";

const rawConfig = dotenv.config({ path: "../.env", processEnv: {} });
if (rawConfig.error) {
  throw rawConfig.error;
}

const parsedConfig = expand({ ...rawConfig, processEnv: {} });
if (parsedConfig.error) {
  throw parsedConfig.error;
}

const MIN_PORT = 2 ** 10;

const envSchema = z.object({
  PORT: zStr.pipe(z.coerce.number().int().min(MIN_PORT)),
  POSTGRES_URL: zStr.url(),
});

export const env = envSchema.parse(parsedConfig.parsed);
