import React, {ReactNode} from 'react';
import ProgressBar from './ProgressBar/ProgressBar';

import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {IconContext} from 'react-icons';
import {AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineMenu} from 'react-icons/ai';
import {useGlobalContext} from 'contexts/GlobalContext';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';

const LessonTopMenu = ({
  setOverlay,
  handlePopup,

  handleRequiredNotification,
  pages,
  canContinue,
  handleForward,
  pageStateUpdated,
  validateRequired
}: LessonHeaderBarProps) => {
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;

  const theme = gContext.theme;

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  const Button = ({children, onClick}: {children: ReactNode; onClick: () => void}) =>
    (breakpoint === 'xs' || breakpoint === 'sm') && (
      <button
        className={`my-auto ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
          canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark-gray cursor-default'
        } `}
        onClick={onClick}>
        <IconContext.Provider
          value={{
            size: '1.5rem',
            style: {width: '32px'},
            className: `text-white`
          }}>
          {children}
        </IconContext.Provider>
      </button>
    );

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <>
      <div
        className={`${theme.toolbar.bg}  shadow-1 w-full flex justify-center items-center content-center py-2 px-6`}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row justify-center">
            {/* BACK BUTTON */}

            {(breakpoint === 'xs' || breakpoint === 'sm') && (
              <div
                className={`my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer bg-darker-gray }`}
                onClick={() => setOverlay('sidemenu')}>
                <IconContext.Provider
                  value={{
                    size: '1.5rem',
                    style: {width: '32px'},
                    className: `text-white`
                  }}>
                  <AiOutlineMenu />
                </IconContext.Provider>
              </div>
            )}

            {/* PROGRESS BAR */}

            {pageStateUpdated && (
              <ProgressBar
                handleHome={() => handlePopup(false)}
                handleRequiredNotification={handleRequiredNotification}
                pages={pages}
                canContinue={canContinue}
                validateRequired={validateRequired}
                currentPage={lessonState?.currentPage}
                studentData={lessonState?.studentData}
                requiredInputs={lessonState?.requiredInputs}
              />
            )}

            {/* FORWARD BUTTON */}

            <Button onClick={() => handleForward(false)}>
              <AiOutlineArrowLeft />
            </Button>
            <Button onClick={handleForward}>
              <AiOutlineArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonTopMenu;
