import fs from "fs";
import path from "path";
import { db } from "../../server.js";
import { getRowByPublicKey, updateRow } from "../repository.js";

export default async function downloadFile(req, res) {
  const publicKey = req.params.fileName;
  try {
    const row = await db.get(getRowByPublicKey, [publicKey]);
    if (!row) {
      return res.status(404).send("No file exists with that name");
    }
    const filePath = path.join(process.env.FOLDER, publicKey + row.ext);
    console.log(publicKey + row.ext, filePath);
    if (fs.existsSync(filePath)) {
      // Update the last_accessed field to the current timestamp
      const currentTime = new Date().toISOString();

      await db.run(updateRow, [currentTime, publicKey]);

      res.download(filePath, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).send("Error downloading file");
        }
      });
    } else {
      res.status(404).send({ message: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing request");
  }
}
