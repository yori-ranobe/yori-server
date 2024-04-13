import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class MangaExtensionDTO {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  year: number;

  @Field()
  cover: string;
}

@ObjectType()
export class ChapterDTO {
  @Field()
  id: string;

  @Field({ nullable: true })
  volume: string | null;

  @Field()
  chapter: string;

  @Field()
  publishAt: Date;
}

@ObjectType()
export class ExtendedMangaDTO {
  @Field(() => MangaExtensionDTO)
  manga: MangaExtensionDTO;

  @Field(() => [ChapterDTO])
  chapters: ChapterDTO[];
}

@InputType()
export class GetMangaListInputType {
  @Field()
  extension: string;

  @Field()
  limit: number;

  @Field()
  offset: number;
}

@InputType()
export class GetMangaByIdInputType {
  @Field()
  extension: string;

  @Field()
  mangaId: string;
}
