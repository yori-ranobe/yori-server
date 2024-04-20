import { Field, InputType, OmitType } from '@nestjs/graphql';
import {
  GetMangaByIdInputType,
  GetChapterImagesInputType,
  MangaOrderOptionsInput,
  SearchMangaInputType,
} from '../../dto/extensions.dto';

@InputType()
export class GetMangaDexMangaListInputType {
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
export class GetMangaDexMangaByIdInputType extends OmitType(
  GetMangaByIdInputType,
  ['extension'],
) {}

@InputType()
export class SearchMangaDexMangaInputType extends OmitType(
  SearchMangaInputType,
  ['extension'],
) {}

@InputType()
export class GetMangaDexChapterImagesInputType extends OmitType(
  GetChapterImagesInputType,
  ['extension'],
) {}
