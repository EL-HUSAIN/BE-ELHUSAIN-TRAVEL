import prisma from "../../prisma/client";
import { TourPackage } from "@prisma/client";

export interface TourPackageData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price?: string;
  duration: string;
  mainImageUrl: string;
  isActive?: boolean;
  categoryId: number;
}

export async function createTourPackage(
  data: TourPackageData
): Promise<TourPackage> {
  return prisma.tourPackage.create({
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      price: data.price ?? null,
      duration: data.duration,
      mainImageUrl: data.mainImageUrl,
      isActive: data.isActive ?? true,
      categoryId: data.categoryId,
    },
  });
}

// src/repository/tourPackage/tourPackage.repository.ts
export async function getTourPackages(
  params: {
    categoryId?: number;
    search?: string;
    skip?: number;
    take?: number;
  } = {}
): Promise<TourPackage[]> {
  const { categoryId, search, skip, take } = params;
  const where: any = {};

  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  return prisma.tourPackage.findMany({
    where,
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    skip, // offset
    take, // limit
  });
}

export async function getTourPackageById(
  id: number
): Promise<TourPackage | null> {
  return prisma.tourPackage.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });
}

export async function getTourPackageBySlug(
  slug: string
): Promise<TourPackage | null> {
  return prisma.tourPackage.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  });
}

export async function updateTourPackage(
  id: number,
  data: Partial<TourPackageData>
): Promise<TourPackage> {
  // Pisahkan categoryId dari field lain
  const {
    categoryId,
    title,
    slug,
    shortDescription,
    fullDescription,
    price,
    duration,
    mainImageUrl,
    isActive,
  } = data;

  return prisma.tourPackage.update({
    where: { id },
    data: {
      // scalar fields
      title,
      slug,
      shortDescription,
      fullDescription,
      price: price ?? null,
      duration,
      mainImageUrl,
      isActive: isActive ?? true,

      // nested relation update untuk category
      ...(categoryId != null
        ? {
            category: {
              connect: { id: categoryId },
            },
          }
        : {}),
    },
  });
}

export async function deleteTourPackage(id: number): Promise<TourPackage> {
  return prisma.tourPackage.delete({
    where: { id },
  });
}
