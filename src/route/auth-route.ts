import express from "express";
import { AuthController } from "../controller/auth-controller";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/refresh", AuthController.refreshToken);
router.get("/verify-email/:token", AuthController.verifyEmail);

export default router;
