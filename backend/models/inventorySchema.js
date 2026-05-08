import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    expiryDate: {
      type: Date,
    },

    batchNumber: {
      type: String,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model(
  "Inventory",
  inventorySchema
);