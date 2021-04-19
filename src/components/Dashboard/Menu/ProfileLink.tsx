import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { getImageFromS3 } from '../../../utilities/services';

import { firstInitialFunc, stringToHslColor } from '../../../utilities/strings';

import { LinkProps } from './Links';

const ProfileLink: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const { state, theme, dispatch } = useContext(GlobalContext);
  const match = useRouteMatch();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState('');

  const initials = (firstName: string, lastName: string) => {
    let firstInitial = firstName.charAt(0).toUpperCase();
    let lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  const handleLink = (e: any) => {
    linkProps.setCurrentPage('profile');
    dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'profile' } });
  };

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(state.user.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [state.user]);

  return (
    <NavLink id="profile" to={`${match.url}/profile`} onClick={handleLink}>
      <div className={`size flex flex-col text-center justify-center items-center py-4 ${theme.sidemenu.darktone}`}>
        <div className="w-8 h-8">
          {
            // state.user.image ?
            linkProps.image ? (
              <img className="w-8 h-8 rounded-full" src={imageUrl} />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex justify-center items-center text-xs text-white font-sans"
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
            )
          }
        </div>
        <div className="flex-grow w-auto flex justify-start overflow-hidden text-xs text-white font-sans tracking-wider">
          {`${state.user.firstName} ${firstInitialFunc(state.user.lastName)}`}
        </div>
      </div>
    </NavLink>
  );
};

export default ProfileLink;
