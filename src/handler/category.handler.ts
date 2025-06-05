import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  getCategoryBySlugService,
  updateCategoryService,
} from "../service/category.service";

export async function createCategoryHandler(req: Request, res: Response) {
  try {
    const { name, slug } = req.body;
    const newCategory = await createCategoryService({ name, slug });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategoriesHandler(req: Request, res: Response) {
  try {
    const categories = await getCategoriesService();
    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategoriesByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const category = await getCategoryByIdService(Number(id));
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    return res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getCategoryBySlugHandler(req: Request, res: Response) {
  const { slug } = req.params;
  try {
    const category = await getCategoryBySlugService(slug);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    return res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateCategoryHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const updatedCategory = await updateCategoryService(Number(id), {
      name,
      slug,
    });
    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const deletedCategory = await deleteCategoryService(Number(id));
    return res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
