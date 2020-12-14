import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import InstitutionLookup from './InstitutionLookup';
import Institution from './Institution';
import InstitutionAdd from './InstitutionAdd';

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
      </Switch>
    </div>
  );
};

export default InstitutionsHome;
