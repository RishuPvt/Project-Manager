import ApiError from "../Utility/ApiError.js";
import ApiResponse from "../Utility/ApiResponse.js";
import prisma from "../DB/Database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  // take user name , email and password from body
  //check user already exist or not
  // hash password using bcrypt
  // create new user

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    throw new ApiError(404, "Email and Name field is req for Registration");
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existedUser) {
    throw new ApiError(409, "User with Email. already exists");
  }

  const hashedPassword = bcrypt.hash("password", 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Register Succesfully"));
};

const loginUser = async (req, res) => {
  //take user password and email
  //check user exist or not
  //match password from db
  //return res

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(404, "email & password is Required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user password");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged In Successfully", {
        id: user.id,
        name: user.name,
        email: user.email,
      })
    );
};

const logoutUser = async (req, res) => {
  const userId = req.user?.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404,"user not found");
    }
    const logout = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(200, "User logged out successfully", {
          id: user.id,
          email: user.email,
        })
      );
  } catch (error) {

    throw new ApiError(500, "Error while logging out user");
  }
};


export { registerUser , loginUser ,logoutUser };
