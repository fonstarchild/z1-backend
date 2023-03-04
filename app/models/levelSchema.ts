import { Schema, model } from 'mongoose'

const levelSchema = new Schema({
  title: String,
  description: String,
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
})

export default model('Level', levelSchema)
