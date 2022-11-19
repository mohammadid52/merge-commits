import React from 'react';

type StatusProps = {
  status: any;
};

const commonClass = 'w-auto inline-flex text-xs leading-5 font-medium uppercase rounded';

export const Status = ({
  children,
  className = 'bg-green-200 text-green-600'
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <span className={`${commonClass} ${className}  px-2`}>{children}</span>;
};

const UserStatus = ({status}: StatusProps) => {
  switch (status) {
    case 'ACTIVE':
      return <Status>ACTIVE</Status>;
    case 'INACTIVE':
      return <Status className=" bg-gray-200 text-gray-600">INACTIVE</Status>;
    case 'TRAINING':
      return <Status className=" bg-gray-400 text-gray-700">TRAINING</Status>;
    case 'SUSPENDED':
      return <Status className=" bg-red-200 text-red-600">SUSPENDED</Status>;
    case 'HOLD':
      return <Status className="bg-yellow-200 text-yellow-600">ON HOLD</Status>;
    default:
      return null;
  }
};

export default UserStatus;
