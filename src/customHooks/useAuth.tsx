import {useGlobalContext} from 'contexts/GlobalContext';
import {getInitialsFromString, initials, stringToHslColor} from 'utilities/strings';
import React from 'react';
import {Role} from 'API';

type User = {
  authId: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  associateInstitute: any[];
  onDemand?: boolean;
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
  Placeholder: any;
  onDemand?: boolean;
} => {
  const context = useGlobalContext();

  const user: User = context.state.user;

  const {authId, role, email, firstName, lastName, image, onDemand} = user;

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

  const Placeholder = ({
    name,
    size = 'w-10 h-10 md:w-12 md:h-12',
    textSize = 'text-2xl'
  }: {
    name?: string;
    textSize?: string;
    size?: string;
  }) => {
    const [firstName, lastName] = getInitialsFromString(
      name || `${user.firstName} ${user.lastName}`
    );
    return (
      <div
        className={`${size} flex flex-shrink-0 justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light cursor-pointer`}>
        <div
          className={`h-full w-full flex justify-center items-center ${textSize} text-extrabold text-white rounded-full`}
          style={{
            /*  stylelint-disable */
            background: `${
              firstName ? stringToHslColor(firstName + ' ' + lastName) : null
            }`,
            textShadow: '0.2rem 0.2rem 3px #423939b3'
          }}>
          {firstName && initials(firstName, lastName)}
        </div>
      </div>
    );
  };

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
    instId,
    isSuperAdmin,
    user,
    Placeholder,
    onDemand
  };
};

export default useAuth;
