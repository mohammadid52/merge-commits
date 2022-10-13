import React from 'react';

interface LocationBadgeProps {
  onDemand: boolean;
}

const LocationBadge = ({onDemand}: LocationBadgeProps) => {
  return (
    <span
      className={`w-auto inline-flex text-xs leading-5 font-semibold uppercase rounded  px-2 ${
        onDemand ? 'bg-yellow-200 text-yellow-600' : 'bg-blue-200 text-blue-600'
      }`}>
      {onDemand ? 'Self Paced' : 'Classroom'}
    </span>
  );
};

export default LocationBadge;
