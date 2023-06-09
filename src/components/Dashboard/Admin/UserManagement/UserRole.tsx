import {getUserRoleString} from '@utilities/strings';
import {Tag} from 'antd';
import {Role} from 'API';

type RoleProps = {
  role: Role | string;
};

const UserRole = ({role}: RoleProps) => {
  return (
    <Tag
      color={
        role === 'ST'
          ? 'purple'
          : role === 'ADM'
          ? 'magenta'
          : role === 'TR' || role === 'FLW'
          ? 'blue'
          : 'green'
      }>
      {getUserRoleString(role)}
    </Tag>
  );
};

export default UserRole;
