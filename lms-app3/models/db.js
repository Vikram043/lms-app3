import fs from "fs/promises";

const DB_FILE = "db.json";

export async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error("Failed to read database");
  }
}

export async function writeDB(db) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    throw new Error("Failed to write database");
  }
}
