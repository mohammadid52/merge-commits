import React, {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import {useCookies} from 'react-cookie';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {Auth} from '@aws-amplify/auth';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customMutations from 'customGraphql/customMutations';
import {FiLogOut} from 'react-icons/all';
import {removeLocalStorageData} from 'utilities/localStorage';

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
        lastLoggedOut: new Date().toISOString()
      };
      API.graphql(graphqlOperation(customMutations.updatePersonLogoutTime, {input}));
      await Auth.signOut();
      updateAuthState(false);
      removeCookie('auth', {path: '/'});
      sessionStorage.removeItem('accessToken');
      removeLocalStorageData('active_step_section');
      removeLocalStorageData('selected_institution');
      dispatch({type: 'CLEANUP'});
    } catch (error) {
      console.error('error signing out: ', error);
    }
  }

  const handleSignOut = () => {
    SignOut();
  };

  return (
    <>
      {state.isAuthenticated ? (
        <div
          data-cy="logout-button"
          onClick={handleSignOut}
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
