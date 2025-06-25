import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js'; //  auth middleware
import User from '../models/user.js';
import NotificationService from '../services/notificationService.js'; // Import the new service

const router = express.Router();

// @route   GET api/messages/:senderId/:receiverId
// @desc    Get messages between two users
// @access  Private
router.get('/:senderId/:receiverId', protect, async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Find messages where sender is senderId and receiver is receiverId OR sender is receiverId and receiver is senderId
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })
    .populate('sender', 'role') // Populate sender with role
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/users
// @desc    Get users that the current user can chat with
// @access  Private
router.get('/users', protect, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the auth middleware

    // Find all users except the current user
    const users = await User.find({ _id: { $ne: userId } });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/messages
// @desc    Send a new message
// @access  Private
router.post(
  '/',
  [
    protect,
  [
    body('sender', 'Sender is required').not().isEmpty(),
      body('receiver', 'Receiver is required').not().isEmpty(),
      body('content', 'Content is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { sender, receiver, content } = req.body;

      const newMessage = new Message({
        sender,
        receiver,
        content
      });

      const message = await newMessage.save();

      // Increment chatActivityCount for sender and receiver
      await User.findByIdAndUpdate(sender, { $inc: { chatActivityCount: 1 } });
      await User.findByIdAndUpdate(receiver, { $inc: { chatActivityCount: 1 } });

      // Create a new notification for the receiver using the service
      await NotificationService.createNotification(
        receiver,
        'message',
        message._id,
        'Message'
      );

      res.json(message);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/messages/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await NotificationService.getNotifications(userId);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send(err.message);
  }
});

// @route   PUT api/messages/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    await NotificationService.markAsRead(notificationId, userId);
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err.message);
    if (err.message === 'Notification not found') {
      return res.status(404).json({ msg: err.message });
    }
    if (err.message === 'Not authorized to mark this notification as read') {
      return res.status(401).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/messages/notifications/mark-many-read
// @desc    Mark multiple notifications as read
// @access  Private
router.put('/notifications/mark-many-read', protect, async (req, res) => {
  try {
    const { notificationIds } = req.body; // Expect an array of IDs
    const userId = req.user.id;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ msg: 'An array of notification IDs is required' });
    }

    await NotificationService.markManyAsRead(notificationIds, userId);
    res.json({ msg: 'Notifications marked as read' });
  } catch (err) {
    console.error('Error marking many notifications as read:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
