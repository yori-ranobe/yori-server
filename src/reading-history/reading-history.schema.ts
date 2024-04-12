import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReadingHistoryDocument = ReadingHistory & Document;

@Schema()
export class ReadingHistory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  mangaId: string;

  @Prop({ required: true })
  chapterId: string;

  @Prop({ required: true })
  chapterValue: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const ReadingHistorySchema =
  SchemaFactory.createForClass(ReadingHistory);
