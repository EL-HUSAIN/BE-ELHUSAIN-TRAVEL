import { Request, Response } from "express";
import {
  createTourPackageService,
  deleteTourPackageService,
  getTourPackageByIdService,
  getTourPackageBySlugService,
  getTourPackagesService,
  updateTourPackageService,
} from "../service/tourPackage.service";

export async function createTourPackageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const {
    title,
    slug,
    shortDescription,
    fullDescription,
    price,
    duration,
    mainImageUrl,
    isActive = true,
    categoryId,
  } = req.body;

  try {
    const tourPackage = await createTourPackageService({
      title,
      slug,
      shortDescription,
      fullDescription,
      price,
      duration,
      mainImageUrl,
      isActive,
      categoryId: Number(categoryId),
    });
    res.status(201).json({
      message: "Tour package created successfully",
      data: tourPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTourPackagesHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { categoryId, search, page, limit } = req.query;

  try {
    const filters: {
      categoryId?: number;
      search?: string;
      page?: number;
      limit?: number;
    } = {};

    if (categoryId) filters.categoryId = Number(categoryId);
    if (search) filters.search = String(search);
    if (page) filters.page = Number(page);
    if (limit) filters.limit = Number(limit);

    const tourPackages = await getTourPackagesService(filters);
    res.status(200).json({
      message: "Tour packages retrieved successfully",
      meta: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        count: tourPackages.length,
      },
      data: tourPackages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTourPackageByIdHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const tourPackage = await getTourPackageByIdService(Number(id));
    if (!tourPackage) {
      res.status(404).json({
        message: "Tour package not found",
      });
    }
    res.status(200).json({
      message: "Tour package retrieved successfully",
      data: tourPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTourPackageBySlugHandler(req: Request, res: Response) {
  const { slug } = req.params;

  try {
    const tourPackage = await getTourPackageBySlugService(slug);
    if (!tourPackage) {
      res.status(404).json({
        message: "Tour package not found",
      });
    }
    res.status(200).json({
      message: "Tour package retrieved successfully",
      data: tourPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateTourPackageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedTourPackage = await updateTourPackageService(Number(id), data);
    res.status(200).json({
      message: "Tour package updated successfully",
      data: updatedTourPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteTourPackageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const deletedTourPackage = await deleteTourPackageService(Number(id));
    res.status(200).json({
      message: "Tour package deleted successfully",
      data: deletedTourPackage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
