// src/handler/post/post.handler.ts
import { Request, Response, NextFunction } from "express";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
} from "../service/post.service";
import { CreatePostDTO, UpdatePostDTO } from "../dto/post.dto";

export async function createPostHandler(
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) {
  try {
    const adminId = req.user!.id;
    const data = req.body as CreatePostDTO;
    const post = await createPost(adminId, data);
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

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
