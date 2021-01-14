import React, { useContext } from 'react';

import {DashboardProps} from '../Dashboard';
import { FunWidget, TeacherNotifications, UpcomingLessonsWidget } from './Widgets';
import { GlobalContext } from '../../../contexts/GlobalContext';

const SideWidgetBar = (props: DashboardProps) => {
  const {state} = useContext(GlobalContext)
  return (
    <div id={`sideWidgetBar`} className={`w-2/10 max-w-80 min-w-48`}>
      {/**
       * Upcoming Lessons
       */}
      {
        state.sidebar.upcomingLessons.length > 0 &&
        <UpcomingLessonsWidget lessons={state.sidebar.upcomingLessons}/>
      }

      {/**
       * Teacher Notifications
       */}
      {
        <TeacherNotifications/>
      }

      {/**
       * Fun Widget
       */}
      {
        <FunWidget/>
      }
    </div>

  )
}

export default SideWidgetBar;