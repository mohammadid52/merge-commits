import React from 'react';
import LocationBadge from '../Institutons/EditBuilders/LocationBadge';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type UserLocationProps = {
  role: 'ADM' | 'SUP' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';
  onDemand: boolean;
};

const UserLocation = ({role, onDemand}: UserLocationProps) => {
  if (role === 'ST') {
    return <LocationBadge onDemand={onDemand} />;
  } else {
    return <div>Staff</div>;
  }
};
// test
export default UserLocation;
