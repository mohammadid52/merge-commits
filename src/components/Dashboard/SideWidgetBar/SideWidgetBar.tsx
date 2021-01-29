import React, { useContext } from 'react';
import { DashboardProps } from '../Dashboard';

import {
  ImageWidget,
  MediaRecommendation,
  TeacherNotifications,
  UpcomingLessonsWidget,
} from './Widgets';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { getAsset } from '../../../assets'

const SideWidgetBar = (props: DashboardProps) => {
  const { currentPage, setVisibleLessonGroup } = props;
  const { state, clientKey } = useContext(GlobalContext);
  return (
    <div id={`sideWidgetBar`} className={`w-2/10 max-w-80 min-w-48`}>
      <ImageWidget
        source={getAsset(clientKey, 'logo_symbol')}
        altdesc={`school-logo`}
        card={false}
        classProp={`w-16 h-auto mx-auto`}
      />
      {/**
       * Upcoming Lessons
       */}
      {currentPage === 'classroom' && state.sidebar.upcomingLessons.length > 0 && (
        <UpcomingLessonsWidget lessons={state.sidebar.upcomingLessons} setVisibleLessonGroup={setVisibleLessonGroup}/>
      )}

      {/**
       * Teacher Notifications
       */}
      {<TeacherNotifications />}
      {<MediaRecommendation/>}

      {/**
       * Fun Widget
       */}
      {
      <ImageWidget
      source={`https://selready.s3.us-east-2.amazonaws.com/SpongeBobMeme.jpeg`}
      altdesc={`fun-meme`}
      title={`Meme`}
      card={true}
      classProp={`w-auto h-auto`}
      />
      }
    </div>
  );
};

export default SideWidgetBar;
