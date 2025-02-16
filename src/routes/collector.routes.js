import express from "express";
import { getAvailableCollectors, assignCollector, updateCollectorStatus } from "../controllers/collector.controller.js";

const router = express.Router();

router.get("/available", getAvailableCollectors);
router.post("/assign", assignCollector);
router.patch("/update-status", updateCollectorStatus);

export default router;
