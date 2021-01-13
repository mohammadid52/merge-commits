import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useCookies } from 'react-cookie';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../customGraphql/customMutations';
import { FiLogOut } from 'react-icons/all';

interface SignOutButtonProps {
  updateAuthState: Function;
}

const SignOutButton = (props: SignOutButtonProps) => {
  const { updateAuthState } = props;
  const [cookies, , removeCookie] = useCookies();
  const { theme, state, dispatch } = useContext(GlobalContext);

  async function SignOut() {
    try {
      const input = {
        id: state.user.id,
        authId: state.user.authId,
        email: state.user.email,
        lastLoggedOut: new Date().toISOString(),
      };
      API.graphql(graphqlOperation(customMutations.updatePersonLogoutTime, { input }));
      await Auth.signOut();
      updateAuthState(false);
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

  return (
    <>
      {state.isAuthenticated ? (
        <div className="w-full text-xs text-center" onClick={handleSignOut}>
          <IconContext.Provider value={{ size: '24px', className: 'self-center', style: { cursor: 'pointer' } }}>
            <FiLogOut />
          </IconContext.Provider>
          Logout
        </div>
      ) : null}
    </>
  );
};

export default SignOutButton;
