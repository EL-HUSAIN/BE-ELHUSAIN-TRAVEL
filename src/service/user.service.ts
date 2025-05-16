import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addHours, isBefore } from 'date-fns';

import {
  createUser,
  findUserByEmail,
  createProfile,
  updateUserPassword,
  createPasswordReset,
  findUserById,
  findPasswordResetById,
  deletePasswordReset,
} from '../repository/user.repository';

import {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ChangePasswordDTO,
  ResetPasswordDTO,
} from '../dto/auth_user.dto';

const JWT_SECRET = process.env.JWT_SECRET!; // pastikan di .env

// 1. Register / Sign Up
export async function register(dto: RegisterDTO) {
  // 1.1 Cek email sudah terdaftar?
  const exists = await findUserByEmail(dto.email);
  if (exists) throw new Error('Email already in use');

  // 1.2 Hash password
  const hash = await bcrypt.hash(dto.password, 10);

  // 1.3 Buat user
  const user = await createUser(dto.email, hash, dto.accountType);

  // 1.4 Buat profile
  await createProfile(
    user.id,
    dto.firstName,
    dto.lastName,
    dto.countryCode,
    dto.nationality,
    dto.phoneNumber,
    dto.organizationName,
  );

  // 1.5 Return minimal info (tidak mengembalikan hash)
  return { id: user.id, email: user.email, accountType: user.accountType };
}

// 2. Login
export async function login(dto: LoginDTO) {
  const user = await findUserByEmail(dto.email);
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(dto.password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');

  // Generate JWT
  const token = jwt.sign(
    { sub: user.id, email: user.email, type: 'USER' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, user: { id: user.id, email: user.email, accountType: user.accountType } };
}

// 3. Forgot Password
export async function forgotPassword(dto: ForgotPasswordDTO) {
  const user = await findUserByEmail(dto.email);
  if (!user) throw new Error('Email not found');

  // Buat token reset, expired in 1 hour
  const expiresAt = addHours(new Date(), 1);
  const reset = await createPasswordReset(user.id, expiresAt);

  // TODO: kirim email dengan link `https://.../reset?token=${reset.id}`
  return { resetToken: reset.id, expiresAt };
}

// 4. Reset Password
export async function resetPassword(dto: ResetPasswordDTO) {
  const record = await findPasswordResetById(dto.token);
  if (!record) throw new Error('Invalid or expired token');

  if (isBefore(record.expiresAt, new Date())) {
    // token sudah expired
    await deletePasswordReset(dto.token);
    throw new Error('Token has expired');
  }

  // Hash new password & update user
  const newHash = await bcrypt.hash(dto.newPassword, 10);
  await updateUserPassword(record.userId, newHash);

  // Hapus token
  await deletePasswordReset(dto.token);

  return { message: 'Password has been reset' };
}

// 5. Change Password
export async function changePassword(dto: ChangePasswordDTO) {
  // 1. Ambil user
  const user = await findUserById(dto.userId);
  if (!user) throw new Error('User not found');

  // 2. Verifikasi current password
  const match = await bcrypt.compare(dto.currentPassword, user.passwordHash);
  if (!match) throw new Error('Current password is incorrect');

  // 3. Hash new password & update
  const newHash = await bcrypt.hash(dto.newPassword, 10);
  await updateUserPassword(dto.userId, newHash);

  return { message: 'Password successfully changed' };
}