import React, { useContext, useState, Suspense, lazy } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import PageHeaderBar from './Header/PageHeaderBar';
import Login from './Auth/Login';
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const Registration = lazy(() => import('./Auth/Register'));
import { 
    BrowserRouter as Router,
    Switch, 
    Route,
    Redirect,
 } from 'react-router-dom';
import PrivateRoute from './Auth/PrivateRoute';
// import Lesson from './Lesson/Lesson';

const MainRouter: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);

    let loginLinks = !isAuthenticated ? [
        {
        path: "/register",
        name: "Register"
        },
        {
        path: "/",
        name: "Login"
        },
        ] : null

    return (
        <Router>
            <div className={`min-h-screen w-screen ${theme.bg} flex flex-col`}>
                <PageHeaderBar links={loginLinks} />
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route 
                            exact
                            path="/"
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
                        <PrivateRoute path="/dashboard" isAuthenticated={isAuthenticated}>
                            <Dashboard />  
                        </PrivateRoute>
                        {/* <PrivateRoute path="/lesson" isAuthenticated={isAuthenticated}>
                            <Lesson />
                        </PrivateRoute> */}
                    </Switch>
                </Suspense>
            </div>
        </Router>
    )
}

export default MainRouter;