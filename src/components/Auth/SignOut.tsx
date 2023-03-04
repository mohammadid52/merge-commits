import useAuth from '@customHooks/useAuth';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';
import {FiLogOut} from 'react-icons/all';
import {IconContext} from 'react-icons/lib/esm/iconContext';

const SignOutButton = () => {
  const {state} = useGlobalContext();

  const {signOut} = useAuth();

  return (
    <>
      {state.isAuthenticated ? (
        <div
          data-cy="logout-button"
          onClick={signOut}
          className="flex-shrink-0 mt-2 flex border-t p-2 px-4 hover:iconoclast:bg-400 hover:curate:bg-400 hover:text-white rounded-full mb-2">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <IconContext.Provider
                value={{
                  size: '24px',
                  className: 'w-auto mr-1'
                }}>
                <FiLogOut className="cursor-pointer" />
              </IconContext.Provider>
              <p className="text-sm ml-2 font-medium">Logout</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SignOutButton;
