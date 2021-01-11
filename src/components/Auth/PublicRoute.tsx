import React from 'react';
import { Route, Redirect } from "react-router-dom";

interface PublicRouteProps {
  path: string
  children: React.ReactNode
  restricted: boolean
}

const PublicRoute = ({ children, path, restricted }: PublicRouteProps) => {
  return (
    <Route
      path={path}
      render={({ location }) =>
        children
      }
    />
  )
}

export default PublicRoute;