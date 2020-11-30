import React, { useContext, useEffect, useState, Suspense, lazy } from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import {
    useRouteMatch,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
// import PageHeaderBar from '../Header/PageHeaderBar';
import SideMenu from './Menu/SideMenu';
// import Classroom from './Classroom/Classroom';
import { useCookies } from 'react-cookie';
// const DashboardHome = lazy(() => import('./DashboardHome/DashboardHome'))
const Classroom = lazy(() => import('./Classroom/Classroom'))
const Profile = lazy(() => import('./Profile/Profile'))
const Links = lazy(() => import('./Menu/Links'))
const ProfileLink = lazy(() => import('./Menu/ProfileLink'))
const Registration = lazy(() => import('./Admin/UserManagement/Registration'))
const UserManagement = lazy(() => import('./Admin/UserManagement/UserManagement'))
import * as queries from '../../graphql/queries';
import PageHeaderBar from '../Header/PageHeaderBar';
import LessonPlanHome from './LessonPlanner/LessonPlanHome';
import InstitutionsHome from './Admin/Institutons/InstitutionsHome';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';


type userObject = {
    [key: string]: any,
}

const Dashboard: React.FC = () => {
    const match = useRouteMatch();
    const [cookies, setCookie] = useCookies(['auth']);
    const { state, dispatch } = useContext(GlobalContext);
    const [currentPage, setCurrentPage] = useState<string>('');

    const setUser = (user: userObject) => {
        let firstName = user.preferredName ? user.preferredName : user.firstName
        dispatch({
            type: 'SET_USER',
            payload: {
                id: user.id,
                firstName: firstName,
                lastName: user.lastName,
                language: user.language,
                onBoardSurvey: user.onBoardSurvey ? user.onBoardSurvey : false,
                role: user.role,
            }
        })

        setCookie('auth', { ...cookies.auth, role: user.role, firstName: firstName, id: user.id })
    }

    async function getUser() {
        try {
            // this any needs to be changed once a solution is found!!!
            const user: any = await API.graphql(graphqlOperation(queries.getPerson, { email: state.user.email, authId: state.user.authId }))
            // console.log(user)
            setUser(user.data.getPerson);
        } catch (error) {
            console.error(error)
        }
    }

    if (state.user.role === 'FLW') {

    }

    useEffect(() => {
        if (!state.user.firstName) {
            getUser()
        }
    }, [])

    return (
        <div className={`w-screen md:w-full h-screen md:h-full flex`}>
            <SideMenu setCurrentPage={setCurrentPage} currentPage={currentPage}>
                <ProfileLink setCurrentPage={setCurrentPage} currentPage={currentPage} />
                <Links setCurrentPage={setCurrentPage} currentPage={currentPage} />
            </SideMenu>
                <PageHeaderBar setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <div className={`height h-full overflow-x-hidden overflow-y-scroll flex flex-col`}>
                <Suspense fallback={
                    <div className="min-h-screen w-full flex flex-col justify-center items-center">
                        {/* <div className="min-h-full w-full flex flex-col justify-center items-center">
                        Give us one second! It is loading... 
                    </div> */}
                        <ComponentLoading />
                    </div>
                }>
                    <Switch>
                        <Route
                            exact
                            path={`${match.url}`}
                            render={() => (
                                <Classroom />
                            )}
                        />
                        {/* <Route
                            exact
                            path={`${match.url}`}
                            render={() => (
                                <LessonPlanHome />
                            )}
                        /> */}
                        <Route
                            path={`${match.url}/classroom`}
                            render={({ location }) => (
                                <Redirect
                                    to={{
                                        pathname: '/',
                                        state: { from: location }
                                    }} />
                            )}
                        />
                        <Route
                            path={`${match.url}/manage-users`}
                            render={() => (
                                <UserManagement />
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
                        <Route
                            path={`${match.url}/manage-institutions`}
                            render={() => (
                                <InstitutionsHome />
                            )}
                        />
                    </Switch>
                </Suspense>
            </div>
        </div>
    )
}

export default Dashboard;