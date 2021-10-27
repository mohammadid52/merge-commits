import {GlobalContext} from '@contexts/GlobalContext';
import React, {useContext} from 'react';

interface HeroBannerProps {
  imgUrl: string;
  title?: string;
  transition?: boolean;
}

const HeroBanner = (props: HeroBannerProps) => {
  const {imgUrl, title = 'Unit', transition = true} = props;
  const gContext = useContext(GlobalContext);
  const stateUser = gContext.state.user;

  const isOnDemandStudent = stateUser?.onDemand == true;

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-32 2xl:h-60">
        <div className=" bg-black bg-opacity-60 z-0 w-full h-full absolute" />
        <img
          className="object-cover w-full h-full bg-center bg-no-repeat bg-contain"
          src={imgUrl}
          alt=""
        />
      </div>
      <div className="relative h-full flex items-center justify-center flex-col max-w-7xl">
        <div
          className={`z-10 flex flex-col align-center self-auto items-center justify-center h-32 2xl:h-60 font-extrabold tracking-tight text-center text-white text-2xl 2xl:text-6xl pb-8 2xl:pb-6 ${
            transition ? 'fade__animation' : ''
          }`}>
          <h1>{title}</h1>
          {isOnDemandStudent && (
            <div className="flex justify-center">
              <h3 className="w-auto h-auto px-6 py-1 rounded bg-yellow-400 bg-opacity-60 text-white text-sm 2xl:text-base text-center font-normal">
                On-Demand
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
