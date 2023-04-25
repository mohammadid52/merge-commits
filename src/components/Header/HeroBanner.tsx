import React from 'react';

interface HeroBannerProps {
  imgUrl: string;
  title?: string;
  transition?: boolean;
}

const HeroBanner = (props: HeroBannerProps) => {
  const {imgUrl, title = 'Unit', transition = true} = props;

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-40 2xl:h-60">
        <div className=" bg-black bg-opacity-60 z-0 w-full h-full absolute" />
        <img
          className="object-cover w-full h-full bg-center bg-no-repeat bg-contain"
          src={imgUrl}
          alt=""
        />
      </div>
      <div className="relative h-full flex items-center justify-center flex-col max-w-7xl">
        <div
          className={`z-0 flex flex-col align-center self-auto items-center justify-center h-40 2xl:h-60 tracking-tight text-center text-white text-3xl 2xl:text-4xl ${
            transition ? 'fade__animation' : ''
          }`}>
          <h1 className="tracking-wide font-bold opacity-90">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
