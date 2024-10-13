import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

const MAX_ROLLS = 10;
let rolls: number[] = [];

const api = new Hono().basePath("/api");

api.use(logger());
api.use(prettyJSON());
api.use(secureHeaders());

api.get("/", (c) => {
  return c.text("Hello, world!");
});

api.post("roll", (c) => {
  const roll = Math.floor(Math.random() * 6) + 1;
  rolls = [...rolls, roll].slice(-MAX_ROLLS);
  return c.json(rolls);
});

export default api;
