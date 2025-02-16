import { Router } from "express";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../controllers/user.controller.js"; 
import { verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyJWT, getCurrentUser); 
router.post("/logout", logoutUser);

export default router;
