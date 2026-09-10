import app from "../backend/app.js";
import { dbconnection } from "../backend/database/dbconnection.js";

export default async function handler(req, res) {
  try {
    await dbconnection();
  } catch (error) {
    console.error("Database connection failure in serverless API:", error);
  }
  return app(req, res);
}
