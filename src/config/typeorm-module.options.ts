import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as path from 'path';
export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      database: configService.get<string>('DATABASE_DATABASE'),
      synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
      logging: configService.get<boolean>('DATABASE_LOGGING'),
      type: configService.get<string>('DATABASE_TYPE'),
      autoLoadEntities: true,
      keepConnectionAlive: true,
    };
  },
};
