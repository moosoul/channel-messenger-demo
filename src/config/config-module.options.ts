import { ConfigModuleOptions } from '@nestjs/config';
import { customValidationSchema } from './custom-validation.schema';
import * as path from 'path';
export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [path.resolve(`.env.${process.env.NODE_ENV || 'development'}`)],
  validationSchema: customValidationSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  expandVariables: true,
};
