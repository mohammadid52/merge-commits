import Noticebar from '@components/Noticebar/Noticebar';
import useNotifications from '@customHooks/notifications';
import React from 'react';
import LessonControl from './LessonControl';

const TeacherView = () => {
  const {notifications} = useNotifications('lessonControl');
  return (
    <>
      <Noticebar notifications={notifications} />
      <LessonControl />
    </>
  );
};

export default TeacherView;
