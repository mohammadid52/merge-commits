import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import { LinkProps } from '../Dashboard/Menu/Links';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineLogout } from 'react-icons/ai';

import { Auth } from '@aws-amplify/auth';
import useDictionary from '../../customHooks/dictionary';

const PageHeaderBar: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const [cookies, , removeCookie] = useCookies();
  const { appDict } = useDictionary()
  const location = useLocation();
  const history = useHistory();
  const { theme, lightSwitch, forceTheme, userLanguage, state, dispatch } = useContext(GlobalContext);

  async function SignOut() {
    try {
      await Auth.signOut();
      linkProps.updateAuthState(false)
      removeCookie('auth', { path: '/' });
      sessionStorage.removeItem('accessToken');
      dispatch({ type: 'CLEANUP' });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const handleSignOut = () => {
    SignOut();
  };

  const handleLink = (e: any) => {
    const id = e.target.id.toLowerCase();

    linkProps.setCurrentPage(id);
  };

  return (
    <div
      className={`z-40 fixed right-0 w-full h-12 min-h-12 ${theme.dashboard.bg} text-gray-200 flex justify-center md:justify-end`}>
      <div
        className={`w-full md:hidden h-full md:h-12 ${theme.dashboard.bg} flex justify-center items-center text-2xl font-bold z-50 ml-4`}>
        <NavLink to='/dashboard' id='dashboard' onClick={handleLink}>
          <img
            id='dashboard'
            className='h-6'
            onClick={handleLink}
            src='https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg'
            alt='Iconoclast Artists'
          />
        </NavLink>
      </div>
      {/* <div className={`hidden md:block md:flex w-48`}>
                <button className={`w-24 h-full flex justify-center items-center text-lg py-2`} onClick={lightSwitch}></button> */}

      <div className={`w-full md:w-32 h-12 md:flex flex-row justify-end bg-darker-gray`}>
        {/* <button className={`h-full flex justify-center items-center text-lg py-2`} onClick={lightSwitch}>
                    Lights
                </button> */}
        {state.isAuthenticated ? (
          <div className={`h-full text-sm flex align-center justify-center ${theme.sidemenu.bg}`} onClick={handleSignOut}>
            <span className='relative mr-1 w-auto h-full flex items-center justify-center'>
              <IconContext.Provider value={{ size: '1.25rem', className: 'self-center' }}>
                <AiOutlineLogout />
              </IconContext.Provider>
            </span>
            <span className={`relative mr-1 w-auto h-full flex items-center justify-center`}>
              <button className="align-middle self-center mb-1">{appDict[userLanguage]['LOG_OUT']}</button>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeaderBar;
