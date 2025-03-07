
import { useNotifications } from '@/features/notifications/hooks/ีuseNotifications';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { SidebarNav } from '../dashboard/components/sidebar/SidebarNav';
import styles from './styles/notifications.module.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function NotificationPage() {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {
    activeTab,
    isLoading,
    error,
    setActiveTab,
    markAsRead,
    markAllAsRead,
    filteredNotifications
  } = useNotifications();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) return <div className={styles.loading}>{t('common.loading')}</div>;
  if (error) return <div className={styles.error}>{t('common.error')}</div>;

  return (
    <div className={styles.container}>
       <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />
       <main className={`${styles.main} ${!isSidebarCollapsed ? styles.mainContentCollapsed : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('notifications.title')}</h1>
          {activeTab === 'unread' && filteredNotifications.length > 0 && (
            <button
              className={styles.markAllButton}
              onClick={markAllAsRead}
            >
              {t('notifications.markAllRead')}
            </button>
          )}
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'unread' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            {t('notifications.tabs.unread')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'read' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('read')}
          >
            {t('notifications.tabs.read')}
          </button>
        </div>

        <div className={styles.notificationList}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={styles.notificationItem}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className={styles.notificationIcon}>
                <ClipboardIcon className={styles.icon} />
              </div>
              <div className={styles.notificationContent}>
                <h3 className={styles.notificationTitle}>
                  {t('notifications.item.details', {
                    court: notification.court,
                    date: notification.date,
                    time: notification.time
                  })}
                </h3>
                <p className={styles.notificationMessage}>
                  {t(`notifications.messages.${notification.message}`)}
                </p>
              </div>
              <span className={styles.timeAgo}>
                {t('notifications.timeAgo', { time: notification.timeAgo })}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}