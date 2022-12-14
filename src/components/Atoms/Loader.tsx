import React, {useEffect, useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {VscLoading} from 'react-icons/vsc';
import Lottie from 'lottie-react';
import {ANIMATIONS} from 'assets';
import {getJSON} from '@utilities/functions';

interface LoadingProps {
  size?: string;
  color?: string;
  className?: string;
  withText?: string;
  animation?: boolean;
}

const Loader: React.FC<LoadingProps> = (loadingProps: LoadingProps) => {
  const {
    className = '',
    color = '#000000',
    size = '1.5rem',
    animation,
    withText = false
  } = loadingProps;

  const Animation = () => {
    const [json, setJson] = useState(null);
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

  return withText ? (
    <div
      className={`flex ${className} ${
        animation ? 'flex-col' : ''
      } items-center mr-2 w-auto`}>
      {animation ? (
        <Animation />
      ) : (
        <div className={`animate-spin w-auto mr-2`}>
          <IconContext.Provider value={{size, color: className || color}}>
            <VscLoading />
          </IconContext.Provider>
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
          <IconContext.Provider value={{size, color: className || color}}>
            <VscLoading />
          </IconContext.Provider>
        </div>
      )}
    </div>
  );
};

export default Loader;
