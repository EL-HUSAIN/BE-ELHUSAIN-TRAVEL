import prisma from "../../prisma/client";
import { Admin } from "@prisma/client";

// Create a new admin
export async function createAdmin(
  email: string,
  passwordHash: string,
  role: "NORMAL" | "SUPER"
): Promise<Admin> {
  return prisma.admin.create({
    data: {
      email,
      passwordHash,
      role,
    },
  });
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  return prisma.admin.findUnique({ where: { email } });
}
