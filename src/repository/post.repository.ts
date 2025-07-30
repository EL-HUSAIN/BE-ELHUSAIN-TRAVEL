// src/repository/post/post.repository.ts
import prisma from "../../prisma/client";
import { Post, PostStatus, PostType, Prisma } from "@prisma/client";

export interface PostData {
  title: string;
  slug: string;
  body: string;
  type: PostType;
  status?: PostStatus;
  imageUrls?: string[];
}

export async function createPost(
  adminId: number,
  data: PostData
): Promise<Post> {
  return prisma.post.create({
    data: {
      adminId,
      ...data,
      status: data.status ?? "DRAFT",
      imageUrls: data.imageUrls ?? [],
    },
  });
}

export async function getPosts(
  params: {
    type?: PostType;
    status?: PostStatus;
    search?: string;
    sortBy?: string;
    skip?: number;
    take?: number;
  } = {}
): Promise<Post[]> {
  const { type, status, search, sortBy = "newest", skip, take } = params;
  const where: Prisma.PostWhereInput = {
    isDeleted: false,
    ...(type && { type }),
    ...(status && { status }),
  };

  // Tambahkan kondisi pencarian
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { body: { contains: search, mode: "insensitive" } },
    ];
  }

  // Tambahkan kondisi sorting
  const orderBy: Prisma.PostOrderByWithRelationInput = {};
  switch (sortBy) {
    case "oldest":
      orderBy.createdAt = "asc";
      break;
    case "title":
      orderBy.title = "asc";
      break;
    case "newest":
    default:
      orderBy.createdAt = "desc";
      break;
  }

  return prisma.post.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

// Fungsi baru untuk menghitung total post
export async function countPosts(
  params: {
    type?: PostType;
    status?: PostStatus;
    search?: string;
  } = {}
): Promise<number> {
  const { type, status, search } = params;
  const where: Prisma.PostWhereInput = {
    isDeleted: false,
    ...(type && { type }),
    ...(status && { status }),
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { body: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.post.count({ where });
}

export async function getPostById(id: number): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { id, isDeleted: false },
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { slug, isDeleted: false },
  });
}

export async function updatePost(
  id: number,
  data: Partial<PostData> & { imageUrls?: string[] }
): Promise<Post> {
  const { imageUrls, ...rest } = data;
  return prisma.post.update({
    where: { id },
    data: {
      ...rest,
      // hanya masukkan kolom imageUrls kalau data.imageUrls !== undefined
      ...(imageUrls ? { imageUrls } : {}),
    },
  });
}

export async function deletePost(id: number): Promise<Post> {
  // soft delete
  return prisma.post.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
}
