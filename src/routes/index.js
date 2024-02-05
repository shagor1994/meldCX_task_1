import { Router } from "express";
import multer from "multer";
import uploadFile from "../components/uploadFile.js";
import deleteFile from "../components/deleteFile.js";
import downloadFile from "../components/downloadFile.js";
import { config } from "dotenv";
config();
import { rateLimit } from "express-rate-limit";
import { multerConfig } from "../components/uploadFile.js";
import keyPair from "../secret_management/create_secret.js";
const storage = multer.diskStorage(multerConfig);

const files = Router();
const upload = multer({ storage: storage }).array("files", 10);

const limiter1 = rateLimit({
  windowMs: Number(process.env.uploadWindowMs), // 24 hrs in milliseconds
  max: process.env.uploadMax, // limit each IP to 100 requests per windowMs
  message: "You have exceeded the 100 requests in 24 hrs limit!",
  standardHeaders: true,
  legacyHeaders: false,
});

const limiter2 = rateLimit({
  windowMs: Number(process.env.downloadWindowMs), // 24 hrs in milliseconds
  max: process.env.downloadMax, // limit each IP to 100 requests per windowMs
  message: "You have exceeded the 100 requests in 24 hrs limit!",
  standardHeaders: true,
  legacyHeaders: false,
});

files.post(
  "/files",
  limiter1,
  upload,
  (req, res, next) => {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }

    req.file = req.files;
    next();
  },
  uploadFile
);
files.delete("/delete/:privateKey", deleteFile);
files.get("/download/:fileName", limiter2, downloadFile);
export default files;
