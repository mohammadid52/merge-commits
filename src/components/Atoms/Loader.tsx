import {getJSON} from '@utilities/functions';
import {Spin} from 'antd';
import {ANIMATIONS} from 'assets';
import Lottie from 'lottie-react';
import React, {useEffect, useState} from 'react';
import {VscLoading} from 'react-icons/vsc';

interface LoadingProps {
  size?: string;
  color?: string;
  className?: string;
  withText?: string;
  animation?: boolean;
}

const Animation = () => {
  const [json, setJson] = useState<string | null>(null);
  useEffect(() => {
    getJSON(ANIMATIONS.loading).then((data) => {
      setJson(data);
    });
  }, []);
  if (json) {
    return <Lottie style={{height: 100, width: 100}} animationData={json} />;
  }
  return null;
};

const Loader: React.FC<LoadingProps> = (loadingProps: LoadingProps) => {
  const {
    className = 'text-gray-500',
    color = '#000000',
    size = '1.5rem',
    animation,
    withText = false
  } = loadingProps;

  return <Spin tip={withText}></Spin>;
};

export default Loader;
