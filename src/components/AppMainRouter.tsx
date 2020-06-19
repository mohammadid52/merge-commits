import React, { useContext, useState, Suspense, lazy } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
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
 } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
import AuthRoutes from './Auth/AuthRoutes';
// import Lesson from './Lesson/Lesson';

const MainRouter: React.FC = () => {
    const { theme, state } = useContext(GlobalContext);

    const redirectLocation = !state.isAuthenticated ? "/login" : "/dashboard";

    return (
        <Router>
            { console.log(state) }
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
                        {/* <PrivateRoute path="/lesson" isAuthenticated={isAuthenticated}>
                            <Lesson />
                        </PrivateRoute> */}
                        <Route 
                            exact
                            path="/"
                            render={({ location }) => (
                                <Redirect 
                                    to={{
                                    pathname: redirectLocation,
                                    state: { from: location }
                                }}/>
                            )} 
                        />
                    </Switch>
                </Suspense>
            </div>
        </Router>
    )
}

export default MainRouter;