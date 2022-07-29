import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  title: string;
  
  @Prop()
  description: string;

  @Prop()
  status: string;

  @Prop()
  user: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);