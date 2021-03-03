import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../contexts/LessonContext';
import Body from './Body/Body';
// import Foot from './Foot/_Foot';
import LessonLoading from './Loading/LessonLoading';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import BottomMenu from '../Lesson/Foot/BottomMenu';
import Foot from './Foot/Foot';
import NotificationBar from './Header/NotificationBar';
import queryString from 'query-string';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import * as customQueries from '../../customGraphql/customQueries';
import NotesForm from './LessonComponents/Notes/NotesForm';

const LessonApp = () => {
  const { state, theme } = useContext(LessonContext);

  if (state.status !== 'loaded') {
    return <LessonLoading />;
  }

  return (
    <div className={`${theme.bg} w-full md:h-screen flex flex-col items-start`}>
      <LessonHeaderBar />
      <NotificationBar />
      <NotesForm/>
      <Body />
      <Foot />
    </div>
  );
};

export default LessonApp;
