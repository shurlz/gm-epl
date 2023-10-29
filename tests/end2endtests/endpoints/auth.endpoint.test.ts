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


describe("Sign Up Test", () => {
  const requestPayload = {
    username: faker.person.fullName(),
    password: faker.internet.password()
  };
  it("test user signup [correct post credentials] endpoint", async () => {
      const res = await request(app).post("/auth/signup").send(requestPayload);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.username).toBe(requestPayload.username);
      expect(typeof res.body.token).toBe("string");
  });

  it("test user signup [duplicate post credentials] endpoint", async () => {
      const res = await request(app).post("/auth/signup").send(requestPayload);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.user).toBeUndefined();
      expect(res.body.message).toBe('Username Already Exists');
  });
});

describe("Sign In Test", () => {
  it("test user signin [correct post credentials] endpoint", async () => {
    const [username, password] = [faker.person.fullName(), faker.internet.password()];
    const user = await Users.createNewUser(username, password);

    const res = await request(app).post("/auth/signin").send({
      username, password
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe(username);
    expect(typeof res.body.token).toBe("string");
  });

  it("test user signin [wrong post credentials] endpoint", async () => {
    const [username, password] = [faker.person.fullName(), faker.internet.password()];
    const user = await Users.createNewUser(username, password);

    const res = await request(app).post("/auth/signin").send({
      "username": username, 
      "password": "wrong-password"
    });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.user).toBeUndefined();
    expect(res.body.message).toBe('Invalid Password');

    const res2 = await request(app).post("/auth/signin").send({
      "username": "wrong-username", 
      "password": password
    });
    
    expect(res2.statusCode).toBe(400);
    expect(res2.body.user).toBeUndefined();
    expect(res2.body.message).toBe('Invalid Username');
  });
});