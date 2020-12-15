import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { GlobalContext } from '../../contexts/GlobalContext';
import {
  Route,
  Redirect,
} from "react-router-dom";

interface PrivateRouteProps {
  path: string
  children: React.ReactNode
}

const PrivateRoute = ({ children, path }: PrivateRouteProps) => {
  const { state } = useContext(GlobalContext);
  const [cookies] = useCookies();

  // TODO: Delay in state updating in the global 
  // context redirect everything to '/login' Need to fix this.(In progress...)

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