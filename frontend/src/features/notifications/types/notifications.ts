export interface Notification {
    id: string;
    court: string;
    date: string;
    time: string;
    message: string;
    timeAgo: string;
    isRead: boolean;
  }

  export type NotificationsState = 'unread' | 'read';