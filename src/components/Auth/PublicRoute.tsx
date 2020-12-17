import React from 'react';
import { Route, Redirect } from "react-router-dom";

interface PublicRouteProps {
  path: string
  children: React.ReactNode
  restricted: boolean
}

const PublicRoute = ({ children, path, restricted }: PublicRouteProps) => {
  const accessToken = sessionStorage.getItem('accessToken');

  // restricted will identify if need to hide this route from authenticated users.

  return (
    <Route
      path={path}
      render={({ location }) =>
        (accessToken && restricted) ? (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: location }
            }}
          />
        ) : (
            children
          )
      }
    />
  )
}

export default PublicRoute;