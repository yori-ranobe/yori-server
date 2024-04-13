import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetMangaDexMangaListInputType {
  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  offset: number;
}

@InputType()
export class GetMangaDexMangaByIdInputType {
  @Field()
  mangaId: string;
}

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
