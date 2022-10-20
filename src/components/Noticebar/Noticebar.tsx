import React, {useState, useEffect} from 'react';
import {NotificationListItem} from 'interfaces/GlobalInfoComponentsInterfaces';

interface INoticebarProps {
  notifications: any[];
}

const Noticebar = ({notifications}: INoticebarProps) => {
  // ~~~~~~ INDEX OF DISPLAYED NOTICE ~~~~~~ //
  const [noticeIndex, setNoticeIndex] = useState<number>(null);
  useEffect(() => {
    if (notifications && notifications.length > 0 && noticeIndex === null) {
      setNoticeIndex(notifications.length - 1);
    }
  }, [notifications]);

  const nextIndex = (idx: number, maxNr: number) => {
    if (idx < maxNr) {
      setNoticeIndex(idx + 1);
    }
  };

  const prevIndex = (idx: number, minNr: number) => {
    if (idx > minNr) {
      setNoticeIndex(idx - 1);
    }
  };

  // ~~~~~~~~~~~ NEXT & PREVIOUS ~~~~~~~~~~~ //
  const getNextPreviousControls = (
    currentNr: number,
    totalNr: number,
    prevFn: Function,
    nextFn: Function
  ) => {
    const startingNumber = currentNr + 1;
    return (
      <div className="w-auto flex flex-row text-white">
        <span onClick={() => prevFn()} className="cursor-pointer mr-1">
          &#9664;
        </span>
        <span>{startingNumber + '/' + totalNr}</span>
        <span onClick={() => nextFn()} className="cursor-pointer ml-1">
          &#9654;
        </span>
      </div>
    );
  };

  // ~~~~~~~~~~~~~~~~ COLOR ~~~~~~~~~~~~~~~~ //
  const bgStyle = (currentNr: number, noticeList: any[]) => {
    const notificationType = noticeList[currentNr].notification.type;
    switch (notificationType) {
      case 'info':
        return 'iconoclast:bg-main curate:bg-main';
      case 'positive':
        return 'bg-green-400';
      case 'alert':
        return 'bg-orange-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-dark-gray';
    }
  };

  const basicStyle = `font-semibold text-sm text-white justify-center`;
  const linkColor = `font-bold cursor-pointer underline text-blue-600 hover:text-blue-800 visited:text-purple-600`;

  return (
    <>
      {notifications && notifications.length > 0 && noticeIndex !== null && (
        <div className={`w-full h-10 p-2 ${bgStyle(noticeIndex, notifications)}`}>
          <div className={`h-full flex flex-row items-center content-center`}>
            <div className={`px-2 flex flex-row ${basicStyle}`}>
              <span className={`w-auto`}>
                {notifications[noticeIndex].notification.label}
                {notifications[noticeIndex].notification.message &&
                  ` - ${notifications[noticeIndex].notification.message}`}
              </span>
              <span
                className={`w-auto mx-2 ${linkColor}`}
                onClick={notifications[noticeIndex].action}>
                {notifications[noticeIndex].notification.cta}
              </span>
            </div>
            {notifications &&
              notifications.length > 1 &&
              getNextPreviousControls(
                noticeIndex,
                notifications.length,
                () => prevIndex(noticeIndex, 0),
                () => nextIndex(noticeIndex, notifications.length - 1)
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Noticebar);
