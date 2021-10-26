import React, {useEffect, useRef} from 'react';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import {AiOutlineVideoCamera} from 'react-icons/ai';
import ButtonsRound from '@components/Atoms/ButtonsRound';
import {gsap} from 'gsap/all';

const SideMenu = ({
  videoLink,
  handleVideoLinkPopup,
  videoLinkModalVisible,
}: LessonHeaderBarProps) => {
  const buttonContainerRef = useRef();

  const handleClickAnimation = () => {
    gsap.fromTo(
      buttonContainerRef.current,
      {scaleX: 0.8, scaleY: 0.8},
      {scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)'}
    );
    handleVideoLinkPopup();
  };

  useEffect(() => {
    const appearAnimation = gsap.fromTo(
      buttonContainerRef.current,
      {scaleX: 0.8, scaleY: 0.8},
      {scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)'}
    );
    return () => {
      appearAnimation.kill();
    };
  }, [videoLink]);

  // @ts-ignore
  return (
    <>
      <div
        ref={buttonContainerRef}
        className={`absolute w-16 left-1 transform translate-y-4 flex flex-col`}>
        <ButtonsRound
          onClick={videoLink ? () => handleClickAnimation : () => {}}
          Icon={AiOutlineVideoCamera}
          iconSizePX={24}
          buttonWHClass={`w-8 h-8`}
          containerBgClass={`${
            videoLink
              ? videoLinkModalVisible
                ? 'bg-white bg-opacity-70'
                : 'bg-white'
              : 'bg-gray-700 bg-opacity-40 pointer-events-none'
          } p-2 rounded-full`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`${
            videoLink
              ? videoLinkModalVisible
                ? 'text-green-700'
                : 'text-green-500'
              : 'text-gray-900'
          }`}
          disabled={!videoLink}
        />
        <p
          className={
            videoLink
              ? 'w-12 text-xs text-center text-white'
              : 'w-12 text-xs text-center text-gray-600'
          }>
          Video
        </p>
      </div>
    </>
  );
};

export default SideMenu;
