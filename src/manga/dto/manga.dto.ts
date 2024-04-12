import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class FetchMangaOptions {
  @Field({ nullable: true })
  page?: string;

  @Field({ nullable: true })
  genres?: string;

  @Field({ nullable: true })
  nsfw?: string;

  @Field({ nullable: true })
  type?: string;
}

@InputType()
export class SearchMangaOptions {
  @Field()
  text: string;

  @Field({ nullable: true })
  nsfw?: string;

  @Field({ nullable: true })
  type?: string;
}

@InputType()
export class MangaOptions {
  @Field()
  id: string;
}

@InputType()
export class GetMangaOptions extends MangaOptions {}

@InputType()
export class GetChaptersOptions extends MangaOptions {}

@InputType()
export class GetImagesOptions extends MangaOptions {}

@ObjectType()
export class MangaDTO {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  sub_title: string;

  @Field()
  status: string;

  @Field()
  thumb: string;

  @Field()
  summary: string;

  @Field(() => [String])
  authors: string[];

  @Field(() => [String])
  genres: string[];

  @Field()
  nsfw: boolean;

  @Field()
  type: string;

  @Field()
  total_chapter: number;

  @Field()
  create_at: number;

  @Field()
  update_at: number;
}

@ObjectType()
export class ChapterDTO {
  @Field()
  id: string;

  @Field()
  manga: string;

  @Field()
  title: string;

  @Field()
  create_at: number;

  @Field()
  update_at: number;
}

@ObjectType()
export class MangaImageDTO {
  @Field()
  id: string;

  @Field()
  chapter: string;

  @Field()
  manga: string;

  @Field()
  index: number;

  @Field()
  link: string;
}
