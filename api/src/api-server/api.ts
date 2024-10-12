import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

const api = new Hono().basePath("/api");

api.use(logger());
api.use(prettyJSON());
api.use(secureHeaders());

api.get("/", (c) => {
  return c.text("Hello, world!");
});

export default api;
