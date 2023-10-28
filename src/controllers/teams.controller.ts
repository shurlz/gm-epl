import Teams from '../models/teams.model';
import { Request, Response } from 'express';


export const createTeam = async (req: Request, res: Response) => {
  const { name, location } = req.body;
  const team = await Teams.createNewTeam(name, location);
  return res.status(201).json({ team });
};

export const getTeams = async (req: Request, res: Response) => {
  const teams = await Teams.find();
  return res.status(200).json(teams);
};

export const updateTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { name, location } = req.body;
  try {
    const team = await Teams.findOne({ _id: teamId }).exec();
    if (!team) return res.status(400).json({ message: 'Invalid Team ID' });

    if (name) team.name = name;
    if (location) team.location = location;
    const updatedTeam = await team.save();

    return res.status(200).json({ updatedTeam });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID Format' });
  };
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  try {
    const team = await Teams.findOneAndDelete({ _id: teamId }).exec();
    if (!team) return res.status(400).json({ message: 'Invalid Team ID' });
    return res.status(200).json({ 'deletedTeam': team });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID Format' });
  };
};