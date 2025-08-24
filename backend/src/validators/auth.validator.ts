import { body } from 'express-validator';

export const loginValidation = [
  body('username').isString().withMessage('Username must be a string'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const refreshTokenValidation = [
  body('refreshToken').isJWT().withMessage('Invalid refresh token'),
];