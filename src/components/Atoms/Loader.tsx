import React from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {VscLoading} from 'react-icons/vsc';

interface LoadingProps {
  size?: string;
  color?: string;
  className?: string;
  withText?: string;
}

const Loader: React.FC<LoadingProps> = (loadingProps: LoadingProps) => {
  const {
    className = '',
    color = '#000000',
    size = 'text-2xl',
    withText = false,
  } = loadingProps;
  return withText ? (
    <div className={`flex ${className} items-center justify-center`}>
      <div className={`animate-spin w-auto mr-2`}>
        {/* <IconContext.Provider value={{size, color: className || color}}> */}
        <VscLoading className={`${className} ${size}`} />
        {/* </IconContext.Provider> */}
      </div>
      {withText}
    </div>
  ) : (
    <div className={`animate-spin ${className}`}>
      <IconContext.Provider value={{size, color: className || color}}>
        <VscLoading />
      </IconContext.Provider>
    </div>
  );
};

export default Loader;
