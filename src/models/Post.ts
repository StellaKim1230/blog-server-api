import mongoose, { Schema, Document } from 'mongoose'
import { Comment } from './Comment'
import { User } from './User'

export interface Post extends Document {
  title: string
  content: string
  comments: Comment[]
  author: User
}

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model<Post>('Post', PostSchema)
