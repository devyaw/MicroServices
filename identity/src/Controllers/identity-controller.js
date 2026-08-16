import logger from "../Config/logger.js";
import validatedBody from "../Config/validation.js";
import user from "../Models/user-model.js";
import generateToken from '../Config/tokens.js'
import {validate} from "deep-email-validator"

export const signUpController = async (req, res) => {
  logger.info("Sign up request received");
  const { error } = validatedBody(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, email, password } = req.body;

  const validatedEmail = await validate({
    email: email,
    validateRegex: true,
    validateMx: true,
    validateDisposable: true,
    validateSMTP: false,
    validateTypo: true,
  });

  if (!validatedEmail.valid) {
    return res.status(400).json({ error: "Invalid email", details: validatedEmail.reason });
  }

  const isUsernameTaken = await user.findOne({$or: [{username}, {email}]})

  if (isUsernameTaken) {
    return res.status(400).json({ error: "Username or email already taken" });
  }

  const newUser = new user({username, email, password});
  await newUser.save();

  const { token, jwtToken } = await generateToken(newUser);

  res.status(201).json({ success: true, message:"User registered successfully", jwt: jwtToken, token: token});
}

export const signInController = async (req, res) => {
  logger.info("Sign in request received");
  const { error } = validatedBody(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;



  const existingUser = await user.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await existingUser.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const { token, jwtToken } = await generateToken(existingUser);

  res.status(200).json({ success: true, message: "User signed in successfully", jwt: jwtToken, token: token });
}

export default { signUpController, signInController }
