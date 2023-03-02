
import { Schema, model } from 'mongoose';

const lessonSchema = new Schema({
    title: String,
    description: String,
    level: { type: Schema.Types.ObjectId, ref: 'Level' },
  });

export default model('Lesson', lessonSchema);