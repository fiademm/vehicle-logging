import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-default-secret';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, secret) as object;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): object | null => {
  try {
    return jwt.verify(token, refreshTokenSecret) as object;
  } catch (error) {
    return null;
  }
};