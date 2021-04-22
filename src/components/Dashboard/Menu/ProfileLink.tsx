import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { GlobalContext } from '../../../contexts/GlobalContext';
import { getImageFromS3 } from '../../../utilities/services';
import { getUserRoleString } from '../../../utilities/strings';
import { stringToHslColor } from '../../../utilities/strings';
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
    history.push(`${match.url}/profile`);
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
    <div
      onClick={handleLink}
      className="flex-shrink-0 flex border-t sidenav_profile cursor-pointer border-gray-200 p-4">
      <a className="flex-shrink-0 w-full group block">
        <div className="flex items-center">
          <div style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }} className="">
            {state.user.image ? (
              <img className="inline-block rounded" style={{ width: 48, height: 48 }} src={imageUrl} alt="" />
            ) : (
              <div
                style={{
                  background: `${
                    state.user.firstName
                      ? stringToHslColor(state.user.firstName + ' ' + state.user.lastName)
                      : '#272730'
                  }`,
                  textShadow: '0.1rem 0.1rem 2px #423939b3',
                }}
                className="rounded flex justify-center items-center text-xs text-white font-sans">
                {`${initials(state.user.firstName, state.user.lastName)}`}
              </div>
            )}
          </div>
          <div className="ml-3 flex items-start w-auto flex-col">
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">{`${state.user.firstName} ${state.user.lastName}`}</p>
            <div className="flex items-center justify-center px-1.5 py-0.5 bg-gray-600 rounded mt-0.5 w-auto">
              <p className="text-xs font-regular text-gray-300  group-hover:text-gray-300">
                {getUserRoleString(state.user.role)}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
    // <NavLink id="profile" to={} onClick={handleLink}>
    //   <div className={`size flex flex-col text-center justify-center items-center py-4 ${theme.sidemenu.darktone}`}>
    //     <div className="w-8 h-8">
    //       {
    //         // state.user.image ?
    //         linkProps.image ? (
    //           <img className="w-8 h-8 rounded-full" src={imageUrl} />
    //         ) : (
    //           <div
    //             className="w-8 h-8 rounded-full flex justify-center items-center text-xs text-white font-sans"
    //             style={{
    //               background: `${
    //                 state.user.firstName
    //                   ? stringToHslColor(state.user.firstName + ' ' + state.user.lastName)
    //                   : '#272730'
    //               }`,
    //               textShadow: '0.1rem 0.1rem 2px #423939b3',
    //             }}>
    //             {`${initials(state.user.firstName, state.user.lastName)}`}
    //           </div>
    //         )
    //       }
    //     </div>
    //     <div className="flex-grow w-auto flex justify-start overflow-hidden text-xs text-white font-sans tracking-wider">
    //       {`${state.user.firstName} ${firstInitialFunc(state.user.lastName)}`}
    //     </div>
    //   </div>
    // </NavLink>
  );
};

export default ProfileLink;
