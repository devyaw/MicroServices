import express from 'express'
import {createPost} from '../Controllers/post-controller.js'
import postMiddleware from '../Middleware/post-middleware.js'

const router = express.Router()

router.use(postMiddleware)

router.post('/posts/create', createPost)


export default router
