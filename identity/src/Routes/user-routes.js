import { signUpController, signInController } from "../Controllers/identity-controller.js";
import express from "express";


const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);

export default router;
