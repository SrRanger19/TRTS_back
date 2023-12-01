import express from 'express';
import { methods as UserController } from "../controllers/UserController.js";

const router = express.Router();


router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);
router.post("/", UserController.addUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post("/login", UserController.loginUser)

export { router as UserRouter };