import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { markNotificationAsRead, getUnreadNotificationCount } from "../utils/notificationService.js";
import Notification from "../models/notification.model.js";

const router = express.Router();

// Get notifications for the authenticated user/vendor
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.id;
    const userRole = req.role; // 'user', 'vendor', or 'admin'

    let recipientModel;
    switch (userRole) {
      case 'vendor':
        recipientModel = 'VendorList';
        break;
      case 'admin':
        recipientModel = 'Admin';
        break;
      default:
        recipientModel = 'User';
    }

    const notifications = await Notification.find({
      recipient: userId,
      recipientModel: recipientModel
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
});

// Get unread notification count
router.get("/unread-count", verifyToken, async (req, res) => {
  try {
    const userId = req.id;
    const userRole = req.role;

    let recipientModel;
    switch (userRole) {
      case 'vendor':
        recipientModel = 'VendorList';
        break;
      case 'admin':
        recipientModel = 'Admin';
        break;
      default:
        recipientModel = 'User';
    }

    const count = await getUnreadNotificationCount(userId, recipientModel);

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching unread count"
    });
  }
});

// Mark notification as read
router.put("/:notificationId/read", verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.id;

    const notification = await markNotificationAsRead(notificationId, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking notification as read"
    });
  }
});

// Mark all notifications as read
router.put("/mark-all-read", verifyToken, async (req, res) => {
  try {
    const userId = req.id;
    const userRole = req.role;

    let recipientModel;
    switch (userRole) {
      case 'vendor':
        recipientModel = 'VendorList';
        break;
      case 'admin':
        recipientModel = 'Admin';
        break;
      default:
        recipientModel = 'User';
    }

    await Notification.updateMany(
      {
        recipient: userId,
        recipientModel: recipientModel,
        isRead: false
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking all notifications as read"
    });
  }
});

// Delete notification
router.delete("/:notificationId", verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification"
    });
  }
});

export default router; 