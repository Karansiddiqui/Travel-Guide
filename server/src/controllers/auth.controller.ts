import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResolve.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { z } from "zod";

const userSchema = z.object({
  userName: z
    .string()
    .min(1, "Username is required")
    .regex(/^[a-z]+$/, "Username must be in lowercase letters only"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  fullName: z.string().min(1, "Full name is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

// Register User
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = userSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      status: "error",
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  const { userName, email, password, fullName } = validationResult.data;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email: email.toLowerCase(),
    password,
    fullName,
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      status: "error",
      errors: validationResult.error.flatten().fieldErrors,
    });
  }
  const { email, password } = validationResult.data;
  if ([email, password].some((field) => field?.trim() === "" || !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Email does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }
  // console.log(email, password);

  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");

  const cookieOptions: { httpOnly: boolean; secure: boolean } = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

// Sign Out
const signout = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Signing out...");

    if (!req.cookies.accessToken) {
      throw new ApiError(401, "User is not logged in");
    }
    res
      .clearCookie("accessToken")
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, signout };
