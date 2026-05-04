import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/queueless";
await mongoose.connect(uri);
const db = mongoose.connection.db;

const setField = { $set: { role: "admin" } };
const setSA    = { $set: { role: "superadmin" } };

const r1 = await db.collection("users").updateOne({ email: "admin@test.com" }, setField);
const r2 = await db.collection("users").updateOne({ email: "superadmin@test.com" }, setSA);

console.log("admin@test.com    role=admin:", r1.matchedCount ? (r1.modifiedCount ? "SET" : "already admin") : "user NOT FOUND");
console.log("superadmin@test.com role=superadmin:", r2.matchedCount ? (r2.modifiedCount ? "SET" : "already superadmin") : "user NOT FOUND");

await mongoose.disconnect();
process.exit(0);
