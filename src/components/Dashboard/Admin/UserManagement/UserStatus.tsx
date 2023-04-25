import {Tag} from 'antd';
import {PersonStatus} from 'API';
import React from 'react';

type StatusProps = {
  status: PersonStatus;
};

export const Status = ({
  status
}: {
  className?: string;
  style?: any;
  children?: React.ReactNode;
  useDefault?: boolean;
  status?: string;
}) => {
  const _status = status?.toLowerCase() || 'active';

  return (
    <Tag
      color={_status === 'active' ? 'green' : _status === 'inactive' ? 'red' : 'yellow'}
      className="capitalize">
      {status}
    </Tag>
  );
};

const UserStatus = ({status}: StatusProps) => {
  switch (status) {
    case 'ACTIVE':
      return <Tag color="green">Active</Tag>;
    case 'INACTIVE':
      return <Tag color="red">Inactive</Tag>;
    case 'TRAINING':
      return <Tag color="yellow">Training</Tag>;

    default:
      return <Tag color="red">Inactive</Tag>;
  }
};

export default UserStatus;
