import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import teamRoutes from './routes/teams.routes';
import searchRoutes from './routes/search.routes';
import fixturesRoutes from './routes/fixtures.routes';

const app: Application = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/search', searchRoutes);
app.use('/fixtures', fixturesRoutes);

// catch all unmatched requests
app.use((req, res, next) => {res.status(405).json({ message: 'Unsupported Request'})});

export default app;