import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MangaResolver } from '../manga/manga.resolver';
import { MangaModule } from '../manga/manga.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MangaModule,
  ],
  providers: [MangaResolver],
})
export class GraphqlModule {}
