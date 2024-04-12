import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MangaService } from './manga.service';

@Module({
  imports: [HttpModule],
  providers: [MangaService],
  exports: [MangaService],
})
export class MangaModule {}
