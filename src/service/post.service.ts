// src/service/post/post.service.ts
import {
  createPost as repoCreate,
  getPosts as repoGetAll,
  getPostById as repoGetById,
  updatePost as repoUpdate,
  deletePost as repoDelete,
  PostData,
  getPostBySlug,
} from "../repository/post.repository";
import { Post } from "@prisma/client";

export async function createPost(
  adminId: number,
  data: PostData
): Promise<Post> {
  return repoCreate(adminId, data);
}

export async function listPosts(filters?: {
  type?: string;
  status?: string;
}): Promise<Post[]> {
  return repoGetAll(filters as any);
}

export async function getPost(id: number): Promise<Post> {
  const post = await repoGetById(id);
  if (!post) throw new Error("Post not found");
  return post;
}

export async function getPostBySlugService(slug: string): Promise<Post | null> {
  return getPostBySlug(slug);
}

export async function updatePost(
  id: number,
  data: Partial<PostData>
): Promise<Post> {
  return repoUpdate(id, data);
}

export async function deletePost(id: number): Promise<Post> {
  return repoDelete(id);
}
