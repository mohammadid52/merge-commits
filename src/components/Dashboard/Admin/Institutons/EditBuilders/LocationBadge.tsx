import React from 'react';
import {Status} from '../../UserManagement/UserStatus';

interface LocationBadgeProps {
  onDemand: boolean;
  customText?: string;
  style?: any;
}

const LocationBadge = ({onDemand, customText, style}: LocationBadgeProps) => {
  return (
    <Status
      style={style}
      className={
        onDemand ? 'bg-yellow-200 text-yellow-600' : 'bg-blue-200 text-blue-600'
      }>
      {customText ? customText : onDemand ? 'Self Paced' : 'Classroom'}
    </Status>
  );
};

export default LocationBadge;
