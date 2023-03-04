import { Schema, model } from 'mongoose'

const accountSchema = new Schema({
  authtoken: String,
  role: String,
  username: String,
  seenContent: [{ type: Schema.Types.ObjectId, ref: 'TextContent' }]
})

export default model('Account', accountSchema)
