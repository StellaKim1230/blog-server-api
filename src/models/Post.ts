import mongoose, { Schema, Document } from 'mongoose'
import { Comment } from './Comment'

export interface Post extends Document {
  _id: string
  title: string
  content: string
  comments: Comment[]
}

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

export default mongoose.model<Post>('Post', PostSchema)
