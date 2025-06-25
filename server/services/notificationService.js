import Notification from '../models/Notification.js';
import User from '../models/user.js'; // Assuming User model is needed for sender/receiver info

class NotificationService {
  /**
   * Creates a new notification.
   * @param {string} userId - The ID of the user who should receive the notification.
   * @param {string} type - The type of notification (e.g., 'message', 'mentorship_request').
   * @param {mongoose.Types.ObjectId} relatedEntityId - The ID of the related document (e.g., Message, MentorRequest).
   * @param {string} relatedEntityType - The type of the related document (e.g., 'Message', 'MentorRequest').
   */
  static async createNotification(userId, type, relatedEntityId, relatedEntityType) {
    try {
      const newNotification = new Notification({
        user: userId,
        type: type,
        relatedEntity: relatedEntityId,
        relatedEntityType: relatedEntityType,
      });
      await newNotification.save();
      console.log(`Notification created for user ${userId}, type: ${type}`);
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Marks a notification as read.
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @param {string} userId - The ID of the user attempting to mark the notification as read (for authorization).
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.user.toString() !== userId) {
        throw new Error('Not authorized to mark this notification as read');
      }

      notification.read = true;
      await notification.save();
      console.log(`Notification ${notificationId} marked as read.`);
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error; // Re-throw to be handled by the controller
    }
  }

  /**
   * Marks multiple notifications as read.
   * @param {string[]} notificationIds - An array of notification IDs to mark as read.
   * @param {string} userId - The ID of the user attempting to mark the notifications as read (for authorization).
   */
  static async markManyAsRead(notificationIds, userId) {
    try {
      const result = await Notification.updateMany(
        { _id: { $in: notificationIds }, user: userId, read: false },
        { $set: { read: true } }
      );
      console.log(`${result.modifiedCount} notifications marked as read for user ${userId}.`);
      return result;
    } catch (error) {
      console.error('Error marking many notifications as read:', error);
      throw error;
    }
  }

  /**
   * Fetches notifications for a specific user.
   * @param {string} userId - The ID of the user whose notifications to fetch.
   */
  static async getNotifications(userId) {
    try {
      const notifications = await Notification.find({ user: userId })
        .populate('user', 'name') // Populates the recipient user (the logged-in user)
        .populate({
          path: 'relatedEntity',
          populate: [
            { path: 'sender', select: 'name', strictPopulate: false }, // For Message type
            { path: 'requester', select: 'name', strictPopulate: false }, // For MentorRequest type
            { path: 'project', select: 'name', strictPopulate: false }, // For ProjectFeedback type
            { path: 'creator', select: 'name', strictPopulate: false }, // For Project type (if feedback is on a project by a creator)
            { path: 'collaborator', select: 'name', strictPopulate: false }, // For Project type (if feedback is on a project by a collaborator)
            { path: 'updater', select: 'name', strictPopulate: false }, // For mentorship_status_update if an 'updater' field exists
          ]
        })
        .sort({ date: -1 });
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }
}

export default NotificationService;
