import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as customQueries from '../../../../customGraphql/customQueries';
import * as queries from '../../../../graphql/queries';
import LessonPlan from '../../../Lesson/UniversalLessonBuilder/UI/LessonPlan/LessonPlan';
import UniversalLessonBuilder from '../../../Lesson/UniversalLessonBuilder/UniversalLessonBuilder';
import LessonBuilder from './LessonBuilder';
import LessonsList from './LessonsList';
import LessonTabView from './StepActionComponent/LessonTabView';

interface ILessonBuilderHomeProps {
  instId: string;
}

const LessonsBuilderHome = ({instId}: ILessonBuilderHomeProps) => {
  const {dispatch} = useContext(GlobalContext);

  const match = useRouteMatch();

  const [designersList, setDesignersList] = useState([]);
  const [institutionList, setInstitutionList] = useState([]);

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'lesson-builder'}});
  }, []);

  const fetchPersonsList = async () => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.listPersons, {
        filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}, {role: {eq: 'FLW'}}]},
      })
    );
    const savedData = result.data.listPersons;
    const updatedList = savedData?.items.map(
      (item: {id: string; firstName: string; lastName: string}) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`,
      })
    );
    setDesignersList(updatedList);
  };

  const fetchInstitutionsList = async () => {
    const result: any = await API.graphql(graphqlOperation(queries.listInstitutions));
    const savedData = result.data.listInstitutions;
    const updatedList = savedData?.items.map((item: {id: string; name: string}) => ({
      id: item?.id,
      name: item?.name || '',
      value: item?.name || '',
    }));
    setInstitutionList(updatedList);
  };

  useEffect(() => {
    fetchPersonsList();
    fetchInstitutionsList();
  }, []);

  /**
   * NewLessonPlanSO modal
   *  This was the most logical place to put it
   *  as it needs to overlay several of the components below
   */

  // const NewLessonPlanModal = (_:any) =>
  // <div className={`col-span-1`}>
  //   <NewLessonPlanSO
  //     editMode={editMode}
  //     setEditMode={setEditMode}
  //     pageDetails={editMode ? activePageData : {}} // don't send unwanted page details if not editing
  //     open={newLessonPlanShow}
  //     setOpen={setNewLessonPlanShow}
  //     activePageData={activePageData}
  //   />
  // </div>
  // }

  return (
    <>
      <div className={`w-full h-full flex justify-center`}>
        {/*<UniversalLessonBuilderProvider>*/}
        <Switch>
          <Route
            exact
            path={`${match.url}`}
            render={() => <LessonsList isInInstitution instId={instId} />} // Lessons builder List Home
          />
          <Route
            exact
            path={`${match.url}/add`}
            render={() => (
              <LessonBuilder
                designersList={designersList}
                institutionList={institutionList}
                instId={instId}
              />
            )} // Add new lesson form
          />
          <Route
            exact
            path={`${match.url}/:lessonId`}
            render={() => (
              // <LessonEdit designersList={designersList} />
              <LessonBuilder
                designersList={designersList}
                institutionList={institutionList}
                instId={instId}
              />
            )} // Edit lesson, assessment or survey form
          />
          <Route
            exact
            path={`${match.url}/lesson/view`}
            render={() => <LessonTabView designersList={designersList} />}
          />
          <Route
            exact
            path={`${match.url}/lesson/add/lesson-plan`}
            render={() => <LessonPlan />}
          />
          <Route
            path={`${match.url}/:lessonId/page-builder`}
            render={() => <UniversalLessonBuilder instId={instId} />}
          />
        </Switch>
        {/*</UniversalLessonBuilderProvider>*/}
      </div>
    </>
  );
};

export default LessonsBuilderHome;
