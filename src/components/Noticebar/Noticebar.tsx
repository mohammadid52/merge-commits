import React, { useEffect } from 'react';
import { NotificationListItem } from '../../interfaces/GlobalInfoComponentsInterfaces';
import useNotifications from '../../customHooks/notifications';

const Noticebar = (props: { inputContext: 'lesson' | 'lessonControl' | 'global' }) => {
  const { inputContext } = props;
  const { notifications } = useNotifications(inputContext);

  const bgStyle = (notificationType: string) => {
    switch (notificationType) {
      case 'alert':
        return 'bg-mustard';
      case 'error':
        return 'bg-ketchup';
      default:
        return 'bg-dark-gray';
    }
  };

  const basicStyle = `font-semibold text-xs text-white`;
  const linkColor = `font-bold cursor-pointer underline text-blue-600 hover:text-blue-800 visited:text-purple-600`;

  return (
    <>
      {notifications
        ? notifications.map((notificationItem: NotificationListItem, idx: number) => {
            return (
              <div className={`w-full h-8 ${bgStyle(notificationItem?.notification.type)}`}>
                <div className={`h-full flex flex-row items-center content-center`}>
                  <div key={`notification_${idx}`} className={`px-2 flex flex-row ${basicStyle}`}>
                    <span className={`w-auto`}>
                      {notificationItem?.notification.label} - {notificationItem?.notification.message}
                    </span>
                    <span className={`w-auto mx-2 ${linkColor}`} onClick={notificationItem?.action}>
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

export default Noticebar;
