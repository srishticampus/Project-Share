import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useNavigate, useLocation } from 'react-router';


const POLLING_INTERVAL = 10000; // Poll every 10 seconds

function Notifications({ onNotificationClick, onUnreadCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentRole = location.pathname.split('/')[1] || localStorage.getItem('role');

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/messages/notifications');
      const fetchedNotifications = response.data;
      setNotifications(fetchedNotifications);
      setError(null); // Clear any previous errors

    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications. Please try again later.');
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.get('/messages/notifications/unread/count');
      const unreadCount = response.data.count;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread notification count:', err);
      // Handle error, but don't block main notification display
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch of all notifications for display
    fetchUnreadCount(); // Initial fetch of unread count for badge

    const intervalId = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // No longer need this useEffect as unread count is fetched directly
  // useEffect(() => {
  //   const unreadCount = notifications.filter(n => !n.read).length;
  //   if (onUnreadCountChange) {
  //     onUnreadCountChange(unreadCount);
  //   }
  // }, [notifications, onUnreadCountChange]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/messages/notifications/${notificationId}/read`);
      // Optimistically update UI or refetch
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Handle error, maybe show a toast notification
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'message':
        const messageSenderName = notification.relatedEntity?.sender?.name || 'Unknown User';
        return `New message from ${messageSenderName}`;
      case 'mentorship_request':
        const requesterName = notification.relatedEntity?.requester?.name || 'Someone';
        return `New mentorship request from ${requesterName}`;
      case 'mentorship_status_update':
        // Assuming relatedEntity for status update has a 'mentor' or 'mentee' field
        const updaterName = notification.relatedEntity?.updater?.name || 'A user';
        return `Mentorship status updated by ${updaterName}`;
      case 'project_feedback':
        const projectName = notification.relatedEntity?.project?.name || 'a project';
        const feedbackSender = notification.relatedEntity?.sender?.name || 'Someone';
        return `New feedback from ${feedbackSender} on ${projectName}`;
      default:
        return `New notification (${notification.type})`;
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification._id);
    if (onNotificationClick) {
      onNotificationClick();
    }

    // Navigate based on notification type or related entity
    if (notification.type === 'message' && notification.relatedEntity?.sender?._id) {
      navigate(`/${currentRole}/chat/${notification.relatedEntity.sender._id}`);
    } else if (notification.type === 'mentorship_request' && notification.relatedEntity?._id) {
      // Assuming mentorship requests might link to a specific request page or dashboard
      navigate(`/${currentRole}/mentorship-requests`); // Adjust path as needed
    } else if (notification.type === 'project_feedback' && notification.relatedEntity?._id) {
      // Assuming project feedback links to project details
      navigate(`/${currentRole}/projects/${notification.relatedEntity._id}`); // Adjust path as needed
    } else {
      // Fallback navigation or just close notification panel
      console.log('Unhandled notification click:', notification);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-gray-500">No new notifications.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification._id}
          onClick={() => handleNotificationClick(notification)}
          className={`p-3 mb-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 ${
            notification.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-800 font-medium'
          }`}
          style={{ cursor: 'pointer' }}
        >
          {getNotificationMessage(notification)}
          <div className="text-xs text-gray-500 mt-1">
            {new Date(notification.date).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
