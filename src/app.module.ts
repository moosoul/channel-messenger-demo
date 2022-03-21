import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ChannelsModule } from './modules/channels/channels.module';
import { MessagesModule } from './modules/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/config-module.options';
import { typeOrmModuleOptions } from './config/typeorm-module.options';
import { AppController } from './app.controller';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      debug: false,
      formatError: (error: GraphQLError) => {
        if (error.message === 'VALIDATION_ERROR') {
          const extensions = {
            code: 'VALIDATION_ERROR',
            errors: [],
          };
          Object.keys(error.extensions.invalidArgs).forEach((key) => {
            const constraints = [];
            Object.keys(error.extensions.invalidArgs[key].constraints).forEach(
              (_key) => {
                constraints.push(
                  error.extensions.invalidArgs[key].constraints[_key],
                );
              },
            );
            extensions.errors.push({
              field: error.extensions.invalidArgs[key].property,
              errors: constraints,
            });
          });
          const graphQLFormattedError: GraphQLFormattedError = {
            message: 'VALIDATION_ERROR',
            extensions: extensions,
          };
          return graphQLFormattedError;
        } else {
          return error;
        }
      },
    }),
    ChannelsModule,
    MessagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
