import React, { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from '../Auth/PrivateRoute';

const Dashboard = lazy(() => import('../Dashboard/Dashboard'));
const Lesson = lazy(() => import('../Lesson/Lesson'));
const TeacherView = lazy(() => import('../TeacherView/TeacherView'));

interface AuthRoutesProps {
    updateAuthState: Function
}

const AuthRoutes = ({ updateAuthState }: AuthRoutesProps) => {
    return (
        <Switch>
            <PrivateRoute path='/dashboard'>
                <Dashboard updateAuthState={updateAuthState} />
            </PrivateRoute>
            <PrivateRoute path='/lesson'>
                <Lesson />
            </PrivateRoute>
            <PrivateRoute path='/lesson-control'>
                <TeacherView />
            </PrivateRoute>
            <Route
                exact
                path='/'
                render={({ location }) => (
                    <Redirect
                        to={{
                            pathname: '/dashboard',
                            state: { from: location },
                        }}
                    />
                )}
            />
            <Route render={() => <Redirect to="/" />} />
        </Switch>
    )
}

export default AuthRoutes;