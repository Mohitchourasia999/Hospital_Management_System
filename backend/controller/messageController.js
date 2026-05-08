import {
  Message,
} from "../models/messageSchema.js";

// ================= SEND =================

export const sendMessage =
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        message,
      } = req.body;

      const newMessage =
        await Message.create({
          firstName,
          lastName,
          email,
          phone,
          message,
        });

      res.status(201).json({
        success: true,
        message:
          "Message sent successfully",
        newMessage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= GET ALL =================

export const getAllMessages =
  async (req, res) => {
    try {
      const messages =
        await Message.find();

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= DELETE =================

export const deleteMessage =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message not found",
        });
      }

      await message.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Message deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };