import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useNavigate } from 'react-router';

function Notifications({ onNotificationClick }) {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentRole = window.location.pathname.split('/')[1];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get('/messages/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to fetch notifications.');
      }
    };

    fetchNotifications();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification._id}
          onClick={() => {
            navigate(`${currentRole}/chat/${notification.message.sender._id}`);
            if (onNotificationClick) {
              onNotificationClick();
            }
          }}
          style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate it's clickable
        >
          New message from {notification.message.sender.name}
        </div>
      ))}
    </div>
  );
}

export default Notifications;