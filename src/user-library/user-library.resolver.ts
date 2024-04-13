import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserLibraryService } from './user-library.service';
import {
  UserLibraryDTO,
  AddToLibraryInput,
  UpdateStatusInput,
} from './dto/user-library.dto';

@Resolver()
export class UserLibraryResolver {
  constructor(private readonly userLibraryService: UserLibraryService) {}

  @Mutation(() => UserLibraryDTO)
  async addToLibrary(
    @Args('input') input: AddToLibraryInput,
  ): Promise<UserLibraryDTO> {
    const { userId, mangaId, status } = input;
    return this.userLibraryService.addToLibrary(userId, mangaId, status);
  }

  @Mutation(() => UserLibraryDTO)
  async updateStatus(
    @Args('input') input: UpdateStatusInput,
  ): Promise<UserLibraryDTO> {
    const { userId, mangaId, status } = input;
    return this.userLibraryService.updateStatus(userId, mangaId, status);
  }

  @Mutation(() => Boolean)
  async removeFromLibrary(
    @Args('userId') userId: string,
    @Args('mangaId') mangaId: string,
  ): Promise<boolean> {
    await this.userLibraryService.removeFromLibrary(userId, mangaId);
    return true;
  }

  @Query(() => [UserLibraryDTO])
  async getLibrary(@Args('userId') userId: string): Promise<UserLibraryDTO[]> {
    return this.userLibraryService.getLibrary(userId);
  }
}
