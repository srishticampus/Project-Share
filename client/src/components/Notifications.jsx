import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

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
        <div key={notification._id}>
          {notification.message.content}
        </div>
      ))}
    </div>
  );
}

export default Notifications;