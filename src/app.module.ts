import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { MangaModule } from './manga/manga.module';
import { GraphqlModule } from './graphql/graphql.module';
import { UserLibraryModule } from './user-library/user-library.module';
import { ReadingHistoryModule } from './reading-history/reading-history.module';
import { ExtensionsModule } from './extensions/extensions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
    HealthModule,
    AuthModule,
    UserModule,
    MangaModule,
    UserLibraryModule,
    ReadingHistoryModule,
    GraphqlModule,
    ExtensionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
