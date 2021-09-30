import React from 'react';
import {NotificationListItem} from '../../interfaces/GlobalInfoComponentsInterfaces';

interface INoticebarProps {
  notifications: any[];
}

const Noticebar = ({notifications}: INoticebarProps) => {
  const bgStyle = (notificationType: string) => {
    switch (notificationType) {
      case 'info':
        return 'bg-indigo-500';
      case 'positive':
        return 'bg-green-500';
      case 'alert':
        return 'bg-mustard';
      case 'error':
        return 'bg-ketchup';
      default:
        return 'bg-dark-gray';
    }
  };

  const basicStyle = `font-semibold text-sm text-white justify-center`;
  const linkColor = `font-bold cursor-pointer underline text-blue-600 hover:text-blue-800 visited:text-purple-600`;

  return (
    <>
      {notifications
        ? notifications.map((notificationItem: NotificationListItem, idx: number) => {
            return (
              <div
                key={idx}
                className={`w-full h-8 p-2 ${bgStyle(
                  notificationItem?.notification.type
                )}`}>
                <div className={`h-full flex flex-row items-center content-center`}>
                  <div
                    key={`notification_${idx}`}
                    className={`px-2 flex flex-row ${basicStyle}`}>
                    <span className={`w-auto`}>
                      {notificationItem?.notification.label}
                      {notificationItem?.notification.message &&
                        ` - ${notificationItem?.notification.message}`}
                    </span>
                    <span
                      className={`w-auto mx-2 ${linkColor}`}
                      onClick={notificationItem?.action}>
                      {notificationItem?.notification.cta}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </>
  );
};

export default React.memo(Noticebar);
