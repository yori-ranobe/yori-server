import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExtensionsService } from './extensions.service';
import { ExtensionsResolver } from './extensions.resolver';
import { MangaDexModule } from './manga-dex/manga-dex.module';
import { MangaDexService } from './manga-dex/manga-dex.service';

@Module({
  imports: [MangaDexModule, HttpModule],
  providers: [ExtensionsService, ExtensionsResolver, MangaDexService],
  exports: [ExtensionsService],
})
export class ExtensionsModule {}
