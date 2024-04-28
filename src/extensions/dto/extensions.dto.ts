import {
  Field,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';

export enum OrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ImagesTypeEnum {
  DEFAULT = 'DEFAULT',
  COMPRESSED = 'COMPRESSED',
}

registerEnumType(OrderEnum, {
  name: 'OrderEnum',
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
  cover: string;

  @Field(() => [String], { nullable: true })
  altTitles?: string[];

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  year?: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  state?: string;

  @Field(() => [String], { nullable: true })
  author?: string[];

  @Field(() => [String], { nullable: true })
  artist?: string[];

  @Field({ nullable: true })
  contentRating?: string;

  @Field({ nullable: true })
  originalLanguage?: string;

  @Field({ nullable: true })
  latestUploadedChapter?: string;

  @Field(() => [TagDTO], { nullable: true })
  tags?: TagDTO[];

  @Field(() => [RelatedMangaDTO], { nullable: true })
  related?: RelatedMangaDTO[];
}

@ObjectType()
export class RelatedMangaDTO {
  @Field()
  id: string;

  @Field()
  title: string;

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

  @Field()
  createdAt: string;
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
}

@ObjectType()
export class ChapterImagesDTO {
  @Field(() => [String])
  images: string[];
}

@InputType()
export class MangaOrderOptionsInput {
  @Field(() => OrderEnum, { nullable: true })
  title?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  year?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  createdAt?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  updatedAt?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  latestUploadedChapter?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  followedCount?: OrderEnum;

  @Field(() => OrderEnum, { nullable: true })
  relevance?: OrderEnum;
}

@InputType()
export class GetMangaListInputType {
  @Field()
  extension: string;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  offset?: number;

  @Field({ nullable: true })
  title?: string;

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
  year?: number;

  @Field(() => [String], { nullable: true })
  includedTags?: string[];

  @Field(() => [String], { nullable: true })
  excludedTags?: string[];
}

@ObjectType()
export class ChaptersListResponse {
  @Field(() => [ChapterDTO])
  chapters: ChapterDTO[];

  @Field(() => Number)
  total: number;
}

@InputType()
export class GetMangaChaptersInputType {
  @Field()
  extension: string;

  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field()
  mangaId: string;

  @Field(() => OrderEnum, { nullable: true })
  order?: OrderEnum;

  @Field(() => [String])
  translatedLanguage: string[];
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
