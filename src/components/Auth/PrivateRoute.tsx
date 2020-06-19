import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import {
    Route,
    Redirect,
  } from "react-router-dom";

interface PrivateRouteProps {
    path: string
    children: React.ReactNode
}

const PrivateRoute = ({children, path}: PrivateRouteProps) => {
    const { state } = useContext(GlobalContext);
    console.log('priv')
    return (
        <Route 
        path={path}
        render={({ location }) =>
            state.isAuthenticated ? (
                children
            ) : (
                <Redirect
                    to={{
                    pathname: "/login",
                    state: { from: location }
                    }}
                 />
            )
        }
        />
    )
}

export default PrivateRoute;