import Fixtures from '../models/fixtures.model';
import { Request, Response } from 'express';


export const createFixture = async (req: Request, res: Response) => {
  try {
    const { homeTeamId, awayTeamId, isCompleted } = req.body;
    const fixture = await Fixtures.createNewFixture(homeTeamId, awayTeamId, isCompleted);
    const createdFixture = await fixture.populate('homeTeamId awayTeamId');
    return res.status(201).json({ createdFixture });
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  };
};

export const getFixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixtures.find().populate('homeTeamId awayTeamId').exec();
  return res.status(200).json(fixtures);
};

export const getCompletedFixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixtures.find({ isCompleted: true }).populate('homeTeamId awayTeamId').exec();
  return res.status(200).json(fixtures);
};

export const getPendingFixtures = async (req: Request, res: Response) => {
  const fixtures = await Fixtures.find({ isCompleted: false }).populate('homeTeamId awayTeamId').exec();
  return res.status(200).json(fixtures);
};

export const updateFixture = async (req: Request, res: Response) => {
  const { fixtureId } = req.params;
  const { homeTeamId, awayTeamId, isCompleted } = req.body;

  const fixture = await Fixtures.findOne({ _id: fixtureId }).exec();

  if (!fixture) return res.status(400).json({ message: 'Invalid Fixture ID' });

  if (homeTeamId) fixture.homeTeamId = homeTeamId;
  if (awayTeamId) fixture.awayTeamId = awayTeamId;
  if (isCompleted) fixture.isCompleted = isCompleted;
  const updatedFixture = await fixture.save();
  await updatedFixture.populate('homeTeamId awayTeamId');

  return res.status(200).json({ updatedFixture });
};

export const deleteFixture = async (req: Request, res: Response) => {
  const { fixtureId } = req.params;
  const fixture = await Fixtures.findOneAndDelete({ _id: fixtureId }).exec();

  if (!fixture) return res.status(400).json({ message: 'Invalid Fixture ID' });
  await fixture.populate('homeTeamId awayTeamId');

  return res.status(200).json({ 'deletedFixture': fixture });
};