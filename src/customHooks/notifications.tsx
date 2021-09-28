import {useContext} from 'react';
import {GlobalContext} from '../contexts/GlobalContext';
import {NotificationListItem} from '../interfaces/GlobalInfoComponentsInterfaces';
import {useHistory} from 'react-router-dom';

const useGlobalNotifications = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const history = useHistory();

  const watchlist = [
    {
      check: state.user.image !== null && state.user.image !== '',
      notification: {
        label: 'Avatar not set',
        message: 'Please set up your avatar to complete your profile!',
        type: 'alert',
        cta: 'Change Now',
      },
      action: () => {
        history.push('/dashboard/profile');
        dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'profile'}});
      },
    },
  ];

  const collectNotifications = (list: NotificationListItem[]) => {
    return list.reduce((acc: NotificationListItem[], val: NotificationListItem) => {
      if (!val.check) {
        return [...acc, val];
      } else {
        return acc;
      }
    }, []);
  };

  return {
    globalNotifications: collectNotifications(watchlist),
  };
};

const useNotifications = (props: 'lesson' | 'lessonControl' | 'global') => {
  const {globalNotifications} = useGlobalNotifications();

  const notifications = (switchByContext: string) => {
    switch (switchByContext) {
      case 'global':
        return globalNotifications;
      default:
        return null;
    }
  };

  return {notifications: notifications(props)};
};

export default useNotifications;
