// File: src/service/tourPackage/tourPackage.service.ts
import {
  createTourPackage as repoCreateTourPackage,
  getTourPackages as repoGetTourPackages,
  getTourPackageById as repoGetTourPackageById,
  getTourPackageBySlug as repoGetTourPackageBySlug,
  updateTourPackage as repoUpdateTourPackage,
  deleteTourPackage as repoDeleteTourPackage,
  countTourPackages,
} from "../repository/tour.repository";
import { TourPackage } from "@prisma/client";

export async function createTourPackageService(data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price?: string;
  duration: string;
  mainImageUrl: string;
  isActive?: boolean;
  categoryId: number;
}): Promise<TourPackage> {
  return repoCreateTourPackage(data);
}

export async function getTourPackagesService(
  filters: {
    categoryId?: number;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<TourPackage[]> {
  const { page = 1, limit = 20, ...rest } = filters;
  const skip = (page - 1) * limit;
  return repoGetTourPackages({
    ...rest,
    skip,
    take: limit,
  });
}

export async function countTourPackagesService(
  filters: {
    categoryId?: number;
    search?: string;
  } = {}
): Promise<number> {
  return countTourPackages(filters);
}

export async function getTourPackageByIdService(
  id: number
): Promise<TourPackage | null> {
  return repoGetTourPackageById(id);
}

export async function getTourPackageBySlugService(
  slug: string
): Promise<TourPackage | null> {
  return repoGetTourPackageBySlug(slug);
}

export async function updateTourPackageService(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    price?: string;
    duration: string;
    mainImageUrl: string;
    isActive?: boolean;
    categoryId: number;
  }>
): Promise<TourPackage> {
  return repoUpdateTourPackage(id, data);
}

export async function deleteTourPackageService(
  id: number
): Promise<TourPackage> {
  return repoDeleteTourPackage(id);
}
