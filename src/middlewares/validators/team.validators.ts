import Joi from 'joi';

export const teamRequest = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});