import express, { Request, Response } from "express";
import { upload } from "../service/upload-service";

const router = express.Router();

router.post("/", upload.single("image"), (req: Request, res: Response): void => {
  // Jika tidak ada file yang diupload, kirim respon error
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  // Jika file berhasil diupload, kirim respon sukses
  res.send("File uploaded successfully!");
});
export default router;
