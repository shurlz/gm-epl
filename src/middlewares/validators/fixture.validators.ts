import Joi from 'joi';

export const fixtureRequest = Joi.object({
    homeTeamId: Joi.string().min(24).max(24).required(),
    awayTeamId: Joi.string().min(24).max(24).required(),
    isCompleted: Joi.boolean().required()
});