import express from "express";
import {
  createContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/contacts", createContact);
router.get("/contacts", getContacts);
router.patch("/contacts/:id/status", updateContactStatus);

export default router;
