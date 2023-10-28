import { faker } from '@faker-js/faker';
import Users from "../models/users.model";
import Teams from '../models/teams.model';
import Fixtures from '../models/fixtures.model';


export class SeedDatabase {
  users: string[] = [];
  teams: string[] = [];
  fixtures: string[] = [];

  constructor() {}

  async populateUsers () {
    for (let i=0; i < 50; i++) {
      try {
        let newUser = await Users.createNewUser(
          faker.person.firstName(),
          faker.internet.password(),
        );
        this.users.push(newUser._id);
      } catch (err) {
        console.log(err);
      };
    }; 
  }

  async populateTeams () {
    for (let i=0; i < 50; i++) {
      try {
        let newTeam = await Teams.createNewTeam(
          faker.company.name(),
          faker.location.city()
        );
        this.teams.push(newTeam._id);
      } catch (err) {
        console.log(err);
      };
    }; 
  }

  async populateFixtures () {
    const isCompletedOptions: boolean[] = [true, false];

    for (let i=0; i < 50; i++) {
      try {
        let newFixture = await Fixtures.createNewFixture(
          this.teams[this.generateNum()],
          this.teams[this.generateNum()],
          isCompletedOptions[Math.floor(Math.random() * 2)]
        );
        this.fixtures.push(newFixture._id);
      } catch (err) {
        console.log(err);
      };
    }; 
  }

  generateNum (min=1, max=this.teams.length): number {
    // generate a random number between 1 and 49, hopefully
    return Math.floor(Math.random() * (max - min) + min) - min
  }

  async checkDBSizeAndPopulate () {
    // if data already exists, then don't populate
    if ((await Fixtures.find()).length > 20) return;

    await this.populateUsers();
    await this.populateTeams();
    await this.populateFixtures();
  }
};