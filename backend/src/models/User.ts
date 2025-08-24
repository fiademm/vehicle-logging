/**
 * @swagger
 * components:
 *   schemas:
 *     User: 
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         full_name:
 *           type: string
 *         role:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         last_login:
 *           type: string
 *           format: date-time
 */
export interface User {
  id?: number;
  username: string;
  password_hash: string;
  full_name: string;
  role?: string;
  created_at?: Date;
  last_login?: Date;
}