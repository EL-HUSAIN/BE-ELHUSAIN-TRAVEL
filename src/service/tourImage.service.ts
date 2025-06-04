// File: src/service/tourImage/tourImage.service.ts
import {
  createTourImage as repoCreateTourImage,
  getTourImagesByPackageId as repoGetTourImagesByPackage,
  getTourImageById as repoGetTourImageById,
  updateTourImage as repoUpdateTourImage,
  deleteTourImage as repoDeleteTourImage,
} from "../repository/tourImage.repository";
import { TourImage } from "@prisma/client";

export async function createTourImageService(
  packageId: number,
  data: { imageUrl: string; displayOrder?: number }
): Promise<TourImage> {
  return repoCreateTourImage(packageId, data);
}

export async function getTourImagesByPackageService(
  packageId: number
): Promise<TourImage[]> {
  return repoGetTourImagesByPackage(packageId);
}

export async function getTourImageByIdService(id: number): Promise<TourImage | null> {
  return repoGetTourImageById(id);
}

export async function updateTourImageService(
  id: number,
  data: Partial<{ imageUrl: string; displayOrder?: number }>
): Promise<TourImage> {
  return repoUpdateTourImage(id, data);
}

export async function deleteTourImageService(id: number): Promise<TourImage> {
  return repoDeleteTourImage(id);
}
