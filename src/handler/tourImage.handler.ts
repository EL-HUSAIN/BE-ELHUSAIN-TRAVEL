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
      const filePathToDelete = path.join(
        __dirname,
        "../..",
        deletedTourImage.imageUrl
      );
      await fs
        .unlink(filePathToDelete)
        .catch((e) =>
          console.error("Failed to delete physical image file:", e)
        );
    }

    res.status(200).json({
      message: "Tour image deleted successfully",
      data: deletedTourImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
