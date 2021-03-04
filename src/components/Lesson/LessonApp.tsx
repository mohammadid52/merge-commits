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
import set = Reflect.set;

const LessonApp = () => {
  const { state, theme } = useContext(LessonContext);
  const [overlay, setOverlay] = useState<string>('');

  if (state.status !== 'loaded') {
    return <LessonLoading />;
  }

  return (
    <div className={`${theme.bg} w-full md:h-screen flex flex-col items-start`}>
      <LessonHeaderBar overlay={overlay} setOverlay={setOverlay}/>
      {/*<NotificationBar />*/}

      {/**
       *  COMPONENT OVERLAY
       *  TODO:
       *    - Make a component for the overlay
       */}
      <div className={`fixed w-1/2 right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 ${overlay === '' ? 'z-0' : 'z-50'}`}>
        <NotesForm overlay={overlay} setOverlay={setOverlay}/>
      </div>

      <Body />
      <Foot />
    </div>
  );
};

export default LessonApp;
