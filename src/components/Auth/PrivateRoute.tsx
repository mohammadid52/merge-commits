import React from 'react';
import {Route} from 'react-router-dom';

interface PrivateRouteProps {
  path: string;
  children: React.ReactNode;
}

const PrivateRoute = ({children, path}: PrivateRouteProps) => {
  return <Route path={path} render={() => children} />;
};

export default PrivateRoute;
