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

  /*
   *
   * useEffect FOR SETTING NOTIFICATIONS
   *
   * */

  //TODO: fix the viewing message...
  // useEffect(() => {
  //   const containsViewingMessage =
  //     notifications.filter((notification: Notification) => notification.type.includes('viewing')).length > 0;
  //   //  FOR VIEWING NOTIFICATION
  //   if (state.viewing && !containsViewingMessage) {
  //     setNotifications([...notifications, { message: 'You are being viewed!', type: 'viewing' }]);
  //   } else if (!state.viewing) {
  //     setNotifications(notifications.filter((notification: Notification) => notification.type !== 'viewing'));
  //   }
  // }, [state.viewing]);

  useEffect(() => {
    const containsBreakdownMessage =
      notifications.filter((notification: Notification) => notification.type.includes('breakdown')).length > 0;

    //  FOR BREAKDOWN SHARING NOTIFICATION
    if (state.displayData) {
      if (
        state.displayData.breakdownComponent !== null &&
        state.displayData.breakdownComponent !== '' &&
        !containsBreakdownMessage
      ) {
        setNotifications([
          ...notifications,
          { message: 'The teacher is requesting you to come to the breakdown!', type: 'breakdown' },
        ]);
      } else if (
        state.displayData.breakdownComponent === null ||
        state.displayData.breakdownComponent === '' ||
        state.displayData.breakdownComponent === state.pages[state.currentPage].stage
      ) {
        setNotifications(notifications.filter((notification: Notification) => notification.type !== 'breakdown'));
      }
    }
  }, [state.displayData, state.currentPage]);

  return (
    <div className={`w-full mt-8`}>
      {notifications.length > 0
        ? notifications.map((notification: Notification, key: number) => (
            <div
              key={key}
              className={`${theme.section} ${key > 0 ? 'mt-2' : ''} ${
                notification.type === 'breakdown' ? 'bg-orange-600' : 'bg-sea-green'
              } rounded-lg bg-opacity-40 border border-white border-opacity-40 text-sm text-white animate-fadeIn`}>
              {notification.message}
            </div>
          ))
        : null}
    </div>
  );
};

export default NotificationBar;
