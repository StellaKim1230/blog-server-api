import mongoose, { Schema, Document } from 'mongoose'
import { StringifyOptions } from 'querystring'

export interface User extends Document {
  name: StringifyOptions
  email: string
  password: string
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export default mongoose.model<User>('User', UserSchema, 'user')
