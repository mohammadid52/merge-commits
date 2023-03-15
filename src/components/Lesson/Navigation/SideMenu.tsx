import {useGlobalContext} from 'contexts/GlobalContext';
import {useEffect, useRef} from 'react';
import {
  AiOutlineArrowLeft,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineVideoCamera
} from 'react-icons/ai';

import {getAsset} from 'assets';
import usePrevious from 'customHooks/previousProps';
import {gsap} from 'gsap/all';
import {ISideMenuProps} from 'interfaces/LessonComponentsInterfaces';

const SideMenu = ({
  isOpen,

  setOverlay,
  videoLink,
  handleVideoLinkPopup,

  handleBack,

  handlePopup
}: ISideMenuProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const {clientKey, theme} = useGlobalContext();

  const themeColor = getAsset(clientKey, 'themeClassName');

  // ##################################################################### //
  // ############################# ANIMATION ############################# //
  // ##################################################################### //

  const ANIMATION_DURATION = 0.5;

  // ~~~~~~~~~~~~~~ WHOLE MENU ~~~~~~~~~~~~~ //

  const sidemenuContainerRef = useRef<any>(null);

  const handleOpenAnimation = () => {
    return gsap.to(sidemenuContainerRef.current, {
      x: '0%',
      opacity: 1,
      duration: ANIMATION_DURATION,
      ease: 'power2'
    });
  };

  const handleCloseAnimation = () => {
    return gsap.to(sidemenuContainerRef.current, {
      x: '-100%',
      opacity: 0,
      duration: ANIMATION_DURATION,
      delay: ANIMATION_DURATION / 2,
      ease: 'power2'
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

  const closeButtonRef = useRef<any>(null);
  const backButtonRef = useRef<any>(null);
  const homeButtonRef = useRef<any>(null);
  const videoButtonRef = useRef<any>(null);

  const handleClickAnimation = (targetRef: any) => {
    return gsap.fromTo(
      targetRef.current,
      {scaleX: 0.8, scaleY: 0.8},
      {
        scaleX: 1,
        scaleY: 1,
        transformOrigin: 'center center',
        duration: ANIMATION_DURATION,
        ease: 'elastic.out(1, 0.3)'
      }
    );
  };

  // ##################################################################### //
  // ############################ MENU HANDLES ########################### //
  // ##################################################################### //

  const handleClose = () => {
    handleClickAnimation(closeButtonRef);
    setOverlay?.('');
  };

  const handleMenuBack = (_?: any) => {
    handleClickAnimation(backButtonRef);
    handleBack?.();
    setOverlay?.('');
  };
  const handleMenuHome = (_?: any) => {
    handleClickAnimation(homeButtonRef);
    handlePopup?.(false);
    setOverlay?.('');
  };
  const handleMenuVideoLink = (_?: any) => {
    handleClickAnimation(videoButtonRef);
    if (videoLink) {
      handleVideoLinkPopup?.();
    }
    setOverlay?.('');
  };

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
                <AiOutlineClose className="text-white w-[32px]" />
              </span>
            </div>

            <div
              ref={backButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => handleMenuBack()}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <AiOutlineArrowLeft className="text-white w-[32px]" />
              </span>
              <span className={`pointer-events-none`}>BACK</span>
            </div>
            <div
              ref={homeButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => handleMenuHome()}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <AiOutlineHome className="text-white w-[32px]" />
              </span>
              <span className={`pointer-events-none`}>HOME</span>
            </div>
            <div
              ref={videoButtonRef}
              className="p-4 mb-4 flex flex-row cursor-pointer hover:underline"
              onPointerDown={() => handleMenuVideoLink()}>
              <span
                className={`pointer-events-none my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30`}>
                <AiOutlineVideoCamera className="text-white w-[32px]" />
              </span>
              <span className={`pointer-events-none`}>VIDEO LINK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
