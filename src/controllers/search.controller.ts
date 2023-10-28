import Teams from '../models/teams.model';
import Fixtures from '../models/fixtures.model';
import { Request, Response } from 'express';
import { IFixture } from '../types/fixtures.types';


export const advancedSearch = async (req: Request, res: Response) => {
  const { searchParam } = req.body;
  const fixturesHits = await Fixtures.find({}).populate([
    {
      path: 'homeTeamId',
      match: {
        $or: [
          { name: { $regex: searchParam, $options: "i" } }, // Match 'name' using regex
        ]
      },
      select: 'name location _id',
    },
    {
      path: 'awayTeamId',
      match: {
        $or: [
          { name: { $regex: searchParam, $options: "i" } }, // Match 'name' using regex
        ]
      },
      select: 'name location _id'
    },
  ]).exec();

  const filteredFixturesHitsData: IFixture[] = [];

  fixturesHits.map((resp) => {
    if (resp.homeTeamId != null && resp.awayTeamId != null) {
      filteredFixturesHitsData.push(resp);
    };
  });

  const teamsHits = await Teams.find({
    $or: [
      { name: { $regex: searchParam, $options: "i" } },
      { location: { $regex: searchParam, $options: "i" } }
    ]
  });

  const filteredTeamsHitsData = teamsHits; // just for naming consistency

  return res.status(200).json({ filteredFixturesHitsData, filteredTeamsHitsData });
};
