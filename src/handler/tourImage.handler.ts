import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises"; // Untuk menghapus file
import {
  createTourImageService,
  getTourImagesByPackageService,
  getTourImageByIdService,
  updateTourImageService,
  deleteTourImageService,
} from "../service/tourImage.service"; // Pastikan path benar

// Path dasar untuk menyimpan upload, sesuaikan dengan struktur proyek Anda
const UPLOADS_BASE_DIR = path.join(__dirname, "../../uploads/packages"); // Mengasumsikan di root proyek ada folder 'uploads'
const UPLOAD_DIR = path.join(process.cwd(), "");

export async function createTourImageHandler(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.file) {
    res.status(400).json({ message: "Image file is required" });
    return;
  }

  const packageId = Number(req.params.packageId);
  // displayOrder opsional, service akan menanganinya
  const displayOrder = req.body.displayOrder
    ? Number(req.body.displayOrder)
    : undefined; // Gunakan undefined jika tidak ada

  // Buat direktori jika belum ada (perlu diatur di middleware multer juga)
  const packageUploadDir = path.join(UPLOADS_BASE_DIR, String(packageId));
  const relativeImagePath = path.join(
    "packages",
    String(packageId),
    req.file.filename
  );
  const imageUrl = `/uploads/${relativeImagePath}`.replace(/\\/g, "/"); // URL yang akan disimpan di DB

  try {
    // Pastikan folder untuk paket ada sebelum memindahkan file
    await fs.mkdir(packageUploadDir, { recursive: true });
    // Multer mungkin sudah menyimpan file, jadi pastikan jalur akhirnya benar
    // Jika Multer menyimpan di direktori sementara, Anda perlu memindahkannya.
    // Contoh: req.file.path adalah lokasi sementara, packageUploadDir adalah tujuan.
    // fs.rename(req.file.path, path.join(packageUploadDir, req.file.filename));
    // Asumsi Multer sudah menyimpan ke path yang benar (misal: /uploads/packages/{packageId}/)

    const tourImage = await createTourImageService(packageId, {
      imageUrl, // URL yang relatif atau path yang bisa diakses publik
      displayOrder,
    });

    res.status(201).json({
      message: "Tour image created successfully",
      data: tourImage,
    });
  } catch (error: any) {
    // Hapus file yang sudah terupload jika ada error saat penyimpanan ke DB
    if (req.file) {
      // Pastikan path ke file yang diupload adalah yang benar untuk dihapus
      const filePathToDelete = path.join(packageUploadDir, req.file.filename);
      await fs
        .unlink(filePathToDelete)
        .catch((e) => console.error("Failed to delete uploaded file:", e));
    }
    // Tangani error jika displayOrder konflik dari service
    if (error.message === "Display order already exists for this package") {
      res.status(400).json({
        message: error.message,
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export async function getTourImagesByPackageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { packageId } = req.params;

  try {
    const tourImages = await getTourImagesByPackageService(Number(packageId));
    res.status(200).json({
      message: "Tour images retrieved successfully",
      data: tourImages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTourImageByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const tourImage = await getTourImageByIdService(Number(id));
    if (!tourImage) {
      res.status(404).json({
        message: "Tour image not found",
      });
      return; // Penting: return setelah mengirim respons 404
    }
    res.status(200).json({
      message: "Tour image retrieved successfully",
      data: tourImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateTourImageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const data = req.body; // data bisa berisi { imageUrl, displayOrder }

  try {
    const updatedTourImage = await updateTourImageService(Number(id), data);
    res.status(200).json({
      message: "Tour image updated successfully",
      data: updatedTourImage,
    });
  } catch (error: any) {
    // Tangani error jika displayOrder konflik dari service
    if (error.message === "Display order already exists for this package.") {
      res.status(400).json({
        message: error.message,
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export async function deleteTourImageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const deletedTourImage = await deleteTourImageService(Number(id));

    // Hapus juga file fisik dari server
    if (deletedTourImage.imageUrl) {
      // imageUrl dari DB Anda adalah: "/uploads/packages/1/github-logo-1752038852022.png"
      // Kita perlu menghilangkan bagian "/uploads/" dari imageUrl untuk mendapatkan path relatif
      // dari UPLOAD_ROOT_DIR.

      let imagePathInDb = deletedTourImage.imageUrl;

      // Hapus '/' di awal jika ada
      if (imagePathInDb.startsWith("/")) {
        imagePathInDb = imagePathInDb.substring(1);
      }

      // Hapus prefiks 'uploads/' jika ada di imagePathInDb
      // Ini adalah bagian kunci untuk menghindari duplikasi 'uploads'
      const pathSegments = imagePathInDb
        .split(path.sep)
        .filter((segment) => segment !== ""); // Split by OS separator and remove empty strings

      let filePathRelativeFromUploadRoot;
      if (pathSegments[0] === "uploads") {
        // Jika pathnya dimulai dengan 'uploads/', hilangkan 'uploads/' pertama
        filePathRelativeFromUploadRoot = path.join(...pathSegments.slice(1));
      } else {
        // Jika tidak, gunakan path lengkap (ini skenario yang kurang umum jika konsisten)
        filePathRelativeFromUploadRoot = path.join(...pathSegments);
      }

      const filePathToDelete = path.join(
        UPLOAD_DIR,
        filePathRelativeFromUploadRoot
      );

      console.log("Image URL from DB (cleaned):", deletedTourImage.imageUrl);
      console.log("Calculated UPLOAD_ROOT_DIR:", UPLOAD_DIR);
      console.log(
        "Relative path from uploads root:",
        filePathRelativeFromUploadRoot
      );
      console.log("Attempting to delete file at:", filePathToDelete); // Log final path

      await fs.unlink(filePathToDelete).catch((e) => {
        // Hanya log jika errornya bukan ENOENT (file not found)
        // Karena jika file sudah terhapus atau tidak pernah ada, kita tidak ingin gagal
        if (e.code !== "ENOENT") {
          console.error("Failed to delete physical image file:", e);
        } else {
          console.warn(
            "Attempted to delete a file that does not exist:",
            filePathToDelete
          );
        }
      });
    }

    res.status(200).json({
      message: "Tour image deleted successfully",
      data: deletedTourImage,
    });
  } catch (error) {
    console.error("Error in deleteTourImageHandler:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
