import React, {ReactNode} from 'react';

const HeaderTextBar = ({children}: {children: ReactNode}) => {
  return (
    <div
      className={`w-full lg:max-w-192 md:max-w-none 2xl:max-w-256 mx-auto z-10 flex flex-col justify-between  items-center -mt-4 2xl:-mt-6 mb-4 px-6 py-1 2xl:py-4 m-auto relative
    iconoclast:bg-main curate:bg-main text-white max-w-88 rounded`}>
      <h2 className={`text-sm 2xl:text-base text-center relative font-normal`}>
        {children}
      </h2>
    </div>
  );
};

export default HeaderTextBar;
