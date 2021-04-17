import React from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { VscLoading } from 'react-icons/vsc';

interface LoadingProps {
  size?: string;
  color?: string;
}

const Loader: React.FC<LoadingProps> = (loadingProps: LoadingProps) => {
  const { color = '#000000', size = '1.5rem' } = loadingProps;
  return (
    <div className="animate-spin">
      <IconContext.Provider value={{ size, color }}>
        <VscLoading />
      </IconContext.Provider>
    </div>
  );
};

export default Loader;
