import mongoose, { Schema } from "mongoose";
import { IFixture, IFixtureModel } from "../types/fixtures.types";
import { BASE_URL } from "../constants/app.constants";


const fixturesSchema: Schema<IFixture> = new mongoose.Schema({
  homeTeamId: {
    type: Schema.Types.ObjectId,
    ref: 'Teams', // Referencing the 'Teams' model
    required: true,
  },
  awayTeamId: {
    type: Schema.Types.ObjectId,
    ref: 'Teams', // Referencing the 'Teams' model
    required: true,
  },
  isCompleted: Boolean,
  uniqueLink: {
    type: String,
    required: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
});

fixturesSchema.methods.archive = async function (): Promise<boolean> {
  this.isArchived = true;
  await this.save();
  return true;
};

fixturesSchema.methods.generateUniqueLink = async function (): Promise<string> {
  if (this.uniqueLink) return this.uniqueLink;

  const uniqueLink = `${BASE_URL}/epl/${this._id}`;
  this.uniqueLink = uniqueLink;
  await this.save();

  return uniqueLink;
};

fixturesSchema.statics.createNewFixture = async function (
  homeTeamId: string, awayTeamId: string, isCompleted: boolean
): Promise<IFixture> {
  const fixture = await this.create({ homeTeamId, awayTeamId, isCompleted });
  // create unique link on fixture creation
  await fixture.generateUniqueLink();
  return fixture;
};

const Fixtures: IFixtureModel = mongoose.model<IFixture, IFixtureModel>('Fixtures', fixturesSchema);

export default Fixtures;