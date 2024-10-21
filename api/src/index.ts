import { initDb } from "../db";
import * as restApi from "./api-server/server";

async function main() {
  await initDb();
  restApi.serveRestApi(3000);

  process.on("SIGINT", () => {
    restApi.stopRestApi();
  });
  process.on("SIGTERM", () => {
    restApi.stopRestApi();
  });
}

main();
