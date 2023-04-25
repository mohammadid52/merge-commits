import React from "react";
import { Route } from "react-router-dom";

interface PublicRouteProps {
  path: string;
  children: React.ReactNode;
  restricted: boolean;
}

const PublicRoute = ({ children, path }: PublicRouteProps) => {
  return <Route path={path} render={() => children} />;
};

export default PublicRoute;
