import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResolve.js";
import { ApiError } from "../utils/ApiError.js";
import connectionDB from "../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

// Register User
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const parsedUser = userSchema.parse(req.body);

  // Check if the user with the given email already exists
  const [existingUser]: [
    import("mysql2/promise").RowDataPacket[],
    import("mysql2").FieldPacket[]
  ] = await connectionDB.query("SELECT * FROM users WHERE email = ? LIMIT 1", [
    parsedUser.email,
  ]);

  if (existingUser.length > 0) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(parsedUser.password, 10);

  // Insert the new user into the database
  await connectionDB.query(
    "INSERT INTO users (username, email, password, fullName) VALUES (?, ?, ?, ?)",
    [
      parsedUser.userName,
      parsedUser.email.toLowerCase(),
      hashedPassword,
      parsedUser.fullName,
    ]
  );

  // Retrieve the newly created user (excluding password)
  const [createdUser] = await connectionDB.query(
    "SELECT id, username, email, fullName FROM users WHERE id = ?",
    [parsedUser.email]
  );
  console.log(createdUser);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return the created user in the response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const parsedUser = loginSchema.parse(req.body);

  if (
    [parsedUser.email, parsedUser.password].some(
      (field) => field?.trim() === "" || !field
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const [user]: [
    import("mysql2/promise").RowDataPacket[],
    import("mysql2").FieldPacket[]
  ] = await connectionDB.query("SELECT * FROM users WHERE email = ? LIMIT 1", [
    parsedUser.email,
  ]);

  if (user.length === 0) {
    throw new ApiError(401, "Email does not exist");
  }

  const isPasswordCorrect = await bcrypt.compare(
    parsedUser.password,
    user[0].password
  );
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }
  // console.log(email, password);

  const accessToken = jwt.sign(
    { userId: user[0].id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
  //   const loggedInUser = await User.findById(user._id).select("-password");

  const cookieOptions: { httpOnly: boolean; secure: boolean } = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
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
