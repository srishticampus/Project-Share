import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js'; //  auth middleware

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
    }).sort({ timestamp: 1 });

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
    const users = await mongoose.model('User').find({ _id: { $ne: userId } });

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

      // Create a new notification for the receiver
      const newNotification = new Notification({
        user: receiver,
        message: `New message from ${req.user.name}: "${content.substring(0, 50)}..."`, // Use content string
        type: 'message',
        relatedEntity: message._id, // Link to the actual message document
        relatedEntityType: 'Message',
      });

      await newNotification.save();

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
    console.log(`Fetching notifications for user ID: ${userId}`);

    console.log('Executing Notification.find() query...');
    const notifications = await Notification.find({ user: userId })
      .populate('relatedEntity') // Populate the related entity based on its type
      .sort({ date: -1 }); // Sort by date, not timestamp

    // Manually populate sender for message notifications if needed, or adjust client to handle relatedEntity
    const populatedNotifications = await Promise.all(notifications.map(async (notif) => {
      if (notif.type === 'message' && notif.relatedEntity && notif.relatedEntityType === 'Message') {
        const messageDoc = await mongoose.model('Message').findById(notif.relatedEntity).populate('sender', 'name');
        if (messageDoc) {
          return {
            ...notif.toObject(),
            message: `New message from ${messageDoc.sender.name}: "${messageDoc.content.substring(0, 50)}..."`,
            senderName: messageDoc.sender.name, // Add sender name for display
          };
        }
      }
      return notif.toObject();
    }));

    console.log(`Found ${populatedNotifications.length} notifications.`);

    res.json(populatedNotifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send(err.message);
  }
});

export default router;
