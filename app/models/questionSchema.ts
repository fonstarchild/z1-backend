import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
    question: String,
    type: String,
    hierarchy: Number,
    correctAnswer: [String],
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  });

export default model('Question', questionSchema);