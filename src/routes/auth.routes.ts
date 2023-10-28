import express, { Router } from 'express';
import { signIn, signUp } from '../controllers/auth.controller';
import Validate from '../middlewares/validators/validator';
import { authRequest } from '../middlewares/validators/auth.validators';

const router: Router = express.Router();

router.post('/signin', Validate(authRequest), signIn);
router.post('/signup', Validate(authRequest), signUp);

export default router;