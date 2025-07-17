import {getAllProjects , createProject , getTaskOfProject} from "../Controller/Project.controller.js"
import { Router } from "express";
import { verifyJWT } from "../Middleware/Auth.middleware.js";
import {orgverifyJWT} from "../Middleware/OrgAuth.middleware.js";


const router = Router();


router.route("/createProject").post(orgverifyJWT, createProject);
router.route("/getAllProjects").get(orgverifyJWT, getAllProjects);
router.route("/getTaskOfProject/:projectId").get( getTaskOfProject);




export default router;
