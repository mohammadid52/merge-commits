import React from 'react';
import { IconContext } from 'react-icons';
import { VscFileMedia } from 'react-icons/vsc';

interface PageTileProps {
  whClass?: string;
  marginClass?: string;
}

const PageTile = (props: PageTileProps) => {
  const {whClass, marginClass} = props;

  return (
    <div className={`
    ${whClass ? whClass : 'w-24 h-32'}
    ${marginClass ? marginClass : 'mb-2'}
    relative 
    flex items-center bg-white shadow rounded`}>
      <IconContext.Provider value={{className: 'w-auto h-auto mx-auto text-gray-400', size: '24px'}}>
        <VscFileMedia/>
      </IconContext.Provider>
    </div>
  )
}

export default PageTile;