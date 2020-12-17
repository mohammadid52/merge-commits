import React from 'react';
import {
  Route,
  Redirect,
} from "react-router-dom";

interface PrivateRouteProps {
  path: string
  children: React.ReactNode
}

const PrivateRoute = ({ children, path }: PrivateRouteProps) => {
  const accessToken = sessionStorage.getItem('accessToken');

  return (
    <Route
      path={path}
      render={({ location }) =>
        accessToken ? (
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