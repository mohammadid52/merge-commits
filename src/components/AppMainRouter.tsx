import React, { useContext, useEffect, useState, Suspense, lazy } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import PageHeaderBar from './Header/PageHeaderBar';
import Login from './Auth/Login';
const Confirmation = lazy(() => import ('./Auth/Confirmation'));
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const Registration = lazy(() => import('./Auth/Register'));
import { 
    BrowserRouter as Router,
    Switch, 
    Route,
    Redirect,
    useHistory,
 } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
import AuthRoutes from './Auth/AuthRoutes';
import Lesson from './Lesson/Lesson';
// import Lesson from './Lesson/Lesson';

const MainRouter: React.FC = () => {
    const { theme, state, dispatch } = useContext(GlobalContext);
    const history = useHistory();
    const [ cookies ] = useCookies(['auth']);

    useEffect(() => {
        if (cookies.auth) {
            dispatch({ type: 'PREV_LOG_IN', payload: cookies.auth })
            history.push('/dashboard');
        }
    }, [])

    return (
        <div className={`min-h-screen w-screen ${theme.bg} flex flex-col`}>
            <PageHeaderBar />
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    {/* <AuthRoutes> */}
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
                    {/* </AuthRoutes> */}
                    <PrivateRoute path="/dashboard" >
                        <Dashboard />  
                    </PrivateRoute>
                    <PrivateRoute path="/lesson" >
                        <Lesson />
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