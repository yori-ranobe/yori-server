import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ReadingHistory,
  ReadingHistoryDocument,
} from './reading-history.schema';

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectModel(ReadingHistory.name)
    private readingHistoryModel: Model<ReadingHistoryDocument>,
  ) {}

  async saveReadingHistory(
    userId: string,
    mangaId: string,
    chapterId: string,
  ): Promise<ReadingHistory> {
    const readingHistory = new this.readingHistoryModel({
      userId,
      mangaId,
      chapterId,
    });
    return readingHistory.save();
  }

  async getReadingHistory(userId: string): Promise<ReadingHistory[]> {
    return this.readingHistoryModel.find({ userId }).exec();
  }
}
