import keyPair from "../secret_management/create_secret.js";
import { db } from "../../server.js";
import { insertRow } from "../repository.js";
import path from "path";
export const multerConfig = {
  destination: function (req, file, cb) {
    cb(null, process.env.FOLDER);
  },
  filename: async function (req, file, cb) {
    const keys = keyPair();
    if (req.body.keys === undefined) req.body.keys = [];
    req.body.keys.push(keys);
    const extension = path.extname(file.originalname);
    cb(null, keys.publicKey + extension);
    try {
      await db.run(insertRow, [keys.publicKey, keys.privateKey, extension]);
    } catch (err) {
      console.error(err.message);
    }
  },
};

export default function uploadFile(req, res) {
  return res
    .status(200)
    .json({ ...req.body.keys, message: "File uploaded successfully!" });
}
