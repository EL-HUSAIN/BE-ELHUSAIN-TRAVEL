import prisma from "../../prisma/client";
import { Prisma, TourPackage } from "@prisma/client";

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
  features?: string[];
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
      features: data.features ?? [],
    },
  });
}

// src/repository/tourPackage/tourPackage.repository.ts
export async function getTourPackages(
  params: {
    categoryId?: number;
    search?: string;
    sortBy?: string;
    skip?: number;
    take?: number;
  } = {}
): Promise<TourPackage[]> {
  const { categoryId, search, sortBy = "newest", skip, take } = params;
  const where: Prisma.TourPackageWhereInput = {};

  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  // Sorting
  const orderBy: Prisma.TourPackageOrderByWithRelationInput = {};
  switch (sortBy) {
    case "price-low":
      orderBy.price = "asc";
      break;
    case "price-high":
      orderBy.price = "desc";
      break;
    case "name":
      orderBy.title = "asc";
      break;
    case "newest":
    default:
      orderBy.createdAt = "desc";
      break;
  }

  return prisma.tourPackage.findMany({
    where,
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
    },
    orderBy, // Gunakan orderBy dinamis
    skip,
    take,
  });
}

export async function countTourPackages(
  params: {
    categoryId?: number;
    search?: string;
  } = {}
): Promise<number> {
  const { categoryId, search } = params;
  const where: Prisma.TourPackageWhereInput = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.tourPackage.count({ where });
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
    features,
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
      ...(data.features ? { features: data.features } : {}),
    },
  });
}

export async function deleteTourPackage(id: number): Promise<TourPackage> {
  return prisma.tourPackage.delete({
    where: { id },
  });
}
