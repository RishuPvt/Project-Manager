import prisma from "../DB/DataBase.js";
import ApiError from "../Utility/ApiError.js";
import ApiResponse from "../Utility/ApiResponse.js";

const createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "title field is required");
  }
  const orgId = req.organization.id;
  const project = await prisma.project.create({
    data: {
      title,
      description,
      organization: {
        connect: { id: orgId },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "project created sucessfully"));
};

const getAllProjects = async (req, res) => {
  try {
    const orgId = req.organization.id;

    // Fetch all projects for the org
    const projects = await prisma.project.findMany({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count total number of projects
    const projectCount = await prisma.project.count({
      where: {
        organizationId: orgId,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { count: projectCount, projects },
          "Projects fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch projects"));
  }
};

export { createProject, getAllProjects };
