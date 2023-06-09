import ErrorBoundary from '@components/Error/ErrorBoundary';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {listPersons} from 'customGraphql/customQueries';
import {useEffect, useState} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

import UniversalLessonBuilder from '../../../Lesson/UniversalLessonBuilder/UniversalLessonBuilder';
import LessonBuilder from './LessonBuilder';
import LessonsList from './LessonsList';

interface ILessonBuilderHomeProps {
  instId?: string;
}

const LessonsBuilderHome = ({instId = ''}: ILessonBuilderHomeProps) => {
  const {dispatch} = useGlobalContext();

  const match = useRouteMatch();

  const [designersList, setDesignersList] = useState<any[]>([]);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_CURRENTPAGE',
      payload: {data: 'lesson-builder'}
    });
  }, []);

  const fetchPersonsList = async () => {
    const result: any = await API.graphql(
      graphqlOperation(listPersons, {
        filter: {
          or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}, {role: {eq: 'FLW'}}]
        }
      })
    );
    const savedData = result.data.listPeople;
    const updatedList = savedData?.items.map(
      (item: {id: string; firstName: string; lastName: string}) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`
      })
    );
    setDesignersList(updatedList);
  };

  useEffect(() => {
    fetchPersonsList();
  }, []);

  /**
   * NewLessonPlanSO modal
   *  This was the most logical place to put it
   *  as it needs to overlay several of the components below
   */

  return (
    <>
      <div className={``}>
        {/*<UniversalLessonBuilderProvider>*/}
        <Switch>
          <Route
            exact
            path={`${match.url}`}
            render={() => (
              <ErrorBoundary componentName="LessonsList">
                <LessonsList isInInstitution instId={instId} />
              </ErrorBoundary>
            )} // Lessons builder List Home
          />
          <Route
            exact
            path={`${match.url}/add`}
            render={() => (
              <ErrorBoundary componentName="LessonBuilder">
                <LessonBuilder designersList={designersList} instId={instId} />
              </ErrorBoundary>
            )} // Add new lesson form
          />
          <Route
            exact
            path={`${match.url}/:lessonId`}
            render={() => (
              // <LessonEdit designersList={designersList} />
              <ErrorBoundary componentName="LessonBuilder">
                <LessonBuilder designersList={designersList} instId={instId} />
              </ErrorBoundary>
            )} // Edit lesson, assessment or survey form
          />

          {/* <Route
            exact
            path={`${match.url}/lesson/add/lesson-plan`}
            render={() => (
              <ErrorBoundary componentName="LessonPlan">
                <LessonPlan />
              </ErrorBoundary>
            )}
          /> */}
          <Route
            path={`${match.url}/:lessonId/page-builder`}
            render={() => (
              <ErrorBoundary componentName="UniversalLessonBuilder">
                <UniversalLessonBuilder instId={instId} />
              </ErrorBoundary>
            )}
          />
        </Switch>
        {/*</UniversalLessonBuilderProvider>*/}
      </div>
    </>
  );
};

export default LessonsBuilderHome;
