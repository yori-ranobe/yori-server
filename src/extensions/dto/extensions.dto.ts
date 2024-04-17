import {
  Field,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';

export enum MangaOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ImagesTypeEnum {
  DEFAULT = 'DEFAULT',
  COMPRESSED = 'COMPRESSED',
}

registerEnumType(MangaOrderEnum, {
  name: 'MangaOrderEnum',
});

registerEnumType(ImagesTypeEnum, {
  name: 'ImagesTypeEnum',
});

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

  @Field({ nullable: true })
  year?: number;

  @Field()
  cover: string;

  @Field({ nullable: true })
  latestUploadedChapter?: string;

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

@ObjectType()
export class ChapterImagesDTO {
  @Field(() => [String])
  images: string[];
}

@InputType()
export class MangaOrderOptionsInput {
  @Field(() => MangaOrderEnum, { nullable: true })
  title?: MangaOrderEnum;

  @Field(() => MangaOrderEnum, { nullable: true })
  year?: MangaOrderEnum;

  @Field(() => MangaOrderEnum, { nullable: true })
  createdAt?: MangaOrderEnum;

  @Field(() => MangaOrderEnum, { nullable: true })
  updatedAt?: MangaOrderEnum;

  @Field(() => MangaOrderEnum, { nullable: true })
  latestUploadedChapter?: MangaOrderEnum;

  @Field(() => MangaOrderEnum, { nullable: true })
  followedCount?: MangaOrderEnum;

  @Field(() => MangaOrderEnum, { nullable: true })
  relevance?: MangaOrderEnum;
}

@InputType()
export class GetMangaListInputType {
  @Field()
  extension: string;

  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  offset: number;

  @Field(() => MangaOrderOptionsInput, { nullable: true })
  order?: MangaOrderOptionsInput;
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

@InputType()
export class GetChapterImagesInputType {
  @Field()
  extension: string;

  @Field()
  chapterId: string;

  @Field(() => ImagesTypeEnum, { defaultValue: 'DEFAULT' })
  imagesType: ImagesTypeEnum;
}
