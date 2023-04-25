import {Form, Switch} from 'antd';
import React from 'react';

const ToggleForModal = ({
  checked,
  onClick,
  label
}: {
  label: string;
  checked: boolean;
  onClick: any;
}) => {
  return (
    <Form.Item style={{margin: 0}} label={label} valuePropName="checked">
      <Switch checked={checked} onClick={onClick} />
    </Form.Item>
  );
};

export default ToggleForModal;
