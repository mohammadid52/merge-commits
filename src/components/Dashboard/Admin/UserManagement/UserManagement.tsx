import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import UserLookup from './UserLookup';
import User from './User';
import UserInformation from './UserInformation';

const UserManagement = () => {
    const match = useRouteMatch();
    
    return (
        <div className={`w-full h-full p-8`}>
            {/* <div className={`w-full h-1/10`}>
                
            </div> */}
            <div className={`w-full h-full`}>
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
        </div>
    )
}

export default UserManagement