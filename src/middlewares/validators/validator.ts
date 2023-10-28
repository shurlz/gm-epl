import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';


const ValidatePayload = (Object: Joi.ObjectSchema) =>
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await Object.validateAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).json({ error: error.message });
      };
      
      return res.status(500).json({ error: 'Internal Server Error'});
    };
};

export default ValidatePayload;