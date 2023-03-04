import { Schema, model } from 'mongoose'

const lessonSchema = new Schema({
  title: String,
  description: String,
  hierarchy: Number,
  level: { type: Schema.Types.ObjectId, ref: 'Level' },
  content: [{ type: Schema.Types.ObjectId, ref: 'TextContent' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
})

export default model('Lesson', lessonSchema)
