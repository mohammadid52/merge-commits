import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';

interface Notification {
  message: string;
  type: 'viewing' | 'breakdown';
  action?: null | any;
}

const NotificationBar: React.FC = () => {
  const { state, theme } = useContext(LessonContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    //  FOR VIEWING NOTIFICATION
    if (state.viewing) {
      setNotifications([...notifications, { message: 'You are being viewed!', type: 'viewing' }]);
    }
    if (!state.viewing) {
      setNotifications(notifications.filter((notification: Notification) => notification.type !== 'viewing'));
    }

    //  FOR BREAKDOWN SHARING NOTIFICATION
    // if (state.displayData.breakdownComponent !== null) {
    //   setNotifications([
    //     ...notifications,
    //     { message: 'The teacher is sharing on the breakdown, please save your work and go there!', type: 'breakdown' },
    //   ]);
    // }
    // if (state.displayData.breakdownComponent === null) {
    //   setNotifications(notifications.filter((notification: Notification) => notification.type !== 'breakdown'));
    // }
  }, [state.viewing, state.displayData.breakdownComponent]);

  return (
    <div className={`w-full h-6 mt-4`}>
      {notifications.length > 0
        ? notifications.map((notification: Notification, key: number) => (
            <div className={`${theme.section} rounded-lg bg-dark-red bg-opacity-20 text-sm text-white animate-fadeIn`}>
              {notification.message}
            </div>
          ))
        : null}
    </div>
  );
};

export default NotificationBar;
