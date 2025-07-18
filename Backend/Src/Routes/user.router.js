import {updateUser , CurrentUser , CurrentOrg , updateOrg , deleteAccount ,updateOrgPassword, updatePassword , totalMemberInOrg} from "../Controller/User.controller.js";
import { Router } from "express";
import { verifyJWT } from "../Middleware/Auth.middleware.js";
import { orgverifyJWT } from "../Middleware/OrgAuth.middleware.js";

const router = Router()

router.route("/updateUser").patch( verifyJWT , updateUser);
router.route("/CurrentUser").get( verifyJWT , CurrentUser);
router.route("/deleteAccount").delete( verifyJWT , deleteAccount);
router.route("/updatePassword").patch(verifyJWT , updatePassword);



router.route("/CurrentOrg").get( orgverifyJWT , CurrentOrg);
router.route("/updateOrg").patch( orgverifyJWT , updateOrg);
router.route("/updateOrgPassword").patch(orgverifyJWT , updateOrgPassword);
router.route("/totalMemberInOrg").get( orgverifyJWT , totalMemberInOrg);








export default router;

