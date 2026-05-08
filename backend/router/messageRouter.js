import express from "express";

import {
  sendMessage,
  getAllMessages,
  deleteMessage,
} from "../controller/messageController.js";

import {
  isAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// SEND MESSAGE

router.post(
  "/send",
  sendMessage
);

// GET ALL

router.get(
  "/all",
  isAdminAuthenticated,
  getAllMessages
);

// DELETE

router.delete(
  "/delete/:id",
  isAdminAuthenticated,
  deleteMessage
);

export default router;