// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: number; // userId
  email: string;
  type: string; // e.g. 'USER' or 'ADMIN'
  iat: number;
  exp: number;
}

export const authMiddleware: RequestHandler = (
  req: Request & { user?: { id: number; email: string; type: string } },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Missing or invalid Authorization header",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as unknown as JwtPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      type: payload.type,
    };
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
    return;
  }
};
