import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import app from "../server.js";

describe("POST /files", () => {
  it("should upload a file and respond with 200 and a success message", async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, "../uploads/test.txt");
    fs.writeFileSync(filePath, "Hello, world!");

    const res = await request(app).post("/api/files").attach("files", filePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "File uploaded successfully!");

    fs.unlinkSync(filePath); // Clean up the test file
  }, 100000);
});
