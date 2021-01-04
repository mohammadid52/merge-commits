import React from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { VscLoading } from 'react-icons/vsc';

interface LoadingProps {

}

const Loader: React.FC<LoadingProps> = (loadingProps: LoadingProps) => {
  const { } = loadingProps
  return (
    <div className="animate-spin">
      <IconContext.Provider value={{ size: '1.5rem', color: '#000000' }}>
        <VscLoading />
      </IconContext.Provider>
    </div>
  )
}

export default Loader