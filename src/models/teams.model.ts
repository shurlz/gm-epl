import mongoose, { Schema } from "mongoose";
import { ITeam, ITeamModel } from "../types/teams.types";


const teamsSchema: Schema<ITeam> = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  location: String,
  isArchived: {
    type: Boolean,
    default: false
  },
});

teamsSchema.methods.archive = async function (): Promise<void> {
  this.isArchived = true;
  await this.save;
};

teamsSchema.statics.createNewTeam = async function (
  name: string, location: string
): Promise<ITeam> {
  const team = await this.create({ name, location });
  return team;
};

const Teams: ITeamModel = mongoose.model<ITeam, ITeamModel>('Teams', teamsSchema);

export default Teams;