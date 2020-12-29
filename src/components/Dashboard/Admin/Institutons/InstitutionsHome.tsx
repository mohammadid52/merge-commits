import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import InstitutionLookup from './InstitutionLookup';
import Institution from './Institution';
import InstitutionAdd from './InstitutionAdd';
import ClassBuilder from './Builders/ClassBuilder';
import RoomBuilder from './Builders/RoomBuilder';
import CurricularBuilder from './Builders/CurricularBuilder';
import EditClass from './EditBuilders/EditClass';

const InstitutionsHome = () => {
  const match = useRouteMatch();

  return (
    <div className={`w-full h-full p-8 flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <InstitutionLookup />}
        />
        <Route
          path={`${match.url}/add`}
          render={() => <InstitutionAdd />}
        />
        <Route
          path={`${match.url}/institution`}
          render={() => <Institution />}
        />
        <Route
          path={`${match.url}/class-creation`}
          render={() => <ClassBuilder />}
        />
        <Route
          path={`${match.url}/curricular-creation`}
          render={() => <CurricularBuilder />}
        />
        <Route
          path={`${match.url}/room-creation`}
          render={() => <RoomBuilder />}
        />
        <Route
          path={`${match.url}/class-edit`}
          render={() => <EditClass />}
        />
        {/* <Route
          path={`${match.url}/room-edit`}
          render={() => <EditRoom />}
        />
        <Route
          path={`${match.url}/curricular-edit`}
          render={() => <EditCurricular />}
        /> */}
      </Switch>
    </div>
  );
};

export default InstitutionsHome;
