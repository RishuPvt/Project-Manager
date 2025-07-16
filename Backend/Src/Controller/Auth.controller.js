import prisma from "../DB/DataBase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../Utility/ApiError.js";
import ApiResponse from "../Utility/ApiResponse.js";

const registerOrg = async (req, res) => {
  const { name, email, password, description } = req.body;

  if (!email || !name || !password || !description) {
    throw new ApiError(404, "All field is req for Registration");
  }

  const existedOrg = await prisma.Organization.findUnique({
    where: {
      email,
    },
  });

  if (existedOrg) {
    return res
      .status(409)
      .json(new ApiError(409, "Organization with Email. already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const Organization = await prisma.organization.create({
    data: {
      name,
      email,
      description,
      password: hashedPassword,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, Organization, "Organization Register Succesfully")
    );
};

const logInOrg = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    throw new ApiError(404, "email & password is Required");
  }
  const organization = await prisma.organization.findUnique({
    where: {
      email,
    },
  });
  if (!organization) {
    throw new ApiError(404, "organization not found");
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    organization.password
  );
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new ApiError(401, "Invalid organization password"));
  }
  const accessToken = jwt.sign(
    {
      id: organization.id,
      email: organization.email,
      name: organization.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: organization.id },
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
      new ApiResponse(200, "organization logged In Successfully", {
        id: organization.id,
        name: organization.name,
        email: organization.email,
      })
    );
};

const registerUser = async (req, res) => {
  const { email, password, name, organizationName } = req.body;

  if (!email || !name || !password || !organizationName) {
    throw new ApiError(404, "All field is req for Registration");
  }
  const existedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existedUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User with Email. already exists"));
  }

  const existedOrg = await prisma.organization.findUnique({
    where: { name: organizationName },
  });

  if (!existedOrg) {
    return res
      .status(409)
      .json(new ApiError(409, "organization with Name. Not exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      status: "PENDING",
      password: hashedPassword,
      organization: { connect: { id: existedOrg.id } },
    },
  });

  const joinReq = await prisma.joinRequest.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      organization: {
        connect: { id: existedOrg.id },
      },
      status: "PENDING",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Register Succesfully"));
};

const approveJoinRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // 1. Fetch the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: Number(requestId) },
      include: { user: true, organization: true },
    });

    if (!joinRequest) {
      return res.status(404).json(new ApiError(404, "Join request not found"));
    }

    await prisma.$transaction([
      prisma.joinRequest.update({
        where: { id: joinRequest.id },
        data: { status: "APPROVED" },
      }),
      prisma.user.update({
        where: { id: joinRequest.userId },
        data: { status: "APPROVED" },
      }),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          `User ${joinRequest.user.name} has been approved successfully`
        )
      );
  } catch (error) {
    console.error("Error approving join request:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const logInUser = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    throw new ApiError(404, "email & password is Required");
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json(new ApiError(401, "Invalid user password"));
  }

  if (user.status !== "APPROVED") {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          {},
          "Your account is not approved by the organization yet"
        )
      );
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
      new ApiResponse(200, "user logged In Successfully", {
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
      throw new ApiError(404, "user not found");
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
    console.log(error);

    throw new ApiError(500, "Error while logging out user");
  }
};

const logoutOrg = async (req, res) => {
  const orgId = req.organization?.id;

  console.log("this is id", orgId);

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!organization) {
      throw new ApiError(404, "organization not found");
    }
    const logout = await prisma.organization.findUnique({
      where: {
        id: orgId,
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
        new ApiResponse(200, "organization logged out successfully", {
          id: organization.id,
          email: organization.email,
        })
      );
  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Error while logging out organization");
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const orgId = req.user.id;

    const requests = await prisma.joinRequest.findMany({
      where: {
        organizationId: orgId,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          requests,
          "Pending join requests fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching pending join requests:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch pending join requests"));
  }
};

export {
  registerOrg,
  logInOrg,
  registerUser,
  logInUser,
  approveJoinRequest,
  getPendingRequests,
  logoutUser,
  logoutOrg,
};
