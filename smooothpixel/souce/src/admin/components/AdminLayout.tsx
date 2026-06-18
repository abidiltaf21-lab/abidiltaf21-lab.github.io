import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { InboxNotificationProvider } from '../../context/InboxNotificationContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <InboxNotificationProvider>
        {/* Always force LTR for admin — language RTL only applies to the public site */}
        <div className="admin-body d-flex" dir="ltr">
            <AdminSidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '260px' }}>
                <AdminHeader />
                <main className="p-4" style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
            
            <style>{`
                .admin-sidebar {
                    width: 260px;
                    height: 100vh;
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                }
            `}</style>
        </div>
        </InboxNotificationProvider>
    );
};
