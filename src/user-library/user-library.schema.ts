import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserLibraryDocument = UserLibrary & Document;

@Schema()
export class UserLibrary {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  mangaId: string;

  @Prop({ required: true, enum: ['completed', 'reading', 'abandoned'] })
  status: string;
}

export const UserLibrarySchema = SchemaFactory.createForClass(UserLibrary);
