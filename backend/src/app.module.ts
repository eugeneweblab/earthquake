import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EarthquakeModule } from './earthquakes/earthquake.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      allowBatchedHttpRequests: true,
      playground: true,
      introspection: true,
    }),
    AuthModule,
    PrismaModule,
    EarthquakeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
