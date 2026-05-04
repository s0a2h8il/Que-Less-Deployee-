// set-roles.mjs — Run once before tests to set admin/superadmin roles
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../backend/.env") });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/queueless";

await mongoose.connect(MONGO_URI);
const db = mongoose.connection.db;

const r1 = await db.collection("users").updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
);
const r2 = await db.collection("users").updateOne(
  { email: "superadmin@test.com" },
  { $set: { role: "superadmin" } }
);

console.log("admin@test.com    →", r1.matchedCount ? "role=admin set" : "user not found (register first)");
console.log("superadmin@test.com →", r2.matchedCount ? "role=superadmin set" : "user not found (register first)");

await mongoose.disconnect();
process.exit(0);
