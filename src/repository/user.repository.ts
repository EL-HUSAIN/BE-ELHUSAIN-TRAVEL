// src/repository/user.repository.ts
import prisma from "../../prisma/client";
import { User, Profile, PasswordReset } from "@prisma/client";

// USER
/** Buat user baru */
export async function createUser(
  email: string,
  passwordHash: string,
  accountType: "PERSONAL" | "ORGANIZATION"
): Promise<User> {
  return prisma.user.create({
    data: { email, passwordHash, accountType },
  });
}

/** Cari user berdasarkan email */
export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

/** Cari user berdasarkan ID */
export async function findUserById(
  id: number
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id }
  });
}

// PROFILE
/** Buat profil user */
export async function createProfile(
  userId: number,
  firstName: string,
  lastName: string,
  countryCode: string,
  nationality: string,
  phoneNumber?: string,
  organizationName?: string
): Promise<Profile> {
  return prisma.profile.create({
    data: {
      userId,
      firstName,
      lastName,
      countryCode,
      nationality,
      phoneNumber,
      organizationName,
    },
  });
}

/** Update profil user */
export async function updateProfile(
  userId: number,
  data: Partial<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
    nationality: string;
    organizationName: string;
  }>
): Promise<Profile> {
  return prisma.profile.update({
    where: { userId },
    data,
  });
}

// RESET PASSWORD
export async function createPasswordReset(
  userId: number,
  expiresAt: Date
): Promise<PasswordReset> {
  return prisma.passwordReset.create({
    data: {
      userId,
      expiresAt,
    },
  });
}

/**
 * Cari record reset berdasarkan token
 * @param token  UUID token reset
 */
export async function findPasswordResetById(
  token: string
): Promise<PasswordReset | null> {
  return prisma.passwordReset.findUnique({
    where: { id: token },
  });
}

/** Update password hash untuk user */
export async function updateUserPassword(
  userId: number,
  newHash: string
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
}

/**
 * Hapus record reset setelah dipakai atau kadaluarsa
 * @param token  UUID token reset
 */
export async function deletePasswordReset(
  token: string
): Promise<PasswordReset> {
  return prisma.passwordReset.delete({
    where: { id: token },
  });
}
