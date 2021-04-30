import React from 'react';

interface StatusProps {
  status: 'Active' | 'Inactive' | 'Dropped';
}

const Status = ({status}: StatusProps) => {
  const capitalizedStatus = status?.toUpperCase();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium  w-auto ${
        capitalizedStatus === 'INACTIVE'
          ? 'bg-yellow-100 text-yellow-800'
          : capitalizedStatus === 'DROPPED'
          ? 'bg-red-100 text-red-800'
          : capitalizedStatus === 'ACTIVE'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
      {status}
    </span>
  );
};

export default Status;
