import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLibrary, UserLibrarySchema } from './user-library.schema';
import { UserLibraryResolver } from './user-library.resolver';
import { UserLibraryService } from './user-library.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLibrary.name, schema: UserLibrarySchema },
    ]),
  ],
  providers: [UserLibraryResolver, UserLibraryService],
})
export class UserLibraryModule {}
