import {Alert} from 'antd';
import React from 'react';

const SuccessMessage = (props: {note: string}) => {
  const {note} = props;

  return (
    ///change INFO, MARGIN and WIDTH if needed
    <Alert message={note} type="success" />
  );
};

export default SuccessMessage;
