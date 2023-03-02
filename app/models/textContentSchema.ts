import { Schema, model } from 'mongoose';

const textContentSchema = new Schema({
    content: String,
    image: String,
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  });

export default model('TextContent', textContentSchema);