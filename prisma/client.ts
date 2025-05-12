// src/prisma/client.ts
import { PrismaClient } from "@prisma/client";

// Single instance untuk whole app
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Optional: handle shutdown untuk serverless environment
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  global.prisma = global.prisma || prisma;
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
