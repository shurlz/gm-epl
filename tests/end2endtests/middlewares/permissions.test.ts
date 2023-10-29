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

const ADMIN_PROTECTED_ROUTE = "/teams" // only admins can make a POST request
const BASIC_PROTECTED_ROUTE = "/fixtures/pending" // all type of users can make a GET

describe("Test User & Admin Protected Middleware", () => {

  it("Test Protected Route Without Token", async () => {
    const res = await request(app).get(BASIC_PROTECTED_ROUTE)
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Token Missing');
  });

  it("Test Basic Protected Route with [Admin & Basic] Users", async () => {
    const basicUser = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), false);
    const adminUser = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);

    const basicRes = await request(app).get(BASIC_PROTECTED_ROUTE)
    .set("Authorization", `Bearer ${await basicUser.generateToken()}`);
    expect(basicRes.statusCode).toBe(200);

    const adminRes = await request(app).get(BASIC_PROTECTED_ROUTE)
    .set("Authorization", `Bearer ${await adminUser.generateToken()}`);
    expect(adminRes.statusCode).toBe(200);
  });

  it("Test Admin Protected Route with [Admin & Basic] Users", async () => {
    const basicUser = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), false);
    const adminUser = await Users.createNewUser(faker.person.fullName(), faker.internet.password(), true);

    const payload = { "name": "John FC", "location": "London" };
    const basicRes = await request(app).post(ADMIN_PROTECTED_ROUTE).send(payload)
    .set("Authorization", `Bearer ${await basicUser.generateToken()}`);
    expect(basicRes.statusCode).toBe(401);
    expect(basicRes.body.error).toBe('Action Forbidden For Non-Admins');

    const adminRes = await request(app).post(ADMIN_PROTECTED_ROUTE).send(payload)
    .set("Authorization", `Bearer ${await adminUser.generateToken()}`);
    expect(adminRes.statusCode).toBe(201);
  });
});