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

export async function getTourPackages(
  filters: {
    categoryId?: number;
    search?: string;
  } = {}
): Promise<TourPackage[]> {
  const where: any = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { shortDescription: { contains: filters.search, mode: "insensitive" } },
      { fullDescription: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.tourPackage.findMany({
    where,
    include: {
      category: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
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
  return prisma.tourPackage.update({
    where: { id },
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

export async function deleteTourPackage(id: number): Promise<TourPackage> {
  return prisma.tourPackage.delete({
    where: { id },
  });
}