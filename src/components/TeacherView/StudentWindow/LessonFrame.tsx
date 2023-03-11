import usePrevious from "customHooks/previousProps";
import useTailwindBreakpoint from "customHooks/tailwindBreakpoint";
import { gsap } from "gsap/all";
import React, { useEffect, useRef, useState } from "react";
import TopMenu from "../TopMenu";

interface ILessonFrame {
  children?: React.ReactNode;
  fullscreen?: boolean;
  handleFullscreen?: any;
  theme?: any;
  anyoneIsViewed?: boolean;
  anyoneIsShared?: boolean;
  isPresenting?: boolean;
  isSameStudentShared?: boolean;
  handleQuitShare?: any;
  handleQuitViewing?: any;
  handlePageChange?: any;
  handleLeavePopup?: any;
  handleHomePopup?: any;
  visible?: boolean;
}

const LessonFrame = ({
  children,
  fullscreen,
  handleFullscreen,

  anyoneIsViewed,
  anyoneIsShared,
  isPresenting,
  isSameStudentShared,
  handleQuitShare,
  handleQuitViewing,
  handlePageChange,
  handleLeavePopup,
  handleHomePopup,
}: ILessonFrame) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //

  // ~~~~~~~~~~~ LIVE VIEW STATE ~~~~~~~~~~~ //
  const [live, setLive] = useState<boolean>(false);
  useEffect(() => {
    if (anyoneIsShared || anyoneIsViewed || isPresenting) {
      if (!live) {
        setLive(true);
      }
    } else {
      if (live) {
        setLive(false);
      }
    }
  }, [anyoneIsShared, anyoneIsViewed, isPresenting]);

  // ~~~~~~~~~ LIVE VIEW ANIMATION ~~~~~~~~~ //
  const lessonWindowRef = useRef<any>(null);
  const frameRef = useRef<any>(null);

  useEffect(() => {
    const borderAnimation = gsap.timeline({ repeat: -1, duration: 2 });
    lessonWindowRef?.current &&
      borderAnimation.from(lessonWindowRef?.current, {
        borderColor: "rgba(97, 169, 237,0.5)",
        borderWidth: 4,
        ease: "power2",
      });
    lessonWindowRef?.current &&
      borderAnimation.to(lessonWindowRef?.current, {
        borderColor: "rgba(97, 169, 237,1)",
        borderWidth: 4,
        ease: "power2",
      });
    lessonWindowRef?.current &&
      borderAnimation.to(lessonWindowRef?.current, {
        borderColor: "rgba(97, 169, 237,0.5)",
        borderWidth: 4,
        ease: "power2",
      });

    if (!live && borderAnimation) {
      borderAnimation.kill();
    }
    return () => {
      if (borderAnimation) {
        borderAnimation.kill();
      }
    };
  }, [live]);

  // ~~~~~~~~~ FULLSCREEN ANIMATION ~~~~~~~~ //

  const scaleDown = () => {
    gsap.fromTo(
      frameRef.current,
      { width: "100%" },
      { width: "75%", scaleOrigin: "right", duration: 1, ease: "easeInOut" }
    );
  };
  const scaleUp = () => {
    gsap.fromTo(
      frameRef.current,
      { width: "75%" },
      { width: "100%", scaleOrigin: "right", duration: 1, ease: "easeInOut" }
    );
  };

  const previousFullscreen = usePrevious(fullscreen);

  useEffect(() => {
    if (fullscreen) {
      scaleUp();
    } else {
      if (previousFullscreen) {
        scaleDown();
      }
    }
  }, [fullscreen]);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //

  const { breakpoint } = useTailwindBreakpoint();

  return (
    <>
      <div
        ref={frameRef}
        style={{
          width:
            breakpoint === "xl" || breakpoint === "2xl"
              ? "75%"
              : "calc(100% - 36px)",
        }}
        className={`bg-gray-200 absolute mr-0 right-0 h-full flex flex-col items-center z-50`}
      >
        <TopMenu
          isSameStudentShared={Boolean(isSameStudentShared)}
          handleQuitViewing={handleQuitViewing}
          handleQuitShare={handleQuitShare}
          handleLeavePopup={handleLeavePopup}
          handleHomePopup={handleHomePopup}
          handlePageChange={handlePageChange}
          fullscreen={fullscreen}
          handleFullscreen={handleFullscreen}
        />

        <div ref={lessonWindowRef} className="flex-1 overflow-y-scroll">
          {children}
        </div>
      </div>
    </>
  );
};

export default LessonFrame;
