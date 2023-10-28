import { Document, Model, Types } from "mongoose";
import { ITeam } from "./teams.types";

export interface IFixture extends Document {
  homeTeamId: Types.ObjectId | ITeam;
  awayTeamId: Types.ObjectId | ITeam;
  isCompleted: Boolean;
  uniqueLink?: string;
  isArchived?: boolean;
  archive(): Promise<void>;
  generateUniqueLink(): Promise<string>;
};

export interface IFixtureModel extends Model<IFixture> {
  createNewFixture(homeTeamId: string, awayTeamId: string, isCompleted: boolean): Promise<IFixture>;
};