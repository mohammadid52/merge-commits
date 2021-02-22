import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import {
    Route,
    Redirect,
  } from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode
}

const AuthRoutes = ({children}: PrivateRouteProps) => {
    const { state } = useContext(GlobalContext)

    if (state.isAuthenticated) {
        return null
    }

    return (
        <>
            {children}
        </>
    )
}

export default AuthRoutes;