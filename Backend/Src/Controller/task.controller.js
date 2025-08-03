import prisma from "../DB/DataBase.js";
import ApiError from "../Utility/ApiError.js";
import ApiResponse from "../Utility/ApiResponse.js";
import { uploadOnCloudinary } from "../Utility/cloudinary.js";
const createTask = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { title, description, priority, deadline, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json(new ApiError(400, "Title is required"));
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    const FileLocalPath = req.file?.path;
    const file = await uploadOnCloudinary(FileLocalPath);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        deadline: deadline ? new Date(deadline) : null,
        project: { connect: { id: projectId } },
        assigned: assignedTo
          ? { connect: { id: parseInt(assignedTo, 10) } }
          : undefined,

        file: file?.url || null,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, task, "Task created successfully"));
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json(new ApiError(500, "Failed to create task"));
  }
};

const getmyTask = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(400, "unauthorized to get all task");
  }

  const task = await prisma.Task.findMany({
    where: {
      assignedTo: userId,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Currently no task assign to you"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task fetched succesfully"));
};

const updateTaskStatus = async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);

  const { status } = req.body;

  // Validate status
  const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json(new ApiError(400, "Invalid status value"));
  }

  try {
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json(new ApiError(404, "Task not found"));
    }

    // Update status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedTask, "Task status updated successfully")
      );
  } catch (error) {
    console.log("Error updating task status:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update task status"));
  }
};

const getTaskStatusCount = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);

    // Get task counts by status
    const [todo, inProgress, done] = await Promise.all([
      prisma.task.count({ where: { projectId: projectId, status: "TODO" } }),
      prisma.task.count({
        where: { projectId: projectId, status: "IN_PROGRESS" },
      }),
      prisma.task.count({ where: { projectId: projectId, status: "DONE" } }),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { todo, inProgress, done },
          "Task status counts fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching task counts:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to get task status counts"));
  }
};

const gettotalTaskStatusCount = async (req, res) => {
  try {
    const orgId = req.organization?.id;
    const [todo, inProgress, done] = await Promise.all([
      prisma.task.count({
        where: {
          project: {
            organizationId: orgId,
          },
          status: "TODO",
        },
      }),
      prisma.task.count({
        where: {
          project: {
            organizationId: orgId,
          },
          status: "IN_PROGRESS",
        },
      }),
      prisma.task.count({
        where: {
          project: {
            organizationId: orgId,
          },
          status: "DONE",
        },
      }),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { todo, inProgress, done },
          "Task status counts fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching task counts:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to get task status counts"));
  }
};

const userTaskstatusCount = async (req, res) => {
  const userId = req.user?.id;
  try {
    const [todo, inProgress, done] = await Promise.all([
      prisma.task.count({ where: { assignedTo: userId, status: "TODO" } }),
      prisma.task.count({
        where: { assignedTo: userId, status: "IN_PROGRESS" },
      }),
      prisma.task.count({ where: { assignedTo: userId, status: "DONE" } }),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { todo, inProgress, done },
          "Task status counts fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching task counts:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to get task status counts"));
  }
};

export {
  createTask,
  getmyTask,
  updateTaskStatus,
  getTaskStatusCount,
  gettotalTaskStatusCount,
  userTaskstatusCount,
};
