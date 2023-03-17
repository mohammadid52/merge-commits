import {Tag} from 'antd';

interface LocationBadgeProps {
  onDemand: boolean;
  customText?: string;
  style?: any;
}

const LocationBadge = ({onDemand, customText, style}: LocationBadgeProps) => {
  return (
    <Tag color={onDemand ? 'yellow' : 'blue'}>
      {customText ? customText : onDemand ? 'Self Paced' : 'Classroom'}
    </Tag>
  );
};

export default LocationBadge;
