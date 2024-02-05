import { db } from "../../server.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getRowByPrivateKey, deleteRow } from "../repository.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function deleteFile(req, res) {
  try {
    const { privateKey } = req.params;
    const row = await db.get(getRowByPrivateKey, [privateKey]);
    if (!row) {
      return res.status(404).send({ message: "file not found" });
    }
    await fs.promises.unlink(
      path.join(process.env.FOLDER, `${row.public}${row.ext}`)
    );
    await db.run(deleteRow, privateKey);
    return res.status(200).send({ message: "file deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}
