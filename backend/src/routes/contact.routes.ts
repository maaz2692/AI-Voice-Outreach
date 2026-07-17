import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";

const router = Router();

router.get("/", contactController.getContacts);
router.post("/", contactController.createContact);

export default router;