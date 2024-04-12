import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { ReadingHistoryDTO } from './dto/reading-history.dto';
import { ReadingHistoryService } from './reading-history.service';

@Resolver()
export class ReadingHistoryResolver {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}

  @Mutation(() => ReadingHistoryDTO)
  async saveReadingHistory(
    @Args('userId') userId: string,
    @Args('mangaId') mangaId: string,
    @Args('chapterId') chapterId: string,
  ): Promise<ReadingHistoryDTO> {
    return this.readingHistoryService.saveReadingHistory(
      userId,
      mangaId,
      chapterId,
    );
  }

  @Query(() => [ReadingHistoryDTO])
  async getReadingHistory(
    @Args('userId') userId: string,
  ): Promise<ReadingHistoryDTO[]> {
    return this.readingHistoryService.getReadingHistory(userId);
  }
}
