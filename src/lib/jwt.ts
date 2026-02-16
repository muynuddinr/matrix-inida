import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface DecodedToken {
  adminId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export const generateToken = (adminId: string, email: string, name: string): string => {
  return jwt.sign(
    { adminId, email, name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
};
