import express from "express";

import {
  getAllInventory,
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "../controller/inventoryController.js";

import {
  isAdminAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// GET ALL

router.get(
  "/all",
  getAllInventory
);

// ADD

router.post(
  "/add",
  isAdminAuthenticated,
  addInventoryItem
);

// DELETE

router.delete(
  "/delete/:id",
  isAdminAuthenticated,
  deleteInventoryItem
);

// UPDATE

router.put(
  "/update/:id",
  isAdminAuthenticated,
  updateInventoryItem
);

export default router;