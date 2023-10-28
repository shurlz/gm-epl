import { Document, Model } from 'mongoose';
import jwt from "jsonwebtoken";

export type DecryptTokenType = jwt.JwtPayload | string | null;

export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
  verifyPassword(password: string): Promise<boolean>;
  generateToken(): Promise<string>;
  decryptToken(token: string): Promise<DecryptTokenType>;
};
  
export interface IUserModel extends Model<IUser> {
  createNewUser(username: string, password: string, isAdmin?: boolean): Promise<IUser>;
};
