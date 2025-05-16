// src/middleware/admin.middleware.ts
import { RequestHandler } from 'express';

export const adminMiddleware: RequestHandler = (req, res, next) => {
  // authMiddleware sudah set req.user
  if ((req as any).user?.type !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    return;
  }
  next();
};
