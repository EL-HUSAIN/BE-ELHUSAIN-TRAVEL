// src/handler/post/post.handler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  getPostBySlugService,
} from "../service/post.service";
import { CreatePostDTO, UpdatePostDTO } from "../dto/post.dto";

export const createPostHandler: RequestHandler = async (req, res, next) => {
  try {
    // ambil adminId dari authMiddleware
    const adminId = (req as any).user.id as number;

    // body fields
    const data = req.body as CreatePostDTO;

    // multer bisa menaruh req.files sebagai File[] atau { [key]: File[] }
    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files ?? {}).flat();

    // bangun imageUrls
    const imageUrls = (files as Express.Multer.File[]).map(
      (f) => `/uploads/posts/${f.filename}`
    );

    // gabung ke DTO
    const dto: CreatePostDTO = {
      ...data,
      imageUrls,
    };

    const post = await createPost(adminId, dto);
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

export async function listPostsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = {
      type: req.query.type as string,
      status: req.query.status as string,
    };
    const posts = await listPosts(filters);
    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
}

export async function getPostHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const post = await getPost(id);
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

export async function getPostBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = req.params.slug;
    const post = await getPostBySlugService(slug);
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

export async function updatePostHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const data = req.body as Partial<UpdatePostDTO>;
    const post = await updatePost(id, data);
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

export async function deletePostHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    await deletePost(id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}
