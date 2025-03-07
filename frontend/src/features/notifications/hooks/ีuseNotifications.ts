// hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { Notification, NotificationsState } from '../types/notifications';
import { notificationService } from '../services/notificationsService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationsState>('unread');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification =>
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    activeTab,
    isLoading,
    error,
    setActiveTab,
    markAsRead,
    markAllAsRead,
    filteredNotifications: notifications.filter(
      n => n.isRead === (activeTab === 'read')
    )
  };
}
