import dotenv from 'dotenv';
dotenv.config();
import app from '../../src/app';
import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Users from '../../src/models/users.model';
import { MONGO_URL } from '../../src/constants/env.constants';

beforeAll(async () => {
  await mongoose.connect(MONGO_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User [Create User; Generate Token; Verify Password; Decrypt Token]", () => {
  it("test static method to create user works", async () => {
    const [username, password] = [faker.person.firstName(), faker.internet.password()]
    const user = await Users.createNewUser(username, password);
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
    expect(typeof user.password).toBe("string");
  });

  it("test method generate user token works", async () => {
    const [username, password] = [faker.person.firstName(), faker.internet.password()]
    const user = await Users.createNewUser(username, password);
    expect(user).toBeDefined();
    const token = await user.generateToken();
    expect(typeof token).toBe("string");
  });

  it("test method verify password works", async () => {
    const [username, password] = [faker.person.firstName(), faker.internet.password()]
    const user = await Users.createNewUser(username, password);
    expect(user).toBeDefined();
    const verifyPassword = await user.verifyPassword(password);
    expect(verifyPassword).toBe(true);
    const verifyPassword2 = await user.verifyPassword("wrong-password");
    expect(verifyPassword2).toBeFalsy();
  });

  it("test static method decrypt token works", async () => {
    const [username, password] = [faker.person.firstName(), faker.internet.password()]
    const user = await Users.createNewUser(username, password);
    expect(user).toBeDefined();
    const token = await user.generateToken();
    const decryptedToken = await Users.decryptToken(token);
    expect(decryptedToken).toBeDefined();
  });
});
