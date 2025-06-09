import {logoutUser, registerUser , loginUser} from "../controller/AuthController.js"
import { Router } from "express";
import { verifyJWT } from "../Middleware/Auth.middleware.js";
const router =  Router();


router.route("/registerUser").post(registerUser)
router.route("/loginUser").post( loginUser);
router.route("/logoutUser").post( verifyJWT , logoutUser);
