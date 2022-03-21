import * as Joi from 'joi';

export const customValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_TYPE: Joi.string(),
  DATABASE_DATABASE: Joi.string(),
  DATABASE_SYNCHRONIZE: Joi.boolean(),
  DATABASE_LOGGING: Joi.boolean(),
});
