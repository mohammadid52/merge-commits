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
  return (
    <Route
      path={path}
      render={({ location }) =>
          children
      }
    />
  )
}

export default PrivateRoute;