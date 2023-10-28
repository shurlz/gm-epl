import express, { Router } from 'express';
import { advancedSearch } from '../controllers/search.controller';
import Validate from '../middlewares/validators/validator';
import { searchRequest } from '../middlewares/validators/search.validators';

const router: Router = express.Router();

router.post('/', Validate(searchRequest), advancedSearch);

export default router;