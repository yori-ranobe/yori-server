import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetMangaDexMangaListInputType {
  @Field()
  limit: number;

  @Field()
  offset: number;
}

@InputType()
export class GetMangaDexMangaByIdInputType {
  @Field()
  mangaId: string;
}
