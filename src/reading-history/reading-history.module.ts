import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadingHistory, ReadingHistorySchema } from './reading-history.schema';
import { ReadingHistoryResolver } from './reading-history.resolver';
import { ReadingHistoryService } from './reading-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReadingHistory.name, schema: ReadingHistorySchema },
    ]),
  ],
  providers: [ReadingHistoryResolver, ReadingHistoryService],
})
export class UserLibraryModule {}
