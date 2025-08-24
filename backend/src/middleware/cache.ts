import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redisClient';

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl;

  try {
    const data = await redisClient.get(key);

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      const originalSend = res.send;
      res.send = function (chunk?: any): any {
        if (chunk) {
          void redisClient.set(key, JSON.stringify(chunk), { EX: 3600 });
        }
        return originalSend.call(res, chunk);
      };
      next();
    }
  } catch (err) {
    next(err);
  }
};

export default cacheMiddleware;