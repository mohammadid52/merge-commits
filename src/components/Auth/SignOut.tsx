import React, {useContext} from 'react';
import {GlobalContext} from '../../contexts/GlobalContext';
import {useCookies} from 'react-cookie';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {Auth} from '@aws-amplify/auth';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customMutations from '../../customGraphql/customMutations';
import {FiLogOut} from 'react-icons/all';

interface SignOutButtonProps {
  updateAuthState: Function;
}

const SignOutButton = (props: SignOutButtonProps) => {
  const {updateAuthState} = props;
  const [cookies, , removeCookie] = useCookies();
  const {theme, state, dispatch} = useContext(GlobalContext);

  async function SignOut() {
    try {
      const input = {
        id: state.user.id,
        authId: state.user.authId,
        email: state.user.email,
        lastLoggedOut: new Date().toISOString(),
      };
      API.graphql(graphqlOperation(customMutations.updatePersonLogoutTime, {input}));
      await Auth.signOut();
      updateAuthState(false);
      removeCookie('auth', {path: '/'});
      sessionStorage.removeItem('accessToken');
      dispatch({type: 'CLEANUP'});
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const handleSignOut = () => {
    SignOut();
  };

  return (
    <>
      {state.isAuthenticated ? (
        <div
          onClick={handleSignOut}
          className="flex-shrink-0 bg-gray-700 flex border-t border-gray-200 p-4">
          <a href="#" className="flex-shrink-0 group block">
            <div className="flex items-center">
              <IconContext.Provider
                value={{
                  size: '24px',
                  className: 'text-white w-auto mr-1',
                  style: {cursor: 'pointer'},
                }}>
                <FiLogOut />
              </IconContext.Provider>
              <p className="text-sm ml-2 font-medium text-gray-300">Logout</p>
            </div>
          </a>
        </div>
      ) : null}
    </>
  );
};

export default SignOutButton;
