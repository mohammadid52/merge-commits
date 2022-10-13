import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type UserLocationProps = {
  role: 'ADM' | 'SUP' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';
  onDemand: boolean;
};

const UserLocation = ({role, onDemand}: UserLocationProps) => {
  if (role === 'ST') {
    return <div>{onDemand ? 'Self Paced' : 'Classroom'}</div>;
  } else {
    return <div>Staff</div>;
  }
};
// test
export default UserLocation;
