import prisma from "../../prisma/client";
import { Category } from "@prisma/client";

export interface CategoryData {
  name: string;
  slug: string;
}

export async function createCategory(data: CategoryData): Promise<Category> {
  return prisma.category.create({
    data: {
      ...data,
    },
  });
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: {},
    orderBy: { createdAt: "asc" },
  });
}

export async function getCategoryById(id: number): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { slug },
  });
}

export async function updateCategory(
  id: number,
  data: Partial<CategoryData>
): Promise<Category> {
  return prisma.category.update({
    where: { id },
    data: { ...data },
  });
}

export async function deleteCategory(id: number): Promise<Category> {
  return prisma.category.delete({
    where: { id },
  });
}
