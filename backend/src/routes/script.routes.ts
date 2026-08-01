import { Router } from "express";
import { scriptController } from "../controllers/script.controller.js";

const router = Router();

router.get("/", scriptController.getScripts);
router.get("/:scriptId", scriptController.getScriptById);
router.post("/", scriptController.createScript);

export default router;