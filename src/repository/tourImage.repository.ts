import prisma from "../../prisma/client";
import { TourImage } from "@prisma/client";

export interface TourImageData {
  imageUrl: string;
  displayOrder?: number;
}

export async function createTourImage(
  packageId: number,
  data: TourImageData
): Promise<TourImage> {
  return prisma.tourImage.create({
    data: {
      imageUrl: data.imageUrl,
      displayOrder: data.displayOrder ?? 0,
      packageId: packageId,
    },
  });
}

export async function getTourImagesByPackageId(
  packageId: number
): Promise<TourImage[]> {
  return prisma.tourImage.findMany({
    where: { packageId },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getTourImageById(
  imageId: number
): Promise<TourImage | null> {
  return prisma.tourImage.findUnique({
    where: { id: imageId },
  });
}

export async function updateTourImage(
  imageId: number,
  data: Partial<TourImageData>
): Promise<TourImage> {
  return prisma.tourImage.update({
    where: { id: imageId },
    data: {
      imageUrl: data.imageUrl,
      displayOrder: data.displayOrder ?? 0,
    },
  });
}

export async function deleteTourImage(imageId: number): Promise<TourImage> {
  return prisma.tourImage.delete({
    where: { id: imageId },
  });
}
