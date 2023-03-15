import {PersonStatus} from 'API';
import React from 'react';

type StatusProps = {
  status: PersonStatus;
};

const commonClass = 'w-auto inline-flex text-xs leading-5 font-medium uppercase rounded';

export const Status = ({
  children,
  style,
  className = '',
  useDefault = false,
  status
}: {
  className?: string;
  style?: any;
  children?: React.ReactNode;
  useDefault?: boolean;
  status?: string;
}) => {
  const _status = status?.toLowerCase() || 'active';

  const defaultClass = !useDefault
    ? ''
    : _status === 'active'
    ? 'bg-green-100 text-green-600'
    : _status === 'inactive'
    ? 'bg-red-100 text-red-600'
    : 'bg-yellow-100 text-yellow-600';

  return (
    <span style={style} className={`${commonClass} ${className} ${defaultClass}  px-2`}>
      {useDefault ? status || 'ACTIVE' : children}
    </span>
  );
};

const UserStatus = ({status}: StatusProps) => {
  switch (status) {
    case 'ACTIVE':
      return <Status>ACTIVE</Status>;
    case 'INACTIVE':
      return <Status className=" bg-gray-200 text-gray-600">INACTIVE</Status>;
    case 'TRAINING':
      return <Status className=" bg-gray-400 text-gray-700">TRAINING</Status>;

    case 'HOLD':
      return <Status className="bg-yellow-200 text-yellow-600">ON HOLD</Status>;
    default:
      return null;
  }
};

export default UserStatus;
