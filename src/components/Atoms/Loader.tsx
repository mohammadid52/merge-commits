import {Spin} from 'antd';
import React from 'react';

interface LoadingProps {
  size?: string;
  color?: string;
  className?: string;
  withText?: string;
  animation?: boolean;
}

const Loader: React.FC<LoadingProps> = (loadingProps: LoadingProps) => {
  const {withText = false} = loadingProps;

  return <Spin tip={withText}></Spin>;
};

export default Loader;
