import { Request } from 'express';

export interface AuthRequest extends Request {
    _id?: string;
    isAdmin?: boolean;
    username?: string;
};