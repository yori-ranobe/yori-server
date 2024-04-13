import { ObjectType, InputType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserLibraryDTO {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field()
  status: string;
}

@InputType()
export class AddToLibraryInput {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field()
  status: string;
}

@InputType()
export class UpdateStatusInput {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field()
  status: string;
}
