import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserLibrary {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field()
  status: string;
}
