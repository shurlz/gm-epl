import Joi from 'joi';

export const searchRequest = Joi.object({
    searchParam: Joi.string().min(1).required()
});