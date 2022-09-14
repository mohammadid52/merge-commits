import React, {useContext} from 'react';
import ProgressBar from './ProgressBar/ProgressBar';

import useTailwindBreakpoint from '@customHooks/tailwindBreakpoint';
import {IconContext} from 'react-icons';
import {AiOutlineArrowRight, AiOutlineMenu} from 'react-icons/ai';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';

const LessonTopMenu = ({
  overlay,
  setOverlay,
  handlePopup,
  isAtEnd,
  setisAtEnd,
  handleRequiredNotification,
  pages,
  canContinue,
  handleForward,
}: LessonHeaderBarProps) => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const theme = gContext.theme;

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <>
      <div
        className={`${theme.toolbar.bg} shadow-1 w-full flex justify-center items-center content-center py-2 px-6`}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row justify-center">
            {/* BACK BUTTON */}

            {/* {(breakpoint === 'xs' || breakpoint === 'sm') && (
              <div
                className={`my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                  lessonState.currentPage > 0
                    ? 'cursor-pointer bg-dark-red'
                    : 'cursor-default bg-darker-gray'
                } }`}
                onClick={handleBack}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineArrowLeft />
                </IconContext.Provider>
              </div>
            )} */}

            {(breakpoint === 'xs' || breakpoint === 'sm') && (
              <div
                className={`my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer bg-darker-gray }`}
                onClick={() => setOverlay('sidemenu')}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineMenu />
                </IconContext.Provider>
              </div>
            )}

            {/* PROGRESS BAR */}

            <ProgressBar
              handleHome={() => handlePopup(false)}
              handleRequiredNotification={handleRequiredNotification}
              pages={pages}
              currentPage={lessonState?.currentPage}
              studentData={lessonState?.studentData}
              requiredInputs={lessonState?.requiredInputs}
            />

            {/* FORWARD BUTTON */}

            {(breakpoint === 'xs' || breakpoint === 'sm') && (
              <div
                className={`my-auto ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                  canContinue
                    ? 'bg-sea-green cursor-pointer'
                    : 'bg-dark-gray cursor-default'
                } `}
                onClick={handleForward}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`,
                  }}>
                  <AiOutlineArrowRight />
                </IconContext.Provider>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonTopMenu;
