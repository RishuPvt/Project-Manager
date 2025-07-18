import prisma from "../DB/DataBase.js";
import ApiError from "../Utility/ApiError.js";
import ApiResponse from "../Utility/ApiResponse.js";
import bcrypt from "bcrypt";
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user?.id;

    if (!name && !email) {
      throw new ApiError(400, "At least one field (name or email) is required");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully"));
  } catch (error) {
    if (error) {
      return res.status(400).json(new ApiError(400, "Email already exists"));
    }
  }
};

const CurrentUser = async (req, res) => {
  const userId = req.user?.id;

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existingUser, "current user"));
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Optional cleanup: remove tasks assigned to user (or set to null)
    await prisma.task.updateMany({
      where: { assignedTo: userId },
      data: { assignedTo: null }, // or use deleteMany if you want to delete the tasks
    });

    // Optional cleanup: delete user's join requests
    await prisma.joinRequest.deleteMany({
      where: { userId },
    });

    // Now delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    // Clear cookies or token if needed
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User account permanently deleted"));
  } catch (error) {
    console.error("Account deletion error:", error);
    return res.status(500).json(new ApiError(500, "Failed to delete account"));
  }
};

const updatePassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const userId = req.user?.id;

  if (!newPassword || !oldPassword) {
    throw new ApiError(401, "enter new password");
  }

  if (!userId) {
    throw new ApiError(404, "userid not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }

  const validatePassword = await bcrypt.compare(
    oldPassword,
    existingUser.password
  );

  if (!validatePassword) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "oldPassword is wrong"));
  }

  const hashnewpassword = await bcrypt.hash(newPassword, 10);
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashnewpassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "password update successfully"));
};

const updateOrg = async (req, res) => {
  try {
    const { name, email } = req.body;
    const orgId = req.organization?.id;

    if (!name && !email) {
      throw new ApiError(400, "At least one field (name or email) is required");
    }

    const existingUser = await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "organization not found");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.organization.update({
      where: {
        id: orgId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "organization updated successfully")
      );
  } catch (error) {
    if (error) {
      return res.status(400).json(new ApiError(400, "Email already exists"));
    }
  }
};

const CurrentOrg = async (req, res) => {
  const orgId = req.organization?.id;

  const existingUser = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      users: true,
      projects: true,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, "organization not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existingUser, "current organization"));
};

const updateOrgPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const userId = req.organization?.id;

  if (!newPassword || !oldPassword) {
    throw new ApiError(401, "enter new password");
  }

  if (!userId) {
    throw new ApiError(404, "userid not found");
  }

  const existingUser = await prisma.organization.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existingUser) {
    throw new ApiError(404, "organization not found");
  }

  const validatePassword = await bcrypt.compare(
    oldPassword,
    existingUser.password
  );

  if (!validatePassword) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "oldPassword is wrong"));
  }

  const hashnewpassword = await bcrypt.hash(newPassword, 10);
  const organization = await prisma.organization.update({
    where: {
      id: userId,
    },
    data: {
      password: hashnewpassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, organization, "password update successfully"));
};
const totalMemberInOrg = async (req, res) => {
  const orgId = req.organization?.id;

  const userCount = await prisma.user.count({
    where: {
      organizationId: orgId,
      status: "APPROVED",
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalMembers: userCount },
        "Total approved members in organization"
      )
    );
};

export {
  updateUser,
  CurrentUser,
  CurrentOrg,
  updateOrg,
  deleteAccount,
  updatePassword,
  updateOrgPassword,
  totalMemberInOrg
};
