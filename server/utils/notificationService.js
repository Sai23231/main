import Notification from "../models/notification.model.js";

export const createNotification = async ({
  recipient,
  recipientModel,
  type,
  title,
  message,
  data = {},
  priority = 'medium'
}) => {
  try {
    const notification = new Notification({
      recipient,
      recipientModel,
      type,
      title,
      message,
      data,
      priority
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const createBookingNotification = async (vendorId, bookingData) => {
  try {
    const notification = await createNotification({
      recipient: vendorId,
      recipientModel: 'VendorList',
      type: 'new_booking',
      title: 'New Booking Request',
      message: `You have received a new booking request from ${bookingData.customerName} for ${new Date(bookingData.eventDate).toLocaleDateString()}`,
      data: {
        bookingId: bookingData._id,
        customerName: bookingData.customerName,
        eventDate: bookingData.eventDate,
        phone: bookingData.phone
      },
      priority: 'high'
    });

    return notification;
  } catch (error) {
    console.error('Error creating booking notification:', error);
    throw error;
  }
};

export const createBookingStatusNotification = async (userId, bookingData, status) => {
  try {
    const statusMessages = {
      'confirmed': 'Your booking has been confirmed by the vendor',
      'rejected': 'Your booking request has been declined by the vendor',
      'completed': 'Your booking has been marked as completed'
    };

    const notification = await createNotification({
      recipient: userId,
      recipientModel: 'User',
      type: 'booking_status_update',
      title: 'Booking Status Update',
      message: statusMessages[status] || `Your booking status has been updated to ${status}`,
      data: {
        bookingId: bookingData._id,
        status: status,
        vendorName: bookingData.vendorDetails?.name || 'Vendor'
      },
      priority: 'medium'
    });

    return notification;
  } catch (error) {
    console.error('Error creating booking status notification:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (recipient, recipientModel) => {
  try {
    const count = await Notification.countDocuments({
      recipient,
      recipientModel,
      isRead: false
    });
    return count;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
}; 