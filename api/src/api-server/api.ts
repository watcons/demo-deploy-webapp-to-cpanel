import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import {
  createRoll,
  getRolls,
  trimRolls,
} from "../../repositories/roll-repository";

const api = new Hono().basePath("/api");

api.use(logger());
api.use(prettyJSON());
api.use(secureHeaders());

api.get("/", async (c) => {
  const rolls = await getRolls();
  return c.json(rolls);
});

api.post("roll", async (c) => {
  const newRollValue = Math.floor(Math.random() * 6) + 1;
  await createRoll(newRollValue);

  await trimRolls();

  const rolls = await getRolls();
  return c.json(rolls);
});

export default api;
