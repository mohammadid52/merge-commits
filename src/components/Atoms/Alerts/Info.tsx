import {Alert} from 'antd';
import React from 'react';

export default function Info({text}: {text?: string}) {
  return <Alert message={text} type="info" showIcon />;
}

export const Warning = ({message}: {message: React.ReactNode}) => {
  return <Alert showIcon message={message} type="warning" closable />;
};

export const Error = ({message}: {message: React.ReactNode}) => {
  return <Alert description={message} type="error" showIcon />;
};
