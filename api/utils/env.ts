import { cleanEnv, port, str } from "envalid";
import { config } from "dotenv";

config();

const validateEnv = () =>
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MYSQL_HOST: str(),
    MYSQL_PORT: port(),
    MYSQL_DATABASE: str(),
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
  });

export default validateEnv();
