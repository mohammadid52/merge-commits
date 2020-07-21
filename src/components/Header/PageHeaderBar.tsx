import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';


const PageHeaderBar = () => {
    const [ , , removeCookie ] = useCookies(['auth']);
    const location = useLocation();
    const history = useHistory();
    const { theme, lightSwitch, forceTheme, state, dispatch } = useContext(GlobalContext);

    async function SignOut() {
        try {
            await Auth.signOut();
            removeCookie('auth');
            dispatch({type: 'CLEANUP'});
            history.push('/');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const handleSignOut = () => {
        SignOut();
    }

    const lessonRegEx = RegExp(/^\/lesson\/?.*/);

    if ( lessonRegEx.test(location.pathname) ) { return null }

    return (
        <div className={`w-full h-12 ${theme.toolbar.bg} text-gray-200 shadow-2 flex justify-center md:justify-between`}>
            <div className={`icon h-full text-2xl font-bold`}>
                <NavLink to="/dashboard">
                    <img className="h-8 pl-4 pr-3" src="media/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`hidden md:block md:flex w-48`}>
                <button className={`w-24 h-full flex justify-center items-center text-lg py-2`} onClick={lightSwitch}>
                    Lights
                </button>
                {   
                    state.isAuthenticated ? 
                    <button className={`w-24 h-full flex justify-center items-center text-lg py-2`} onClick={handleSignOut}>
                        Log Out
                    </button>
                    : null
                }
            </div>
        </div>
    )
}

export default PageHeaderBar;