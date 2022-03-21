import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { UserInputError } from 'apollo-server-express';
import { AppModule } from './app.module';

/**
 * The application entry
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new UserInputError('VALIDATION_ERROR', {
          invalidArgs: errors,
        });
      },
    }),
  );

  const PORT = configService.get<number>('PORT') || 3000;
  await app.listen(PORT);
  console.log(`The application running on env ${process.env.NODE_ENV}`);
  console.log(`HTTP Server ready at ${await app.getUrl()}`);
  console.log(`GraphQL Playground ready at ${await app.getUrl()}/graphql`);
}
bootstrap();
