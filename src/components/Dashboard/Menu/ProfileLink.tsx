import React, { useContext } from 'react';
import { useHistory, NavLink, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaUserCircle } from 'react-icons/fa';
import { GlobalContext } from '../../../contexts/GlobalContext';

import {LinkProps} from './Links';

const ProfileLink: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const { state } = useContext(GlobalContext);
  const match = useRouteMatch();
  const history = useHistory();

  const initials = (firstName: string, lastName: string) => {
    let firstInitial = firstName.charAt(0).toUpperCase();
    let lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  const stringToHslColor = (str: string) => {
    let hash = 0;
    let i;
    for (i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let h = hash % 360;
    return 'hsl(' + h + ', 70%, 72%)';
  };

  const firstInitialFunc = (str: string) => {
    if (typeof str !== 'string' || str === '') {
      return 'Profile';
    }
    let firstInitial = str.charAt(0);
    firstInitial = firstInitial.toUpperCase() + '.';
    return firstInitial;
  };

  const handleLink = (e: any) => {
    const id = e.target.id.toLowerCase();
    linkProps.setCurrentPage(id);
  };

  return (
    <NavLink id='profile' to={`${match.url}/profile`} onClick={handleLink}>
      <div className='size flex flex-col text-center justify-center items-center py-4 border-b border-t border-white20'>
        <div className='w-8 h-8'>
          <div
            className='w-8 h-8 rounded-full flex justify-center items-center text-sm font-bold text-white font-sans'
            style={{
              background: `${
                state.user.firstName
                  ? stringToHslColor(state.user.firstName + ' ' + state.user.lastName)
                  : '#272730'
              }`,
              textShadow: '0.1rem 0.1rem 2px #423939b3',
            }}>
            {`${initials(state.user.firstName, state.user.lastName)}`}
          </div>
        </div>
        <div className='flex-grow w-auto flex justify-start overflow-hidden'>
          {`${state.user.firstName} ${firstInitialFunc(state.user.lastName)}`}
        </div>
      </div>
    </NavLink>
  );
};

export default ProfileLink;
