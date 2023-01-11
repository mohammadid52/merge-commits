import {Role, UserPageState} from 'API';
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
  onDemand?: boolean;
  pageState: UserPageState;
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
  firstName: string;
  lastName: string;
  image: string;
  instId: string;
  user: User;
  onDemand?: boolean;
  pageState: UserPageState;
} => {
  const context = useGlobalContext();

  const user: User = context.state.user;

  const {authId, pageState, role, email, firstName, lastName, image, onDemand} = user;

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

  return {
    role,
    isStudent,
    isTeacher,
    isBuilder,
    isAdmin,
    isFellow,
    authId,
    email,
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
