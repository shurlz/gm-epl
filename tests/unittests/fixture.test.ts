import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Fixtures from '../../src/models/fixtures.model';
import { MONGO_URL } from '../../src/constants/env.constants';
import { BASE_URL } from '../../src/constants/app.constants';

beforeAll(async () => {
  await mongoose.connect(MONGO_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Fixtures [Create Fixture; Generate Unique URL; Archive]", () => {
  it("test static method to create fixture works", async () => {
    const [homeTeamId, awayTeamId] = [faker.database.mongodbObjectId(), faker.database.mongodbObjectId()]
    const fixture = await Fixtures.createNewFixture(
        homeTeamId,
        awayTeamId,
        true
    );
    expect(fixture).toBeDefined();
    expect(String(fixture.homeTeamId)).toBe(homeTeamId);
    expect(String(fixture.awayTeamId)).toBe(awayTeamId);
    expect(fixture.isCompleted).toBeTruthy();
    expect(fixture.isArchived).toBeFalsy();
  });

  it("test method generate unique game url", async () => {
    const [homeTeamId, awayTeamId] = [faker.database.mongodbObjectId(), faker.database.mongodbObjectId()]
    const fixture = await Fixtures.createNewFixture(
        homeTeamId,
        awayTeamId,
        false
    );
    expect(fixture).toBeDefined();
    expect(typeof fixture.uniqueLink).toBe("string");
    expect(fixture.uniqueLink).toBe(`${BASE_URL}/epl/${fixture._id}`);
  });

  it("test method archive fixture", async () => {
    const [homeTeamId, awayTeamId] = [faker.database.mongodbObjectId(), faker.database.mongodbObjectId()]
    const fixture = await Fixtures.createNewFixture(
        homeTeamId,
        awayTeamId,
        false
    );
    expect(fixture).toBeDefined();
    expect(fixture.isArchived).toBeFalsy();
    await fixture.archive();
    const archiveFixture = await Fixtures.findOne({ _id: fixture._id }).exec();
    expect(archiveFixture?._id).toEqual(fixture._id);
    // expect(archiveFixture?.isArchived).toBeTruthy();
  });
});
