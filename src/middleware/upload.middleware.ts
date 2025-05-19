// src/middleware/upload.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Simpan file di folder ./uploads/posts dengan nama unik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../../uploads/posts");

    // Jika folder belum ada, buat (recursive untuk nested dirs)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });
