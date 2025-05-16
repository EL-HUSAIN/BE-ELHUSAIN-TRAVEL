import { PostType, PostStatus } from "@prisma/client";

export interface CreatePostDTO {
  title: string;
  slug: string;
  body: string;
  type: PostType; // "BLOG" | "CATALOG" | "NEWS" | "INFORMATION"
  status?: PostStatus; // "DRAFT" | "PUBLISHED"
  imageUrls?: string[]; // optional list of URL strings
}

export interface UpdatePostDTO {
  title?: string;
  slug?: string;
  body?: string;
  type?: PostType;
  status?: PostStatus;
  imageUrls?: string[];
}
