import ApiError from "../Utility/ApiError.js";
import jwt from "jsonwebtoken";
import prisma from "../DB/DataBase.js";

export const orgverifyJWT = async (req, res, next) => {
  try {
    // 1. Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find user from token
    const organization = await prisma.organization.findUnique({
      where: { id: decodedToken?.id },
    });

    if (!organization) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // 4. Attach user to request
    req.organization = organization;

    next();
  } catch (error) {
    return res.status(401).json(
      new ApiError(401, error?.message || "Invalid access token")
    );
  }
};
