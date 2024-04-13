import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MangaDexService } from './manga-dex.service';

@Module({
  imports: [HttpModule],
  providers: [MangaDexService],
  exports: [MangaDexService],
})
export class MangaDexModule {}
