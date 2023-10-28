import express, { Router } from 'express';
import { verifyAdmin, verifyToken } from '../middlewares/auth/verifyToken';
import Validate from '../middlewares/validators/validator';
import rateLimiter from '../middlewares/ratelimit/ratelimiter';
import { teamRequest } from '../middlewares/validators/team.validators';
import { createTeam, getTeams, updateTeam, deleteTeam } from '../controllers/teams.controller';

const router: Router = express.Router();

router.get('/', verifyToken, rateLimiter, getTeams);

// admin protected routes
router.post('/', verifyAdmin, Validate(teamRequest), createTeam);
router.put('/:teamId', verifyAdmin, updateTeam);
router.delete('/:teamId', verifyAdmin, deleteTeam);

export default router;