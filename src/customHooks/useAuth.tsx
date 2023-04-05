import {PersonStatus, Role, UserPageState} from 'API';
import {Auth} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useCookies} from 'react-cookie';
import {API, graphqlOperation} from 'aws-amplify';
import {updatePersonLogoutTime} from 'customGraphql/customMutations';
import {removeLocalStorageData} from '@utilities/localStorage';

export type User = {
  authId: string;
  id: string;

  role: Role;
  email: string;
  preferredName?: string;
  firstName: string;
  lastName: string;
  location: any[];
  image: string;
  associateInstitute: any[];
  removedFrom: any[];
  status?: PersonStatus;
  onDemand?: boolean;
  lastLoggedIn: string;
  lastLoggedOut: string;
  pageState: UserPageState;
  lastEmotionSubmission: string;
  lastPageStateUpdate?: string;
  language: 'EN' | 'ES';
};

const useAuth = (): {
  role: Role;
  isStudent: boolean;
  isTeacher: boolean;
  isBuilder: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isFellow: boolean;
  authId: string;
  email: string;
  language: string;
  firstName: string;
  lastName: string;
  image: string;
  instId: string;
  user: User;
  onDemand: boolean;
  pageState: UserPageState;

  setUser: (user: any) => void;
  authenticate: () => void;
  signOut: () => void;
  removeAuthToken: () => void;
} => {
  const context = useGlobalContext();

  const user = context.state.user;
  const {updateAuthState} = context;
  const dispatch = context.dispatch;

  const {authId, pageState, role, email, firstName, lastName, language, image, onDemand} =
    user;

  const isStudent = role === 'ST';
  const isTeacher = role === 'TR';
  const isBuilder = role === 'BLD';
  const isAdmin = role === 'ADM';
  const isSuperAdmin = role === 'SUP';
  const isFellow = role === 'FLW';
  const instId =
    (user &&
      user?.associateInstitute?.length > 0 &&
      user?.associateInstitute[0]?.institution?.id) ||
    '';

  const setUser = (updatedUserInfo: any) =>
    dispatch({
      type: 'SET_USER',
      payload: {
        ...user,
        ...updatedUserInfo
      }
    });

  const [, , removeCookie] = useCookies();

  const authenticate = () => {
    dispatch({type: 'AUTHENTICATE', payload: {}});
  };

  const removeAuthToken = () => {
    console.log('Removing cookies since not logged in');
    updateAuthState(false);
    removeCookie('auth', {path: '/'});
    sessionStorage.removeItem('accessToken');
    removeLocalStorageData('active_step_section');
    removeLocalStorageData('selected_institution');
    dispatch({type: 'CLEANUP'});
  };

  async function signOut() {
    try {
      const time = new Date().toISOString();

      const input = {
        id: user.id,
        authId: user.authId,
        email: user.email,
        lastLoggedOut: time,
        lastPageStateUpdate: time,
        pageState: UserPageState.NOT_LOGGED_IN
      };
      await API.graphql(graphqlOperation(updatePersonLogoutTime, {input}));
      await Auth.signOut();

      removeAuthToken();
    } catch (error) {
      console.error('error signing out: ', error);
    }
  }

  return {
    role,
    isStudent,
    setUser,
    authenticate,
    signOut,
    removeAuthToken,
    isTeacher: isTeacher || isFellow,
    isBuilder,
    isAdmin,
    isFellow,
    authId,
    email,
    language,
    firstName,
    pageState,
    lastName,
    image,
    instId,
    isSuperAdmin,
    user,

    onDemand: Boolean(onDemand)
  };
};

export default useAuth;
