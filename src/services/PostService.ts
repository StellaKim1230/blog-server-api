import PostModel, { Post } from '../models/Post'

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

  public async create(postInput: Pick<Post, 'title' | 'content'>) {
    const { title, content } = postInput

    if (title && content) {
      const createdPost = await PostModel.create(postInput)
      return createdPost
    }

    return null
  }

  public async delete(id: string) {
    const isDeleted = await PostModel.deleteOne({ _id: id })
    return isDeleted.deletedCount
  }
}
