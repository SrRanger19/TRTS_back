import express from "express";
import { methods as ContainerController } from "../controllers/ContainerController.js";

const router = express.Router();

router.get("/", ContainerController.getContainers);
router.get("/:id", ContainerController.getContainer);
router.post("/", ContainerController.addContainer);
router.put("/:id", ContainerController.updateContainer);
router.delete("/:id", ContainerController.deleteContainer);

export { router as ContainerRouter };