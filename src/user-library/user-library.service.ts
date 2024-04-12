import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLibrary, UserLibraryDocument } from './user-library.schema';

@Injectable()
export class UserLibraryService {
  constructor(
    @InjectModel(UserLibrary.name)
    private userLibraryModel: Model<UserLibraryDocument>,
  ) {}

  async addToLibrary(
    userId: string,
    mangaId: string,
    status: string,
  ): Promise<UserLibrary> {
    const userLibrary = new this.userLibraryModel({ userId, mangaId, status });
    return userLibrary.save();
  }

  async updateStatus(
    userId: string,
    mangaId: string,
    status: string,
  ): Promise<UserLibrary> {
    const userLibrary = await this.userLibraryModel
      .findOne({ userId, mangaId })
      .exec();
    if (!userLibrary) {
      throw new Error('Manga not found in user library');
    }
    userLibrary.status = status;
    return userLibrary.save();
  }

  async removeFromLibrary(userId: string, mangaId: string): Promise<void> {
    await this.userLibraryModel.deleteOne({ userId, mangaId }).exec();
  }

  async getLibrary(userId: string): Promise<UserLibrary[]> {
    return this.userLibraryModel.find({ userId }).exec();
  }
}
