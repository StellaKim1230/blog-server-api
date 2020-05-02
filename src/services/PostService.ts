import PostModel from '../models/Post'

export default class PostService {
  posts = [{
    id: 1,
    title: 'test1'
  }, {
    id: 2,
    title: 'test2'
  }]

  public async list() {
    try {
      const docs = await PostModel.find({})
      return docs
    } catch(e) {
      console.error(e)
    }
  }

  public findById(id: number) {
    return this.posts.find(post => post.id === id)
  }
}
