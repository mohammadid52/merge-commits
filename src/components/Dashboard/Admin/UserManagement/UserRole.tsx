import {getUserRoleString} from '@utilities/strings';
import {Role} from 'API';
import React from 'react';
import {Status} from './UserStatus';

// type Role = 'ADM' | 'BLD' | 'FLW' |  'TR' | 'ST';

type RoleProps = {
  role: Role | string;
};

const UserRole = ({role}: RoleProps) => {
  return (
    <Status className={'bg-gray-200 text-gray-600'}>{getUserRoleString(role)}</Status>
  );
};

export default UserRole;
