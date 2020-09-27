import React, { useContext, useEffect, useState, Suspense, lazy } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
// import { Auth } from 'aws-amplify';;
import {Auth} from '@aws-amplify/auth';
import PageHeaderBar from './Header/PageHeaderBar';
import Login from './Auth/Login';
import Forgot from './Auth/Forgot';
const Confirmation = lazy(() => import('./Auth/Confirmation'));
const PrivacyPolicy = lazy(() => import('./Auth/PrivacyPolicy'));
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const Registration = lazy(() => import('./Auth/Register'));
const Lesson = lazy(() => import('./Lesson/Lesson'));
const TeacherView = lazy(() => import('./TeacherView/TeacherView'))
import { 
    Switch, 
    Route,
    Redirect,
    useHistory,
 } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
import NewPassword from './Auth/NewPassword';
import Reset from './Auth/Reset';

const MainRouter: React.FC = () => {
    const { theme, state, dispatch } = useContext(GlobalContext);
    const history = useHistory();
    const [ cookies ] = useCookies(['auth']);

    const checkUserAuthenticated = () => {
        Auth.currentAuthenticatedUser()
        .then( user => {
            console.log(user);
            dispatch({
                type: 'PREV_LOG_IN',
                payload: {
                    email: user.attributes.email,
                    authId: user.attributes.sub
                }
            })
            history.push('/dashboard');
        })
        .catch((err) => console.error(err))
    }


    useEffect(() => {
        checkUserAuthenticated()
    }, [])
    
    return (
        <div className={`background-test h-screen md:max-w-full md:h-full w-screen ${theme.bg} flex flex-col`}>
            <Suspense fallback={
            <div className="min-h-screen w-full flex flex-col justify-center items-center">
                <div className="min-h-full w-full flex flex-col justify-center items-center">
                    Give us one second! It is loading... 
                </div>
            </div>
            }> 
                <Switch> 
                    <Route 
                        path="/login"
                        render={() => (
                            <Login />
                        )}
                    />
                    <Route 
                        path="/register"
                        render={() => (
                            <Registration />  
                        )} 
                    />
                    <Route 
                        path="/confirm"
                        render={() => (
                            <Confirmation />  
                        )} 
                    />
                    <Route 
                        path="/new-password"
                        render={() => (
                            <NewPassword />  
                        )} 
                    />
                    <Route 
                        path="/forgot-password"
                        render={() => (
                            <Forgot />  
                        )} 
                    />
                    <Route 
                        path="/reset-password"
                        render={() => (
                            <Reset />  
                        )} 
                    />
                    <Route 
                        path="/privacy-policy"
                        render={() => (
                            <PrivacyPolicy />  
                        )} 
                    />
                    <PrivateRoute path="/dashboard" >
                        <Dashboard />  
                    </PrivateRoute>
                    <PrivateRoute path="/lesson" >
                        <Lesson />
                    </PrivateRoute>
                    <PrivateRoute path="/lesson-control" >
                        <TeacherView />
                    </PrivateRoute>
                    <Route 
                        exact
                        path="/"
                        render={({ location }) => (
                            <Redirect 
                                to={{
                                pathname: '/dashboard',
                                state: { from: location }
                            }}/>
                        )} 
                    />
                </Switch>
            </Suspense>
        </div>
    )
}

export default MainRouter;