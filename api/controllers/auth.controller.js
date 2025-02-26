import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendVerificationMail,
} from "../utils/user.util.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, rePassword } = req.body;
  if (!username || !password || !email || !rePassword) {
    throw new ApiError(400, "ALl fields are required");
  }

  if (password !== rePassword) {
    throw new ApiError(409, "Passwords do not match");
  }

  const userExists = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (userExists) {
    throw new ApiError(409, "User with the username or email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    },
  });

  const createdUser = await prisma.user.findUnique({
    where: { username: newUser.username },
    select: {
      id: true,
      email: true,
      username: true,
      verified: true,
    },
  });

  console.log(createdUser);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //apparently using a cron job is a better way to do this | and actually this
  //shi doesnt make much sense :tear

  // setTimeout(() => {
  //   try{
  //   if(!createdUser.verified){
  //     const deleteUser = await prisma.user.delete({
  //       where: {
  //         id : {createdUser.id}
  //       }
  //     })
  //   }
  //   } catch(err){
  //     console.error('Error while deleting the user: ', err.message)
  //   }
  // }, 310);

  await sendVerificationMail(createdUser.email, createdUser.id);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        `User registered successfully. A verification link has been sent to your registered email address`,
      ),
    );
});

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age },
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
