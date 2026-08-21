
import jwt from 'jsonwebtoken'

const postMiddleware = (req, res, next) => {
  const auth = req.headers['authorization']
  const token = auth?.split(' ')[1]


  if (!token) {
    return res.status(401).json({ message: 'No token provided, Login first' })
  }

  const autenticToken = jwt.verify(token, process.env.JWT_SECRET)


  req.userId = { autenticToken }
  next()
}

export default postMiddleware
