import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller"
const router = Router()

router.get("/one",dashboardController.Statistics1)
router.get("/two",dashboardController.Statistics2)
router.get("/three",dashboardController.Statistics3)
export default router;