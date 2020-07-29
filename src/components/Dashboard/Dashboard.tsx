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
import { useCookies } from 'react-cookie';
const DashboardHome = lazy(() => import('./DashboardHome/DashboardHome'))
const Classroom = lazy(() => import('./Classroom/Classroom'))
const Profile = lazy(() => import('./Profile/Profile'))
const Links = lazy(() => import('./Menu/Links'))
const ProfileLink = lazy(() => import('./Menu/ProfileLink'))
const Registration = lazy(() => import('./Admin/Registration'))
import * as queries from '../../graphql/queries';
import PageHeaderBar from '../Header/PageHeaderBar';
import LessonPlanHome from './LessonPlanner/LessonPlanHome';


type userObject = {
    [key: string]: any,
}

const Dashboard: React.FC = () => {
    const match = useRouteMatch();
    const [cookies, setCookie] = useCookies(['auth']);
    const { state, dispatch } = useContext(GlobalContext);

    const setUser = (user: userObject) => {
        let firstName = user.preferredName ? user.preferredName : user.firstName
        dispatch({
            type: 'SET_USER',
            payload: {
                id: user.id,
                firstName: firstName,
                lastName: user.lastName,
                language: user.language,
                role: user.role,
            }
        })

        setCookie('auth', { ...cookies.auth, role: user.role, firstName: firstName, id: user.id })
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
        if( !state.user.firstName ) {
            getUser()
        }
    }, [])

    return ( 
            <div className={`w-full h-full flex`}>
                <SideMenu>
                    <ProfileLink />
                    <Links />
                </SideMenu>
                <div className={`height h-full flex flex-col`}>
                <PageHeaderBar />
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
                            path={`${match.url}/registration`}
                            render={() => (
                                <Registration />
                            )}
                        />
                        <Route 
                            path={`${match.url}/profile`}
                            render={() => (
                                <Profile />
                            )}
                        />
                        <Route 
                            path={`${match.url}/lesson-planner`}
                            render={() => (
                                <LessonPlanHome />
                            )}
                        />
                    </Switch>
                </Suspense>
                </div>
            </div>
    )
}

export default Dashboard;