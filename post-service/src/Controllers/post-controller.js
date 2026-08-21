import logger from '../Config/logger.js'
import posts from '../Models/post-model.js'


export const createPost = async (req, res) => {
  logger.info('Post creation endpoint hit')
  const { title, author, mediaIds, content } = req.body

  const uniqueTitle = await posts.findOne({ title })
  if (uniqueTitle) {
    return res.status(400).json({ message: 'Title must be unique' })
  }

  const post = new posts({ title, author, mediaIds: mediaIds || [], content })
  await post.save()

  res.status(201).json({ message: 'Post created successfully', post: post })
}

export const getAllPosts = async (req, res) => {
  const postsList = await posts.find()
  res.status(200).json(postsList)
}

export default { createPost, getAllPosts }
