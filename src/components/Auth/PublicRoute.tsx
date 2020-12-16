import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Redirect } from "react-router-dom";

interface PublicRouteProps {
  path: string
  children: React.ReactNode
  restricted: boolean
}

const PublicRoute = ({ children, path, restricted }: PublicRouteProps) => {
  const [cookies] = useCookies();

  return (
    <Route
      path={path}
      render={({ location }) =>
        (cookies.auth && restricted) ? (
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