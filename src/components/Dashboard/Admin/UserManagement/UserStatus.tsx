import React from 'react';

type StatusProps = {
  status: any;
};

const UserStatus = ({status}: StatusProps) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="w-auto inline-flex text-xs leading-5 font-semibold uppercase rounded bg-green-200 text-green-600 px-2">
          ACTIVE
        </span>
      );
    case 'INACTIVE':
      return (
        <span className="w-auto inline-flex text-xs leading-5 font-semibold uppercase rounded bg-gray-200 text-gray-600 px-2">
          INACTIVE
        </span>
      );
    case 'TRAINING':
      return (
        <span className="w-auto inline-flex text-xs leading-5 font-semibold uppercase rounded bg-gray-400 text-gray-700 px-2">
          TRAINING
        </span>
      );
    case 'SUSPENDED':
      return (
        <span className="w-auto inline-flex text-xs leading-5 font-semibold uppercase rounded bg-red-200 text-red-600 px-2">
          SUSPENDED
        </span>
      );
    case 'HOLD':
      return (
        <span className="w-auto inline-flex text-xs leading-5 font-semibold uppercase rounded bg-yellow-200 text-yellow-600 px-2">
          ON HOLD
        </span>
      );
    default:
      return null;
  }
};

export default UserStatus;
