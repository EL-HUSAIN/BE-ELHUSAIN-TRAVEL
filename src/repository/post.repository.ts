// src/repository/post/post.repository.ts
import prisma from "../../prisma/client";
import { Post, PostStatus, PostType } from "@prisma/client";

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
  filters: { type?: PostType; status?: PostStatus } = {}
): Promise<Post[]> {
  return prisma.post.findMany({
    where: {
      isDeleted: false,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
  });
}

export async function getPostById(id: number): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { id, isDeleted: false },
  });
}


export async function getPostBySlug(
  slug: string
): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { slug, isDeleted: false },
  });
}

export async function updatePost(
  id: number,
  data: Partial<PostData>
): Promise<Post> {
  return prisma.post.update({
    where: { id },
    data: { ...data, imageUrls: data.imageUrls },
  });
}

export async function deletePost(id: number): Promise<Post> {
  // soft delete
  return prisma.post.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
}
