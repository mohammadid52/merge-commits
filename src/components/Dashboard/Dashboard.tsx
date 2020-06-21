import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { GlobalContext } from '../../contexts/GlobalContext';
import { 
    useRouteMatch,
    Switch, 
    Route,
 } from 'react-router-dom';
// import PageHeaderBar from '../Header/PageHeaderBar';
import SideMenu from './Menu/SideMenu';
const DashboardHome = lazy(() => import('./DashboardHome/DashboardHome'))
const Classroom = lazy(() => import('./Classroom/Classroom'))
const Profile = lazy(() => import('./Profile/Profile'))
const Links = lazy(() => import('./Menu/Links'))
const ProfileLink = lazy(() => import('./Menu/ProfileLink'))
import * as queries from '../../graphql/queries';


type userObject = {
    [key: string]: any,
}

const Dashboard: React.FC = () => {
    const match = useRouteMatch();
    const { state, dispatch } = useContext(GlobalContext);

    const setUser = (user: userObject) => {
        let firstName = user.preferredName ? user.preferredName : user.firstName
        dispatch({
            type: 'SET_USER',
            payload: {
                firstName: firstName,
                lastName: user.lastName,
                language: user.language,
                role: user.role,
            }
        })
    }

    async function getUser() {
        try {
            // this any needs to be changed once a solution is found!!!
            const user: any = await API.graphql(graphqlOperation(queries.getPerson, { email: state.user.email, authId: state.user.authId }))
            console.log(user)
            setUser(user.data.getPerson);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className={`w-full h-full flex`}>
            <SideMenu>
                <ProfileLink />
                <Links />
            </SideMenu>
            <div className={`flex-grow`}>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route 
                        exact
                        path={`${match.url}`}
                        render={() => (
                            <DashboardHome />
                        )}
                        
                    />
                    <Route 
                        path={`${match.url}/classroom`}
                        render={() => (
                            <Classroom />
                        )}
                    />
                    <Route 
                        path={`${match.url}/profile`}
                        render={() => (
                            <Profile />
                        )}
                    />
                </Switch>
            </Suspense>
            </div>
        </div>
    )
}

export default Dashboard;