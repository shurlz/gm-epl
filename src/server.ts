import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import mongoose from 'mongoose';
import { SeedDatabase } from './utils/seed.db';
import { PORT } from './constants/env.constants';
import ConnectToMongoDB from './services/mongo.service';

ConnectToMongoDB();

mongoose.connection.once('open', () => {
  console.log('Connected To Database');
  const seed = new SeedDatabase().checkDBSizeAndPopulate();
  app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});