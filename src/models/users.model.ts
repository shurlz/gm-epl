import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUser, IUserModel, DecryptTokenType } from '../types/users.types';
import { TOKEN_SECRET } from "../constants/env.constants";


const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  if (bcrypt.compareSync(password, this.password)) { return true };
  return false;
};

userSchema.methods.generateToken = async function (): Promise<string> {
  const token = jwt.sign({ id: this._id, isAdmin: this.isAdmin }, TOKEN_SECRET);
  return token;
};

userSchema.methods.userResponse = async function (): Promise<object> {
  return { _id: this._id, username: this.username, isAdmin: this.isAdmin };
};

userSchema.statics.createNewUser = async function (
  username: string, password: string, isAdmin: boolean = false
): Promise<IUser> {
  const hashedpwd = await bcrypt.hash(password, 5);
  const user = await this.create({ username, isAdmin, password: hashedpwd });
  return user;
};

userSchema.statics.decryptToken = async function (
  token: string
): Promise<DecryptTokenType> {
  try {
    const result = jwt.verify(token, TOKEN_SECRET);
    return result;
  } catch (error) {
    return null;
  };
};

const Users: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default Users;