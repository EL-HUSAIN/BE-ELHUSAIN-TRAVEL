// File: src/service/tourImage/tourImage.service.ts
import { TourImage } from "@prisma/client";
import {
  createTourImage as repoCreateTourImage,
  getTourImagesByPackageId as repoGetTourImagesByPackage,
  getTourImageById as repoGetTourImageById,
  updateTourImage as repoUpdateTourImage,
  deleteTourImage as repoDeleteTourImage,
} from "../repository/tourImage.repository";

export async function createTourImageService(
  packageId: number,
  data: { imageUrl: string; displayOrder?: number }
): Promise<TourImage> {
  let finalDisplayOrder = data.displayOrder;

  // Jika displayOrder tidak disediakan atau 0, tentukan secara otomatis
  if (finalDisplayOrder === undefined || finalDisplayOrder === 0) {
    const existingImages = await repoGetTourImagesByPackage(packageId);
    // Cari displayOrder tertinggi yang ada, lalu tambahkan 1
    const maxDisplayOrder = existingImages.reduce(
      (max, img) => Math.max(max, img.displayOrder),
      0
    );
    finalDisplayOrder = maxDisplayOrder + 1;
  } else {
    // Jika displayOrder disediakan, cek konflik
    const existingImages = await repoGetTourImagesByPackage(packageId);
    const conflict = existingImages.some(
      (img) => img.displayOrder === finalDisplayOrder
    );
    if (conflict) {
      // Lebih baik throw error di sini agar handler bisa menangkapnya
      throw new Error("Display order already exists for this package");
    }
  }

  return repoCreateTourImage(packageId, {
    imageUrl: data.imageUrl,
    displayOrder: finalDisplayOrder,
  });
}

export async function getTourImagesByPackageService(
  packageId: number
): Promise<TourImage[]> {
  return repoGetTourImagesByPackage(packageId);
}

export async function getTourImageByIdService(
  id: number
): Promise<TourImage | null> {
  return repoGetTourImageById(id);
}

export async function updateTourImageService(
  id: number,
  data: Partial<{ imageUrl: string; displayOrder?: number }>
): Promise<TourImage> {
  // Jika displayOrder diupdate, perlu cek konflik
  if (data.displayOrder !== undefined) {
    const imageToUpdate = await repoGetTourImageById(id);
    if (!imageToUpdate) {
      throw new Error("Image not found for update.");
    }
    const existingImages = await repoGetTourImagesByPackage(
      imageToUpdate.packageId
    );
    const conflict = existingImages.some(
      (img) => img.id !== id && img.displayOrder === data.displayOrder
    );
    if (conflict) {
      throw new Error("Display order already exists for this package.");
    }
  }
  return repoUpdateTourImage(id, data);
}

export async function deleteTourImageService(id: number): Promise<TourImage> {
  return repoDeleteTourImage(id);
}
