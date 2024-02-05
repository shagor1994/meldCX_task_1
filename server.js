import { config } from "dotenv";
config();
import express from "express";
import files from "./src/routes/index.js";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { createTable } from "./src/repository.js";
import cron from "node-cron";
import path from "path";
import fs from "fs";

const app = express();

export const db = await open({
  filename: "./db.sqlite",
  driver: sqlite3.Database,
});
await db.run(createTable, (err) => {
  if (err) {
    console.error(err.message);
  }
});

app.use(express.static("public"));
app.use(express.json());

app.use("/api", files);
export default app;

// Schedule the cron job to run at midnight
cron.schedule("0 0 * * *", async () => {
  const currentDate = new Date();
  try {
    const rows = await db.all("SELECT * FROM file");
    rows.forEach((row) => {
      const createdAt = new Date(row.last_accessed);
      console.log("Created at: ", createdAt);
      const diffInDays = Math.floor(
        (currentDate - createdAt) / (1000 * 60 * 60 * 24)
      );
      console.log("Difference in days: ", diffInDays);
      if (diffInDays > 1) {
        console.log(
          `File with public key: ${row.public} has expired and will be deleted`
        );
        // Delete the file
        fs.unlink(
          path.join(process.env.FOLDER, `${row.public}${row.ext}`),
          (err) => {
            if (err) {
              console.error(err.message);
            } else {
              console.log(`Deleted file: ${row.public}`);
              // Delete the row from the table
              db.run(
                `DELETE FROM file WHERE public = ?`,
                [row.public],
                (err) => {
                  if (err) {
                    console.error(err.message);
                  } else {
                    console.log(`Deleted row with public key: ${row.public}`);
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
});
