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
      <div className="absolute inset-0 w-full h-32 2xl:h-60">
        <div className=" bg-black bg-opacity-60 z-0 w-full h-full absolute" />
        <img
          className="object-cover w-full h-full bg-center bg-no-repeat bg-contain"
          src={imgUrl}
          alt=""
        />
      </div>
      <div className="relative h-full flex items-center justify-center flex-col max-w-7xl">
        <h1
          // style={{fontSize: '6rem'}}
          className={`z-10 flex align-center self-auto items-center justify-center h-32 2xl:h-60 font-extrabold tracking-tight text-center text-white text-2xl 2xl:text-6xl pb-8 2xl:pb-6 ${
            transition ? 'fade__animation' : ''
          }`}>
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeroBanner;
