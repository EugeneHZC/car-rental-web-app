import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// export const db = mysql.createConnection(process.env.DATABASE_URL ?? "");
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 27185,
  database: process.env.DB_NAME,
  timezone: process.env.DB_TIMEZONE,
});
