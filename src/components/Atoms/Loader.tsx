import {getJSON} from '@utilities/functions';
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

  return withText ? (
    <div
      className={`flex ${className} ${
        animation ? 'flex-col' : ''
      } items-center mr-2 w-auto`}>
      {animation ? (
        <Animation />
      ) : (
        <div className={`animate-spin w-auto mr-2`}>
          <VscLoading size={size} className={className} color={color} />
        </div>
      )}
      {withText}
    </div>
  ) : (
    <div
      className={`flex ${className} ${animation ? 'flex-col' : ''} items-center w-auto`}>
      {animation ? (
        <Animation />
      ) : (
        <div className={`animate-spin ${className}`}>
          <VscLoading size={size} className={className} color={color} />
        </div>
      )}
    </div>
  );
};

export default Loader;
