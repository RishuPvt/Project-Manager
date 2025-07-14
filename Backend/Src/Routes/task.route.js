import {createTask , getmyTask , updateTaskStatus} from "../Controller/task.controller.js"
import { Router } from "express";
import { verifyJWT } from "../Middleware/Auth.middleware.js";
import {orgverifyJWT} from "../Middleware/OrgAuth.middleware.js";


const router = Router();


router.route("/createTask/:projectId").post(orgverifyJWT, createTask);
router.route("/getmyTask").get(verifyJWT, getmyTask);
router.route("/updateTaskStatus/:taskId").patch(verifyJWT, updateTaskStatus);






export default router;