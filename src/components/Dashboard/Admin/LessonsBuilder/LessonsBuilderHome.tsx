import React, {useContext, useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {Switch, Route, useRouteMatch} from 'react-router-dom';

import * as customQueries from '../../../../customGraphql/customQueries';
import * as queries from '../../../../graphql/queries';

import LessonBuilder from './LessonBuilder';
import LessonsList from './LessonsList';
import LessonEdit from './LessonEdit';
import {GlobalContext} from '../../../../contexts/GlobalContext';

const LessonsBuilderHome = () => {
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
        filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]},
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

  return (
    <div className={`w-full h-full p-8 flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <LessonsList />} // Lessons builder List Home
        />
        <Route
          exact
          path={`${match.url}/lesson/add`}
          render={() => (
            <LessonBuilder
              designersList={designersList}
              institutionList={institutionList}
            />
          )} // Add new lesson form
        />
        <Route
          exact
          path={`${match.url}/lesson/edit`}
          render={() => <LessonEdit designersList={designersList} />} // Edit lesson, assessment or survey form
        />
      </Switch>
    </div>
  );
};

export default LessonsBuilderHome;
