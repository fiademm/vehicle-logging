import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    // @ts-ignore
    const userRole = req.user.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  };
};