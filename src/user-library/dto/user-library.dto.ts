import {
  ObjectType,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';

enum MangaStatus {
  COMPLETED = 'completed',
  READING = 'reading',
  ABANDONED = 'abandoned',
}

registerEnumType(MangaStatus, { name: 'MangaStatus' });

@ObjectType()
export class UserLibraryDTO {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field(() => MangaStatus)
  status: MangaStatus;
}

@InputType()
export class AddToLibraryInput {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field(() => MangaStatus)
  status: MangaStatus;
}

@InputType()
export class UpdateStatusInput {
  @Field()
  userId: string;

  @Field()
  mangaId: string;

  @Field(() => MangaStatus)
  status: MangaStatus;
}
