import {
  Inventory,
} from "../models/inventorySchema.js";

// ================= GET ALL =================

export const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find();

    const updatedItems = items.map((item) => {
      let status = "In Stock";

      if (item.quantity <= 0) {
        status = "Out of Stock";
      } else if (item.quantity < 10) {
        status = "Low Stock";
      }

      return {
        ...item._doc,
        status,
      };
    });

    res.status(200).json({
      success: true,
      items: updatedItems,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADD =================

export const addInventoryItem = async (req, res) => {
  try {

    const data = req.body;

    let status = "In Stock";

    if (data.quantity <= 0) {
      status = "Out of Stock";
    } else if (data.quantity < 10) {
      status = "Low Stock";
    }

    const item = await Inventory.create({
      ...data,
      status
    });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      item,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================

export const deleteInventoryItem =
  async (req, res) => {
    try {
      const item =
        await Inventory.findById(
          req.params.id
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Medicine not found",
        });
      }

      await item.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Medicine deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= UPDATE =================

export const updateInventoryItem =
  async (req, res) => {
    try {
      const item =
        await Inventory.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Medicine updated successfully",
        item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  