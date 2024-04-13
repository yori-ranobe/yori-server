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

  @Field(() => [TagDTO])
  tags: TagDTO[];
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

@ObjectType()
export class TagDTO {
  @Field()
  id: string;

  @Field()
  type: string;

  @Field()
  name: string;

  @Field()
  group: string;
}

@InputType()
export class GetMangaListInputType {
  @Field()
  extension: string;

  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  offset: number;
}

@InputType()
export class GetMangaByIdInputType {
  @Field()
  extension: string;

  @Field()
  mangaId: string;
}

@InputType()
export class SearchMangaInputType extends GetMangaListInputType {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  year: number;

  @Field(() => [String], { nullable: true })
  includedTags: string[];

  @Field(() => [String], { nullable: true })
  excludedTags: string[];
}
