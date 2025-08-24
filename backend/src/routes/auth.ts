import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { comparePassword } from '../utils/bcrypt';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { loginValidation, refreshTokenValidation } from '../validators/auth.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', authLimiter, loginValidation, validate, async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await UserService.findByUsername(username);

    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateToken({ id: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful token refresh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token not provided
 *       403:
 *         description: Invalid refresh token
 */
router.post('/refresh', authLimiter, refreshTokenValidation, validate, (req: Request, res: Response) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }
  
    const decoded = verifyRefreshToken(token);
  
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
  
    const accessToken = generateToken({ id: (decoded as any).id, username: (decoded as any).username });
  
    res.json({ accessToken });
  });

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
  });
  
  router.get('/verify', authMiddleware, checkRole(['admin']), (req: AuthenticatedRequest, res) => {
    res.json({ message: 'Token is valid', user: req.user });
  });

export default router;