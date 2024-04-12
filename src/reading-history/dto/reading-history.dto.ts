import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ReadingHistoryDTO {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field()
  chapterId: string;

  @Field()
  chapterValue: string;

  @Field()
  timestamp: Date;
}
