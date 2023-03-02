import { Schema, model } from 'mongoose';

const answerSchema = new Schema({
    answer: [String],
    correct: Boolean,
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
  });

export default model('Answer', answerSchema);