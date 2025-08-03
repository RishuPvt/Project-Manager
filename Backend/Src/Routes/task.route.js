import {createTask , getmyTask , updateTaskStatus , getTaskStatusCount , gettotalTaskStatusCount ,userTaskstatusCount} from "../Controller/task.controller.js"
import { Router } from "express";
import { verifyJWT } from "../Middleware/Auth.middleware.js";
import {orgverifyJWT} from "../Middleware/OrgAuth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";


const router = Router();


router.route("/createTask/:projectId").post(orgverifyJWT,upload.single("file") ,createTask);
router.route("/getmyTask").get(verifyJWT, getmyTask);
router.route("/updateTaskStatus/:taskId").patch(verifyJWT, updateTaskStatus);
router.route("/getTaskStatusCount/:projectId").get( getTaskStatusCount);
router.route("/gettotalTaskStatusCount").get( orgverifyJWT , gettotalTaskStatusCount);
router.route("/userTaskstatusCount").get( verifyJWT , userTaskstatusCount);









export default router;