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


// basically, after 40 requests within a 2 hours time frame, users should be limited

describe("Test RateLimiting Middleware", () => {

  it("Test RateLimiting Middleware", async () => {
    const user = await Users.createNewUser(faker.person.fullName(), faker.internet.password());

    // make random 40 get requests
    for (let i=0; i < 41; i++) {
        await request(app).get("/teams")
        .set("Authorization", `Bearer ${await user.generateToken()}`);
    };

    const res = await request(app).get("/teams")
    .set("Authorization", `Bearer ${await user.generateToken()}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('youve reached your limit [40 API calls every 2 hours]');
  });
});