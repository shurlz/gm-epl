import dotenv from 'dotenv';
dotenv.config();
import app from '../../../src/app';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Users from '../../../src/models/users.model';
import redis from '../../../src/services/redis.service';
import { MONGO_URL } from '../../../src/constants/env.constants';


beforeAll(async () => { await mongoose.connect(MONGO_URL) });
afterAll(async () => { await mongoose.connection.close() });

afterAll(async () => { await redis.quit() });


describe("Test Request Payload Validator Middleware", () => {
  it("Auth Payload Validator", async () => {
    const res = await request(app).post("/auth/signup").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"username" is required');
  });

  it("Teams Payload Validator", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);
    const res = await request(app).post("/teams").send({})
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"name" is required');
  });

  it("Fixtures Payload Validator", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);
    const res = await request(app).post("/fixtures").send({})
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"homeTeamId" is required');
  });
});