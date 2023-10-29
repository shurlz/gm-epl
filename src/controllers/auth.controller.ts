import Users from '../models/users.model';
import { Request, Response } from 'express';


export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const user = await Users.findOne({ username }).exec();
  if (!user) {
    return res.status(400).json({ message: 'Invalid Username' })
  };

  const passwordIsValid = await user.verifyPassword(password);
  if (!passwordIsValid) return res.status(400).json({ message: 'Invalid Password' });

  const token = await user.generateToken();
  return res.status(200).json({ token, user: await user.userResponse() });
};

export const signUp = async (req: Request, res: Response) => {
  const { username, password, isAdmin } = req.body;
  
  const userExists = await Users.findOne({ username }).exec();
  if (userExists) {
    return res.status(400).json({ message: 'Username Already Exists' })
  };

  const user = await Users.createNewUser(
    username,
    password,
    isAdmin? isAdmin: false
  );

  const token = await user.generateToken();
  return res.status(201).json({ token, user: await user.userResponse() });
};