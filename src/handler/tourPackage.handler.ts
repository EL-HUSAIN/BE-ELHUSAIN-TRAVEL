import { Request, Response } from "express";
import {
  createTourPackageService,
  deleteTourPackageService,
  getTourPackageBySlugService,
  getTourPackagesService,
} from "../service/tourPackage.service";

export async function createTourPackageHandler(req: Request, res: Response) {
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
    return res.status(201).json({
      message: "Tour package created successfully",
      data: tourPackage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTourPackagesHandler(req: Request, res: Response) {
  const { categoryId, search } = req.query;

  try {
    const filters: { categoryId?: number; search?: string } = {};
    if (categoryId) {
      filters.categoryId = Number(categoryId);
    }
    if (search) {
      filters.search = String(search);
    }

    const tourPackages = await getTourPackagesService(filters);
    return res.status(200).json({
      message: "Tour packages retrieved successfully",
      data: tourPackages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTourPackageByIdHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const tourPackage = await getTourPackagesService({
      categoryId: Number(id),
    });
    if (!tourPackage) {
      return res.status(404).json({
        message: "Tour package not found",
      });
    }
    return res.status(200).json({
      message: "Tour package retrieved successfully",
      data: tourPackage,
    });
  } catch (error) {
    return res.status(500).json({
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
      return res.status(404).json({
        message: "Tour package not found",
      });
    }
    return res.status(200).json({
      message: "Tour package retrieved successfully",
      data: tourPackage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateTourPackageHandler(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedTourPackage = await createTourPackageService({
      ...data,
      id: Number(id),
    });
    return res.status(200).json({
      message: "Tour package updated successfully",
      data: updatedTourPackage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteTourPackageHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const deletedTourPackage = await deleteTourPackageService(Number(id));
    return res.status(200).json({
      message: "Tour package deleted successfully",
      data: deletedTourPackage,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
