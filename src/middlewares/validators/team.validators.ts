import Joi from 'joi';

export const teamRequest = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required()
});