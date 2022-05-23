import Noticebar from '@components/Noticebar/Noticebar';
import useNotifications from '@customHooks/notifications';
import useAuth from '@customHooks/useAuth';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import LessonControl from './LessonControl';

const TeacherView = () => {
  const {notifications} = useNotifications('lessonControl');
  const {isTeacher} = useAuth();

  const history = useHistory();

  // @ts-ignore
  useEffect(() => {
    if (!isTeacher) {
      history.push('/dashboard');
    }
  }, [isTeacher]);

  if (isTeacher) {
    return (
      <>
        <Noticebar notifications={notifications} />
        <LessonControl />
      </>
    );
  } else {
    return null;
  }
};

export default TeacherView;
