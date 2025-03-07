import { Notification } from '../types/notifications';

// ตัวอย่างเฉยๆลบได้
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    court: 'Court A1',
    date: '2024-01-20',
    time: '14:00-15:00',
    message: 'New booking request received',
    timeAgo: '2min ago',
    isRead: false
  }
];

export const notificationService = {

   //ใช้เรียกงานตอนมึงเชื่อมละ
  // Fetch all notifications
  async getNotifications(): Promise<Notification[]> {
    // TODO: Replace with actual API call
    //แก้parameterด้วยถ้ามึงเชื่อม api แล้ว
    return Promise.resolve(MOCK_NOTIFICATIONS);
  },

  // Mark single notification as read
  async markAsRead(id: string): Promise<void> {
    // TODO: Replace with actual API call
    console.log('Marking as read:', id);
    return Promise.resolve();
  },

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    // TODO: Replace with actual API call
    console.log('Marking all as read');
    return Promise.resolve();
  }
};
