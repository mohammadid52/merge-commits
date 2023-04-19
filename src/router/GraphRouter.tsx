import ErrorBoundary from '@components/Error/ErrorBoundary';
import PageLayout from 'layout/PageLayout';
import AttachedCoursesGraph from 'pages/graphs/AttachedCoursesGraph';
import InstitutionLocationGraph from 'pages/graphs/InstitutionLocationGraph';
import StudentsByStatusGraphs from 'pages/graphs/students/StudentsByStatusGraph';
import SurveyCompletedGraph from 'pages/graphs/SurveyCompletedGraph';
import WritingExerciseGraph from 'pages/graphs/WritingExerciseGraph';
import {Suspense} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

const GraphRouter = () => {
  const match = useRouteMatch();
  const getTitleByPath = (path: string) => {
    switch (true) {
      case path.includes('/students'):
        return 'Active and Inactive Students';
      case path.includes('/surveys'):
        return 'Surveys Completed By Students';
      case path.includes('/courses'):
        return 'Courses Attached to Classrooms';
      case path.includes('/institutions'):
        return 'Institutions Locations';
      case path.includes('/writing-exercises'):
        return 'Writing Exercises';
      default:
        return '';
    }
  };

  return (
    <Suspense>
      <div className="" id="graph-container">
        <PageLayout type="inner" title={getTitleByPath(location.pathname)}>
          <Switch>
            <Route
              path={`${match.url}/students`}
              exact
              render={() => (
                <ErrorBoundary componentName="StudentActiveGraph">
                  <StudentsByStatusGraphs />
                </ErrorBoundary>
              )}
            />
            <Route
              path={`${match.url}/surveys`}
              exact
              render={() => (
                <ErrorBoundary componentName="SurveyCompletedGraph">
                  <SurveyCompletedGraph />
                </ErrorBoundary>
              )}
            />
            <Route
              path={`${match.url}/courses`}
              exact
              render={() => (
                <ErrorBoundary componentName="AttachedCoursesGraph">
                  <AttachedCoursesGraph />
                </ErrorBoundary>
              )}
            />
            <Route
              path={`${match.url}/institutions`}
              exact
              render={() => (
                <ErrorBoundary componentName="AttachedCoursesGraph">
                  <InstitutionLocationGraph />
                </ErrorBoundary>
              )}
            />
            <Route
              path={`${match.url}/writing-exercises`}
              exact
              render={() => (
                <ErrorBoundary componentName="WritingExerciseGraph">
                  <WritingExerciseGraph />
                </ErrorBoundary>
              )}
            />
          </Switch>
        </PageLayout>
      </div>
    </Suspense>
  );
};

export default GraphRouter;
