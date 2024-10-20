import { Router } from "express";
import {
  registerUser,
  loginUser,
  signout,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", signout);

export default router;