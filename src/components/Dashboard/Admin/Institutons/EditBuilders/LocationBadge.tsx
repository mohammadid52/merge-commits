import React from 'react';
import {Status} from '../../UserManagement/UserStatus';

interface LocationBadgeProps {
  onDemand: boolean;
}

const LocationBadge = ({onDemand}: LocationBadgeProps) => {
  return (
    <Status
      className={
        onDemand ? 'bg-yellow-200 text-yellow-600' : 'bg-blue-200 text-blue-600'
      }>
      {onDemand ? 'Self Paced' : 'Classroom'}
    </Status>
  );
};

export default LocationBadge;
