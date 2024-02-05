import request from "supertest";
import mockFs from "mock-fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import app from "../server.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, "../uploads/");

describe("downloadFile", () => {
  beforeEach(() => {
    mockFs({
      [process.env.FOLDER + "/"]: {
        "df532ecdfd.png": "file content",
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("should respond with 404 if file does not exist", async () => {
    const res = await request(app).get("/api/delete/df532ecdfee");
    expect(res.status).toBe(404);
  });

  it("should delete the file if it exists", async () => {
    const res = await request(app).delete("/api/delete/df532ecdfd");
    expect(res.status).toBe(200);
  });
});
