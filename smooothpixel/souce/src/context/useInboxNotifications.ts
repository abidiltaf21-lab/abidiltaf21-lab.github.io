import { useContext } from 'react';
import { InboxNotificationContext } from './InboxNotificationContext';

export const useInboxNotifications = () => {
    const ctx = useContext(InboxNotificationContext);
    if (!ctx) {
        throw new Error('useInboxNotifications must be used within InboxNotificationProvider');
    }
    return ctx;
};

export const useInboxNotificationsOptional = () => useContext(InboxNotificationContext);
