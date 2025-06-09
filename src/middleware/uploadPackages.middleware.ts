// File: src/middleware/uploadPackages.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Simpan file di folder ./uploads/packages dengan nama unik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Jika ada parameter packageId, kita bisa simpan di subfolder paket tertentu
    // Misalnya: ./uploads/packages/<packageId>/
    const packageId = req.params.packageId;
    const uploadBase = path.join(__dirname, "../../../uploads/packages");
    const uploadPath = packageId
      ? path.join(uploadBase, String(packageId))
      : uploadBase;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

export const uploadPackageImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Hanya terima file gambar tipe jpg, jpeg, png
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpg, jpeg, png, webp)"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});
