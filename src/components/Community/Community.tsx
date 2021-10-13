import HeroBanner from '@components/Header/HeroBanner';
import {GlobalContext} from '@contexts/GlobalContext';
import {getAsset} from 'assets';
import React, {useContext} from 'react';

const Community = () => {
  const {clientKey} = useContext(GlobalContext);

  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner1');

  return (
    <div>
      <div>
        <HeroBanner imgUrl={dashboardBanner1} title={'Community'} />
      </div>
      <div
        className={`w-full lg:max-w-192 md:max-w-none 2xl:max-w-256 mx-auto z-10 flex flex-col justify-between  items-center -mt-4 2xl:-mt-6 mb-4 px-6 py-1 2xl:py-4 m-auto relative iconoclast:bg-main curate:bg-main text-white rounded`}>
        <h2 className={`text-sm 2xl:text-base text-center font-normal`}>
          Here is what is happening today
        </h2>
      </div>
    </div>
  );
};

export default Community;
