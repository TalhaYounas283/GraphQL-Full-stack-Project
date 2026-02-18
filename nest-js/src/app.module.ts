import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './User/user.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true, // Enable GraphQL Playground
      autoSchemaFile:join(process.cwd(), "src/schema.gql"),
      definitions:{
        path:join(process.cwd(), "src/schema.ts"),
        outputAs:"class",
      }
      // typePaths: [join(process.cwd(), 'src/**/*.graphql')], // Path to GraphQL schema files
    }),
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
