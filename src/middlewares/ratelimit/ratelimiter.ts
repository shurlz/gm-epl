import redis from '../../services/redis.service';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/request.types';

const cacheTimeSeconds = 2 * 60 * 60; // 2 hours

const rateLimiter = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    try {
      const cacheKey: any = req._id;
      let data = await redis.get(cacheKey);
  
      // if this is the user's first request within 2 hours, create the new instance in redis
      if (!data) {
          data = await redis.setex(cacheKey, cacheTimeSeconds, JSON.stringify({count: 0}));
      };
  
      // Parse the cached data 
      const parsedData = JSON.parse(data);
  
      // if requests have reached 40, then return error
      if (parsedData.count == 40) {
          return res.status(400).json({ message: 'youve reached your limit [40 API calls every 2 hours]' });
      };
  
      // Update count value, convert back to json and store
      parsedData.count += 1;
      const updatedData = JSON.stringify(parsedData);
      await redis.set(cacheKey, updatedData);
      console.log(`User: ${req._id}, Num Of Requests ${parsedData.count}`)
    } catch (err) {
        // 
    };
  };

  next();
};

export default rateLimiter;