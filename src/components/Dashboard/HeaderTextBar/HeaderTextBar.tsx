import {ReactNode} from 'react';

const HeaderTextBar = ({children}: {children: ReactNode}) => {
  return (
    <div
      className={`header-text-bar w-full max-w-88 lg:max-w-192 md:max-w-128 2xl:max-w-256 mx-auto   flex flex-col justify-between  items-center -mt-4 2xl:-mt-6 mb-4 px-6 2xl:py-4 m-auto relative  rounded-lg py-2 bg-gray-200 border-2 border-white theme-bg text-white theme-card-shadow`}>
      <h2 className={`mb-0 text-sm 2xl:text-base text-center relative font-normal`}>
        {children}
      </h2>
    </div>
  );
};

export default HeaderTextBar;
