import prisma from "../DB/DataBase.js";


io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join_project", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined room project_${projectId}`);
  });

  socket.on("send_message", async ({ message, projectId, senderId }) => {
    try {
      if (!message || !projectId || !senderId) {
        return socket.emit("error_message", "Message, senderId, and projectId are required");
      }

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        return socket.emit("error_message", "Project not found");
      }

      const newMessage = await prisma.message.create({
        data: {
          message,
          sender: { connect: { id: senderId } },
          project: { connect: { id: projectId } },
          type: "CHAT",
        },
        include: { sender: true },
      });

      socket.to(`project_${projectId}`).emit("receive_message", newMessage);
      socket.emit("message_sent", newMessage);

    } catch (error) {
      console.error("❌ Error sending message:", error.message);
      socket.emit("error_message", "Internal server error");
    }
  });

  // 🔥 Add get_messages handler here:
  socket.on("get_messages", async (projectId) => {
    try {
      if (!projectId) {
        return socket.emit("error_message", "Project ID is required");
      }

      const messages = await prisma.message.findMany({
        where: { projectId },
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      });

      socket.emit("project_messages", messages);
    } catch (error) {
      console.error("❌ Error fetching messages:", error.message);
      socket.emit("error_message", "Failed to fetch messages");
    }
  });
});

