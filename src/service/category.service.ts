// File: src/service/category/category.service.ts
import {
  createCategory as repoCreateCategory,
  getCategories as repoGetCategories,
  getCategoryById as repoGetCategoryById,
  getCategoryBySlug as repoGetCategoryBySlug,
  updateCategory as repoUpdateCategory,
  deleteCategory as repoDeleteCategory,
} from "../repository/category.repository";
import { Category } from "@prisma/client";

export async function createCategoryService(data: {
  name: string;
  slug: string;
}): Promise<Category> {
  return repoCreateCategory(data);
}

export async function getCategoriesService(): Promise<Category[]> {
  return repoGetCategories();
}

export async function getCategoryByIdService(
  id: number
): Promise<Category | null> {
  return repoGetCategoryById(id);
}

export async function getCategoryBySlugService(
  slug: string
): Promise<Category | null> {
  return repoGetCategoryBySlug(slug);
}

export async function updateCategoryService(
  id: number,
  data: Partial<{ name: string; slug: string }>
): Promise<Category> {
  return repoUpdateCategory(id, data);
}

export async function deleteCategoryService(id: number): Promise<Category> {
  return repoDeleteCategory(id);
}
