import {app} from "./App.js";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import {createServer} from "http";

configDotenv({ path: "./.env" });


const server = createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

export { io };

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join room
  socket.on("join_project", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined project_${projectId}`);
  });
});


server.listen(process.env.PORT || 8000,()=>{
 console.log(`Server is running at port :${process.env.PORT}`);
})

