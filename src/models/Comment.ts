import mongoose, { Schema, Document } from 'mongoose'

export interface Comment extends Document {
  title: string
  content: string
}

const CommentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true}
})

export default mongoose.model<Comment>('Comment', CommentSchema)
