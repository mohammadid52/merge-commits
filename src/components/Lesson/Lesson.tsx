import React from 'react';
// import {LessonContextProvider} from '../../contexts/LessonContext';
import LessonApp from './LessonApp';
import Noticebar from '@components/Noticebar/Noticebar';
import useNotifications from '@customHooks/notifications';

const Lesson = () => {
  const {notifications} = useNotifications('lesson');
  return (
    <>
      {/* <LessonContextProvider> */}
      <Noticebar notifications={notifications} />
      <LessonApp />
      {/* </LessonContextProvider> */}
    </>
  );
};

export default React.memo(Lesson);
