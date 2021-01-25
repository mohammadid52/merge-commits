import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import LessonBuilder from './LessonBuilder';
import LessonsList from './LessonsList';

const LessonsBuilderHome = () => {
  const match = useRouteMatch();

  return (
    <div className={`w-full h-full p-8 flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <LessonsList />}    // Lessons builder List Home
        />
        <Route
          exact
          path={`${match.url}/add`}
          render={() => <LessonBuilder />}    // Add new lesson form
        />
      </Switch>
    </div>
  )
}

export default LessonsBuilderHome
