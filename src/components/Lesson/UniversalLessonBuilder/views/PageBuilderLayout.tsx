import {Button, Drawer, Space} from 'antd';
import React from 'react';

const PageBuilderLayout = ({
  children,
  open,
  setOpen,
  width = 400,
  title
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  style?: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  overflowHidden?: boolean;
  rounded?: string;
  width?: number | string;
  dark?: boolean;
}) => {
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      title={title}
      width={width}
      onClose={onClose}
      open={open}
      bodyStyle={{paddingBottom: 80}}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} type="primary">
            Submit
          </Button>
        </Space>
      }>
      {children}
    </Drawer>
  );
};

export default PageBuilderLayout;
