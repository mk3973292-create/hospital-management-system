import app from "../app.js";
import { dbconnection } from "../database/dbconnection.js";

export default async function handler(req, res) {
  try {
    await dbconnection();
  } catch (error) {
    console.error("Database connection failure in serverless API:", error);
  }
  return app(req, res);
}
