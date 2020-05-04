import { Error } from 'mongoose'
import PostModel, { Post } from '../models/Post'

type PostInput = Pick<Post, 'title' | 'content'>

export default class PostService {
  public async list() {
    try {
      const posts = await PostModel.find({})
      return posts
    } catch(e) {
      console.error(e)
    }
  }

  public async findById(id: string) {
    const post = await PostModel.findById(id)
    return post
  }

  public async create(postInput: PostInput) {
    const post = new PostModel(postInput)
    const err = post.validateSync()

    if (err instanceof Error.ValidationError) {
      return null
    }

    return await post.save()
  }

  public async delete(id: string) {
    const isDeleted = await PostModel.deleteOne({ _id: id })
    return isDeleted.deletedCount
  }
}
