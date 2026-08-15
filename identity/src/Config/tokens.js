import jwt from "jsonwebtoken"
import RefreshToken from "../Models/refreshToken-model.js"
import crypto from "crypto"

const generateToken = async (user) => {
  const jwtToken = jwt.sign({
    userId: user._id,
    username: user.username,
  }, process.env.JWT_SECRET, { expiresIn: "15m" })

  const token = crypto.randomBytes(15).toString("hex")
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)

  await RefreshToken.create({
    token,
    userId: user._id,
    expires,
  })

  return { jwtToken, token }
}
