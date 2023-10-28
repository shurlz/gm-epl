import express, { Router } from 'express';
import Validate from '../middlewares/validators/validator';
import rateLimiter from '../middlewares/ratelimit/ratelimiter';
import { verifyAdmin, verifyToken } from '../middlewares/auth/verifyToken';
import { fixtureRequest } from '../middlewares/validators/fixture.validators';
import { 
  createFixture, getCompletedFixtures, getPendingFixtures, getFixtures, updateFixture, deleteFixture
} from '../controllers/fixtures.controller';

const router: Router = express.Router();

router.get('/', verifyToken, rateLimiter, getFixtures);
router.get('/pending', verifyToken, rateLimiter, getPendingFixtures);
router.get('/completed', verifyToken, rateLimiter, getCompletedFixtures);

// admin protected routes
router.post('/', verifyAdmin, Validate(fixtureRequest), createFixture);
router.put('/:fixtureId', verifyAdmin, updateFixture);
router.delete('/:fixtureId', verifyAdmin, deleteFixture);

export default router;