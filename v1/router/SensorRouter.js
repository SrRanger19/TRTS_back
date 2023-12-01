import express from "express";
import { methods as SensorController } from "../controllers/SensorController.js";

const router = express.Router();

router.get("/", SensorController.getSensors);
router.get("/:id", SensorController.getSensor);
router.post("/", SensorController.addSensor);
router.put("/:id", SensorController.updateSensor);
router.delete("/:id", SensorController.deleteSensor);

export { router as SensorRouter };