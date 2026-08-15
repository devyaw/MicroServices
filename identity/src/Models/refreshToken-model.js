import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  expires: { type: Date, required: true },
  created: { type: Date, default: Date.now },
},{ timestamps: true });

const refreshToken = mongoose.model("refreshTokens", refreshTokenSchema);

export default refreshToken;
