import { Field, InputType, OmitType } from '@nestjs/graphql';
import {
  GetMangaByIdInputType,
  GetChapterImagesInputType,
  MangaOrderOptionsInput,
} from '../../dto/extensions.dto';

@InputType()
export class GetMangaDexMangaListInputType {
  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  offset: number;

  @Field(() => MangaOrderOptionsInput, { nullable: true })
  order?: MangaOrderOptionsInput;
}

@InputType()
export class GetMangaDexMangaByIdInputType extends OmitType(
  GetMangaByIdInputType,
  ['extension'],
) {}

@InputType()
export class SearchMangaDexMangaInputType extends GetMangaDexMangaListInputType {
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
export class GetMangaDexChapterImagesInputType extends OmitType(
  GetChapterImagesInputType,
  ['extension'],
) {}
