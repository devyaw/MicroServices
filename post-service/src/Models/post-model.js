import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  mediaIds: [{type:String, required:true}],
  content: { type: String, required: true}
})

postSchema.index({ title: "text" })


const posts = mongoose.model("posts", postSchema)


export default posts
