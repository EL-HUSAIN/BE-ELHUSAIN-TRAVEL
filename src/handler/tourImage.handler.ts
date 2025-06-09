import { Request, Response } from "express";

import {
  createTourImageService,
  getTourImagesByPackageService,
  getTourImageByIdService,
  updateTourImageService,
  deleteTourImageService,
} from "../service/tourImage.service";
import path from "path";

export async function createTourImageHandler(
  req: Request,
  res: Response
): Promise<void> {
  // Pastikan file ada
  if (!req.file) {
    res.status(400).json({ message: "Image file is required" });
    return; // <-- return void, bukan return res
  }

  const packageId = Number(req.params.packageId);
  const displayOrder = req.body.displayOrder
    ? Number(req.body.displayOrder)
    : 0;

  try {
    // Ambil semua images
    const existingImages = await getTourImagesByPackageService(packageId);
    const conflict = existingImages.some(
      (img) => img.displayOrder === displayOrder
    );
    if (conflict) {
      res.status(400).json({
        message: "Display order already exists for this package",
      });
      return;
    }

    // Bangun imageUrl
    const imageUrl = path
      .join("/uploads/packages", String(packageId), req.file.filename)
      .replace(/\\/g, "/");

    const tourImage = await createTourImageService(packageId, {
      imageUrl,
      displayOrder,
    });

    res.status(201).json({
      message: "Tour image created successfully",
      data: tourImage,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
    return;
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
  const data = req.body;

  try {
    const updatedTourImage = await updateTourImageService(Number(id), data);
    res.status(200).json({
      message: "Tour image updated successfully",
      data: updatedTourImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteTourImageHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const deletedTourImage = await deleteTourImageService(Number(id));
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
