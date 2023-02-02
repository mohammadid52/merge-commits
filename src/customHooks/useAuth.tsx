import {PersonStatus, Role, UserPageState} from 'API';
import {useGlobalContext} from 'contexts/GlobalContext';

type User = {
  authId: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  associateInstitute: any[];
  removedFrom: any[];
  status?: PersonStatus;
  onDemand?: boolean;
  pageState: UserPageState;
  lastEmotionSubmission: string;
  language: string;
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
  onDemand?: boolean;
  pageState: UserPageState;
  setUser: (user: any) => void;
} => {
  const context = useGlobalContext();

  const user: User = context.state.user;
  const dispatch = context.dispatch;

  const {
    authId,
    pageState,
    role,
    email,
    firstName,
    lastName,
    language,
    image,
    onDemand
  } = user;

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

  return {
    role,
    isStudent,
    setUser,
    isTeacher,
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

    onDemand
  };
};

export default useAuth;
