import {ReactNode} from 'react';
import ProgressBar from './ProgressBar/ProgressBar';

import {useGlobalContext} from 'contexts/GlobalContext';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';
import {AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineMenu} from 'react-icons/ai';

const Button = ({
  children,
  onClick,
  className
}: {
  className: string;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    className={`my-auto md:hidden ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30  ${className} `}
    onClick={onClick}>
    {children}
  </button>
);

const LessonTopMenu = ({
  setOverlay,
  handlePopup,

  handleRequiredNotification,
  pages,
  updatePageInLocalStorage,
  canContinue,
  handleForward,
  pageStateUpdated,
  validateRequired
}: LessonHeaderBarProps) => {
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;

  const theme = gContext.theme;

  return (
    <>
      <div
        className={`${theme.toolbar.bg}  shadow-1 w-full flex justify-center items-center content-center py-2 px-6`}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row justify-center">
            {/* BACK BUTTON */}

            <div
              className={`my-auto md:hidden mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 cursor-pointer bg-darker-gray }`}
              onClick={() => setOverlay?.('sidemenu')}>
              <AiOutlineMenu size={'1.5rem'} className="text-white" />
            </div>

            {/* PROGRESS BAR */}

            {pageStateUpdated && (
              <ProgressBar
                handleHome={() => handlePopup?.(false)}
                handleRequiredNotification={handleRequiredNotification}
                pages={pages}
                canContinue={canContinue}
                updatePageInLocalStorage={updatePageInLocalStorage}
                validateRequired={validateRequired}
                currentPage={lessonState?.currentPage}
                studentData={lessonState?.studentData}
                requiredInputs={lessonState?.requiredInputs}
              />
            )}

            {/* FORWARD BUTTON */}

            <Button
              className={
                canContinue
                  ? 'bg-sea-green cursor-pointer'
                  : 'bg-dark-gray cursor-default'
              }
              onClick={() => handleForward?.(false)}>
              <AiOutlineArrowLeft size={'1.5rem'} className="text-white" />
            </Button>
            <Button
              className={
                canContinue
                  ? 'bg-sea-green cursor-pointer'
                  : 'bg-dark-gray cursor-default'
              }
              onClick={() => handleForward?.()}>
              <AiOutlineArrowRight size={'1.5rem'} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonTopMenu;
