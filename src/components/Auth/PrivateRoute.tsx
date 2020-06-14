import React from 'react';
import {
    Route,
    Redirect,
  } from "react-router-dom";

interface PrivateRouteProps {
    isAuthenticated: boolean
    path: string
    children: React.ReactNode
}

const PrivateRoute = ({isAuthenticated, children, path}: PrivateRouteProps) => {
    return (
        <Route 
        path={path}
        render={({ location }) =>
            isAuthenticated ? (
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