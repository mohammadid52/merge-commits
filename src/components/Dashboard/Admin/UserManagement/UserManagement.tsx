import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import UserLookup from './UserLookup';
import User from './User';
import UserInformation from './UserInformation';

const UserManagement = () => {
    const match = useRouteMatch();
    
    return (
        <div className={`w-full h-full p-8 flex justify-center`}>

                <Switch>
                    <Route 
                        exact
                        path={`${match.url}`}
                        render={() => (
                            <UserLookup />
                        )}
                    />
                    <Route 
                        path={`${match.url}/user`}
                        render={() => (
                            <User />
                        )}
                    />
                </Switch>

        </div>
    )
}

export default UserManagement