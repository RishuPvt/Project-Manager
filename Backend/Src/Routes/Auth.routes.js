import {
  registerOrg,
  logInOrg,
  registerUser,
  logInUser,
  approveJoinRequest,
  getPendingRequests,
  logoutUser,
  logoutOrg,
} from "../Controller/Auth.controller.js";
import { Router } from "express";
import { verifyJWT } from "../Middleware/Auth.middleware.js";
import {orgverifyJWT} from "../Middleware/OrgAuth.middleware.js";

const router = Router();

router.route("/registerOrg").post(registerOrg);
router.route("/logInOrg").post(logInOrg);
router.route("/registerUser").post(registerUser);
router.route("/logInUser").post(logInUser);
router
  .route("/approveJoinRequest/:requestId")
  .put(verifyJWT, approveJoinRequest);
router.route("/getPendingRequests").get(verifyJWT, getPendingRequests);
router.route("/logoutUser").post(verifyJWT, logoutUser);
router.route("/logoutOrg").post(orgverifyJWT, logoutOrg);


export default router;
