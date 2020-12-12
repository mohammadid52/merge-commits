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
  }, [state.viewing]);

  useEffect(() => {
    //  FOR BREAKDOWN SHARING NOTIFICATION
    if (state.displayData.breakdownComponent !== null && state.displayData.breakdownComponent !== '') {
      setNotifications([
        ...notifications,
        { message: 'The teacher is sharing on the breakdown, please save your work and go there!', type: 'breakdown' },
      ]);
    } else if (state.displayData.breakdownComponent === null || state.displayData.breakdownComponent === '') {
      setNotifications(notifications.filter((notification: Notification) => notification.type !== 'breakdown'));
    }
  }, [state.displayData.breakdownComponent]);

  return (
    <div className={`w-full mt-8`}>
      {notifications.length > 0
        ? notifications.map((notification: Notification, key: number) => (
            <div
              key={key}
              className={`${theme.section} ${
                key > 0 ? 'mt-2' : ''
              } rounded-lg bg-dark-red bg-opacity-40 border border-white border-opacity-40 text-sm text-white animate-fadeIn`}>
              {notification.message}
            </div>
          ))
        : null}
    </div>
  );
};

export default NotificationBar;
