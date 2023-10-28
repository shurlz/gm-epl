import { Document, Model } from "mongoose";

export interface ITeam extends Document {
  name: string;
  location: string;
  isArchived?: boolean;
  archive(): Promise<void>;
};

export interface ITeamModel extends Model<ITeam> {
  createNewTeam(name: string, location: string): Promise<ITeam>;
};