import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Teams from '../../src/models/teams.model';
import { MONGO_URL } from '../../src/constants/env.constants';

beforeAll(async () => {
  await mongoose.connect(MONGO_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Teams [Create Team; Archive]", () => {
  it("test static method to create team works", async () => {
    const [name, location] = [faker.company.name(), faker.location.city()]
    const team = await Teams.createNewTeam(name, location);
    expect(team).toBeDefined();
    expect(team.name).toEqual(name);
    expect(team.location).toEqual(location);
    expect(team.isArchived).toBeFalsy();
  });

  it("test method archive team", async () => {
    const [name, location] = [faker.company.name(), faker.location.city()]
    const team = await Teams.createNewTeam(name, location);
    expect(team).toBeDefined();
    expect(team.isArchived).toBeFalsy();
    await team.archive();
    const archiveteam = await Teams.findOne({ _id: team._id }).exec();
    expect(archiveteam?._id).toEqual(team._id);
    // expect(archiveteam?.isArchived).toBeTruthy();
  });
});