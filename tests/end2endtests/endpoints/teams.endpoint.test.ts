import dotenv from 'dotenv';
dotenv.config();
import app from '../../../src/app';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Users from '../../../src/models/users.model';
import Teams from '../../../src/models/teams.model';
import redis from '../../../src/services/redis.service';
import { MONGO_URL } from '../../../src/constants/env.constants';


beforeAll(async () => { await mongoose.connect(MONGO_URL) });
afterAll(async () => { await mongoose.connection.close() });

afterAll(async () => { await redis.quit() });


describe("Teams CRUD Test", () => {
  const payload = {
    name: faker.company.name(),
    location: faker.location.city()
  };
  it("test create team endpoint", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);

    const res = await request(app).post("/teams").send(payload)
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.team.name).toBe(payload.name);
    expect(res.body.team.location).toBe(payload.location);
  });

  it("test update team endpoint", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);
    const team = await Teams.createNewTeam(faker.company.name(), faker.location.city());

    const res = await request(app).put(`/teams/${team._id}`).send({"name": "new name"})
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.updatedTeam._id).toBe(String(team._id));
    expect(res.body.updatedTeam.location).toBe(team.location);
    expect(res.body.updatedTeam.name).toBe("new name");

    const updatedTeam = await Teams.findOne({ _id: team._id }).exec();
    expect(updatedTeam?.name).toBe("new name");
  });

  it("test delete team endpoint", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);
    const team = await Teams.createNewTeam(faker.company.name(), faker.location.city());

    const res = await request(app).delete(`/teams/${team._id}`)
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.deletedTeam._id).toBe(String(team._id));
    expect(res.body.deletedTeam.location).toBe(team.location);
    expect(res.body.deletedTeam.name).toBe(team.name);

    const deletedTeam = await Teams.findOne({ _id: team._id }).exec();
    expect(deletedTeam).toBeNull();
  });

  it("test get teams endpoint", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);
    const team = await Teams.createNewTeam(faker.company.name(), faker.location.city());

    const res = await request(app).get(`/teams`)
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe("object");
  });
});
