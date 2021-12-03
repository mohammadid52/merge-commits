import React, {useContext, useEffect} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import User from './User';
import UserLookup from './UserLookup';

const UserManagement = () => {
  const {dispatch} = useContext(GlobalContext);
  const match = useRouteMatch();

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'manage-users'}});
  }, []);

  return (
    <div className={`w-full h-full p-8 flex justify-center`}>
      <Switch>
        <Route exact path={`${match.url}`} render={() => <UserLookup />} />
        <Route path={`${match.url}/user`} render={() => <User />} />
      </Switch>
    </div>
  );
};

export default UserManagement;
