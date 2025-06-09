import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  getCategoryBySlugService,
  updateCategoryService,
} from "../service/category.service";

export async function createCategoryHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, slug } = req.body;
    const newCategory = await createCategoryService({ name, slug });
    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategoriesHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const categories = await getCategoriesService();
    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategoriesByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    const category = await getCategoryByIdService(Number(id));
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategoryBySlugHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { slug } = req.params;
  try {
    const category = await getCategoryBySlugService(slug);
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateCategoryHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const updatedCategory = await updateCategoryService(Number(id), {
      name,
      slug,
    });
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteCategoryHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    const deletedCategory = await deleteCategoryService(Number(id));
    res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
