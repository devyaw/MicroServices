import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true, minLength: 4, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 5 },
},{ timestamps: true });

userSchema.index({ username: "text" })

userSchema.pre("save", async function () {

  try {
    this.password = await argon2.hash(this.password);

  } catch (error) {
    throw error;

  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const user = mongoose.model("users", userSchema);

export default user;
