import { Error } from 'mongoose'
import PostModel, { Post } from '../models/Post'
import { User } from '../models/User'

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

  public async create(postInput: PostInput, user: User) {
    const post = new PostModel({ ...postInput, author: user._id })

    try {
      const err = post.validateSync()

      if (err instanceof Error.ValidationError) {
        return null
      }

      const res = await post.save()
      return await res.populate({ path: 'author', select: ['_id', 'email'] }).execPopulate()
    } catch (e) {
      console.log(e)
    }
  }

  public async delete(id: string, user: User) {
    const isDeleted = await PostModel.deleteOne({ _id: id, author: user._id })
    return isDeleted.deletedCount
  }
}
