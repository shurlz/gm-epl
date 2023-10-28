import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { TOKEN_SECRET } from '../../constants/env.constants';
import { AuthRequest } from '../../types/request.types';


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: 'Token Missing' });

  const [bearer, token] = authHeader.split(" ");

  if (bearer.toLowerCase() !== 'bearer' || !token) { 
    return res.status(403).json({ error: 'Invalid Token Fotmat' });
  };

  jwt.verify(token, TOKEN_SECRET, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    (req._id = decoded.id),
    (req.isAdmin = decoded.isAdmin)
    next();
  });
};

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  verifyToken(req, res, (err) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or Missing Token' });
    };

    if (req.isAdmin) {
      next();
    } else {
      return res.status(401).json({ error: 'Action Forbidden For Non-Admins' });
    };
  });
};
