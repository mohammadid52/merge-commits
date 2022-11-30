import Buttons from '@components/Atoms/Buttons';
import {getAsset} from 'assets';
import ButtonsRound from 'atoms/ButtonsRound';
import usePrevious from 'customHooks/previousProps';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {gsap} from 'gsap/all';
import React, {useEffect, useRef, useState} from 'react';
import {AiFillEye, AiOutlineCloseCircle, AiOutlineMenu} from 'react-icons/ai';
import {BiCloudDownload} from 'react-icons/bi';
import LessonDetails from '../TopMenu/LessonDetails';
interface IRosterFrame {
  children?: React.ReactNode;
  fullscreen?: boolean;
  theme?: any;
  clientKey?: string;
  rightView?: {view: string; option?: string};
  setRightView?: any;
}

const RosterFrame = ({
  children,
  fullscreen,
  theme,
  clientKey,
  rightView,
  setRightView
}: IRosterFrame) => {
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [miniOut, setMiniOut] = useState<boolean>(false);
  // ~~~~~~~~~ LIVE VIEW ANIMATION ~~~~~~~~~ //
  const frameRef = useRef();
  const sidebarRef = useRef();
  const miniFrameRef = useRef();

  const slideOut = (refTarget: any) => {
    gsap.fromTo(refTarget.current, {x: 0}, {x: '-100%', duration: 1, ease: 'easeInOut'});
  };
  const slideIn = (refTarget: any) => {
    gsap.fromTo(refTarget.current, {x: '-100%'}, {x: 0, duration: 1, ease: 'easeInOut'});
  };

  const toggleMiniOut = () => {
    setMiniOut(!miniOut);
  };

  const previousFullscreen = usePrevious(fullscreen);

  useEffect(() => {
    if (fullscreen) {
      slideOut(frameRef);
    } else {
      if (previousFullscreen) {
        slideIn(frameRef);
      }
    }
  }, [fullscreen]);

  const previousMiniOut = usePrevious(miniOut);

  useEffect(() => {
    if (miniOut) {
      slideIn(miniFrameRef);
    } else {
      if (previousMiniOut === true) {
        slideOut(miniFrameRef);
      }
    }
  }, [miniOut]);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //
  const {breakpoint} = useTailwindBreakpoint();

  const handleToggleRightView = (rightViewObj: {view: string; option: string}) => {
    let toggleValue =
      rightView.view === rightViewObj.view
        ? {...rightViewObj, view: 'lesson'}
        : {...rightViewObj, view: rightViewObj.view};
    setRightView(toggleValue);
  };

  return (
    <>
      {/* FULL ROSTER */}
      <div
        ref={frameRef}
        className={`absolute bg-white w-full h-full lg:w-2.5/10 max-w-128 flex flex-col items-center z-100`}
        style={{display: breakpoint === 'xl' || breakpoint === '2xl' ? 'block' : 'none'}}>
        {/* <LessonInfoTitleBar /> */}

        <LessonDetails
          rightView={rightView}
          hidden={breakpoint !== 'xl' && breakpoint !== '2xl'}
          handleToggleRightView={handleToggleRightView}
        />
        <div className={`h-full w-full flex flex-col justify-between items-center z-100`}>
          <div className={`h-full pb-24`}>{children}</div>
        </div>
      </div>
      {/* THIN SIDEBAR */}
      <div
        ref={sidebarRef}
        onClick={() => toggleMiniOut()}
        className={`absolute bg-white h-full flex flex-col items-center border-r-0 border-gray-600 border-opacity-50 z-100`}
        style={{
          width: '36px',
          display: breakpoint === 'xl' || breakpoint === '2xl' ? 'none' : 'block'
        }}>
        <ButtonsRound
          Icon={miniOut ? AiOutlineCloseCircle : AiOutlineMenu}
          onClick={() => toggleMiniOut()}
          iconSizePX={24}
          buttonWHClass={`absolute w-8 h-8 right-0`}
          containerBgClass={`bg-transparent`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={theme.textColor[themeColor]}
        />
      </div>
      {/* SLIDE OUT ROSTER */}
      <div
        ref={miniFrameRef}
        className={`absolute bg-white flex flex-col items-center  w-full h-full lg:w-2.5/10 max-w-128 transform -translate-x-full border-r-0 border-gray-600 border-opacity-50 z-100`}
        style={{display: breakpoint === 'xl' || breakpoint === '2xl' ? 'none' : 'block'}}>
        <ButtonsRound
          Icon={miniOut ? AiOutlineCloseCircle : AiOutlineMenu}
          onClick={() => toggleMiniOut()}
          iconSizePX={24}
          buttonWHClass={`w-8 h-8 `}
          containerBgClass={`absolute right-0 bg-transparent`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={theme.textColor[themeColor]}
        />
        <LessonDetails />

        <div className={`h-full w-full flex flex-col justify-between items-center`}>
          <div className={`h-full pb-24`}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default RosterFrame;
