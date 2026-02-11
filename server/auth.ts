import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev_secret_key'

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user' | 'influencer';
}

/**
 * Hash a password using bcrypt
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Verify a password against its hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a random verification token
 */
export function generateVerificationToken(): string {
  return uuidv4();
}

/**
 * Generate a random referral code
 */
export function generateReferralCode(): string {
  return `REF_${uuidv4().substring(0, 8).toUpperCase()}`;
}
