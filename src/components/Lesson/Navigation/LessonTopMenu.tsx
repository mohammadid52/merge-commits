import {ReactNode} from 'react';
import ProgressBar from './ProgressBar/ProgressBar';

import useAuth from '@customHooks/useAuth';
import {useGlobalContext} from 'contexts/GlobalContext';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';
import {AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineMenu} from 'react-icons/ai';
import PageTimer from '../Components/PageTimer';

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

  const {isTeacher} = useAuth();

  const estTime = Number(pages?.[lessonState.currentPage]?.estTime || 1); // unit of time here is minutes
  const estTimeInSeconds = estTime * 60;

  return (
    <>
      <div
        className={`dark-blue  shadow-1 w-full flex  items-center justify-center py-4 px-6`}>
        <div className="w-full flex flex-row items-center justify-center">
          <div className="flex flex-row justify-center w-full items-center">
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
            {isTeacher && <PageTimer startTime={estTimeInSeconds} />}
            {/* FORWARD BUTTON */}

            <Button
              className={
                canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark cursor-default'
              }
              onClick={() => handleForward?.(false)}>
              <AiOutlineArrowLeft size={'1.5rem'} className="text-white" />
            </Button>
            <Button
              className={
                canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark cursor-default'
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
