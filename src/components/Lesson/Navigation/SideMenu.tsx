import {GlobalContext} from '@contexts/GlobalContext';
import React, {useContext, useEffect, useRef} from 'react';
import {IconContext} from 'react-icons';
import {
  AiOutlineArrowLeft,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineSave,
  AiOutlineVideoCamera,
} from 'react-icons/ai';
import {useHistory} from 'react-router';

import {gsap} from 'gsap/all';
import usePrevious from '@customHooks/previousProps';
import {getAsset} from 'assets';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {ISideMenuProps} from '@interfaces/LessonComponentsInterfaces';

const SideMenu = ({
  isOpen,
  overlay,
  setOverlay,
  videoLink,
  handleVideoLinkPopup,
  videoLinkModalVisible,
  handleBack,
  handleForward,
  handlePopup,
  isAtEnd,
  setisAtEnd,
  handleRequiredNotification,
  pages,
  canContinue,
}: ISideMenuProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const history = useHistory();
  const themeColor = getAsset(clientKey, 'themeClassName');

  // ##################################################################### //
  // ############################# ANIMATION ############################# //
  // ##################################################################### //

  const ANIMATION_DURATION = 0.5;

  // ~~~~~~~~~~~~~~ WHOLE MENU ~~~~~~~~~~~~~ //

  const sidemenuContainerRef = useRef();

  const handleOpenAnimation = () => {
    return gsap.to(sidemenuContainerRef.current, {
      x: '0%',
      opacity: 1,
      duration: ANIMATION_DURATION,
      ease: 'power2',
    });
  };

  const handleCloseAnimation = () => {
    return gsap.to(sidemenuContainerRef.current, {
      x: '-100%',
      opacity: 0,
      duration: ANIMATION_DURATION,
      delay: ANIMATION_DURATION / 2,
      ease: 'power2',
    });
  };

  const previousOpenState = usePrevious(isOpen);

  useEffect(() => {
    let animation: any = undefined;
    if (isOpen && previousOpenState === false) {
      animation = handleOpenAnimation();
    } else if (!isOpen && previousOpenState === true) {
      animation = handleCloseAnimation();
    }
    return () => {
      if (animation !== undefined) {
        animation?.kill();
      }
    };
  }, [isOpen]);

  // ~~~~~~~~~~~~~~~ CLICKING ~~~~~~~~~~~~~~ //

  const closeButtonRef = useRef();
  const backButtonRef = useRef();
  const homeButtonRef = useRef();
  const videoButtonRef = useRef();
  const saveQuitButtonRef = useRef();

  const handleClickAnimation = (targetRef: any) => {
    return gsap.fromTo(
      targetRef.current,
      {scaleX: 0.8, scaleY: 0.8},
      {
        scaleX: 1,
        scaleY: 1,
        transformOrigin: 'center center',
        duration: ANIMATION_DURATION,
        ease: 'elastic.out(1, 0.3)',
      }
    );
  };

  // ##################################################################### //
  // ############################ MENU HANDLES ########################### //
  // ##################################################################### //

  const handleClose = () => {
    handleClickAnimation(closeButtonRef);
    setOverlay('');
  };

  const handleMenuBack = (inputRef?: any) => {
    handleClickAnimation(backButtonRef);
    handleBack();
    setOverlay('');
  };
  const handleMenuHome = (inputRef?: any) => {
    handleClickAnimation(homeButtonRef);
    handlePopup(false);
    setOverlay('');
  };
  const handleMenuVideoLink = (inputRef?: any) => {
    handleClickAnimation(videoButtonRef);
    if (videoLink) {
      handleVideoLinkPopup();
    }
    setOverlay('');
  };
  const handleMenuSaveAndQuit = (inputRef?: any) => {};

  return (
    <div
      ref={sidemenuContainerRef}
      style={{transform: `translateX(-100%)`}}
      className={`${theme.backGround[themeColor]} fixed w-full h-full z-100`}>
      <div className={`w-full flex justify-center items-center content-center py-2 px-6`}>
        <div className="w-full flex flex-col items-center justify-between">
          <div className="text-lg font-medium">
            <div className="w-auto p-4 mb-4 flex flex-row justify-end">
              <span
                ref={closeButtonRef}
                className={`my-auto text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer`}
                onPointerDown={() => handleClose()}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineClose />
                </IconContext.Provider>
              </span>
            </div>

            <div
              ref={backButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => handleMenuBack()}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineArrowLeft />
                </IconContext.Provider>
              </span>
              <span className={`pointer-events-none`}>BACK</span>
            </div>
            <div
              ref={homeButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => handleMenuHome()}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineHome />
                </IconContext.Provider>
              </span>
              <span className={`pointer-events-none`}>HOME</span>
            </div>
            <div
              ref={videoButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => handleMenuVideoLink()}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineVideoCamera />
                </IconContext.Provider>
              </span>
              <span className={`pointer-events-none`}>VIDEO LINK</span>
            </div>
            {/* <div
              ref={saveQuitButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => setOverlay('')}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineSave />
                </IconContext.Provider>
              </span>
              <span className={`pointer-events-none`}>SAVE & QUIT</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
