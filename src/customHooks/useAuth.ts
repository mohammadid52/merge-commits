import {useGlobalContext} from '@contexts/GlobalContext';

const useAuth = (): {
  role: any;
  isStudent: boolean;
  isTeacher: boolean;
  isBuilder: boolean;
  isAdmin: boolean;
  isFellow: boolean;
  authId: any;
  email: any;
  firstName: any;
  lastName: any;
  image: any;
} => {
  const context = useGlobalContext();

  const user = context.state.user;
  const {authId, role, email, firstName, lastName, image} = user;

  const isStudent = role === 'ST';
  const isTeacher = role === 'TR';
  const isBuilder = role === 'BLD';
  const isAdmin = role === 'ADM';
  const isFellow = role === 'FLW';

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
    lastName,
    image,
  };
};

export default useAuth;
