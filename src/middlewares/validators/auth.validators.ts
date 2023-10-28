import Joi from 'joi';

export const authRequest = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});