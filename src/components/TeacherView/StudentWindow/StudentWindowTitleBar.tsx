import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaExpand, FaCompress, FaHome, FaRegThumbsUp, FaInfoCircle } from 'react-icons/fa';

interface StudentWindowTitleBarProps {
  setFullscreenInstructions: React.Dispatch<React.SetStateAction<boolean>>;
  fullscreenInstructions: boolean;
  handleFullscreen: () => void;
  fullscreen: boolean;
  pageViewed: { pageID: number; stage: string };
  setPageViewed: React.Dispatch<React.SetStateAction<object>>;
}

const StudentWindowTitleBar: React.FC<StudentWindowTitleBarProps> = (
  props: StudentWindowTitleBarProps
) => {
  const {
    setFullscreenInstructions,
    fullscreenInstructions,
    handleFullscreen,
    fullscreen,
    pageViewed,
    setPageViewed,
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);

  /**
   * Function for getting the object from state of
   * currently viewed page
   */
  const getCurrentPage = () => {
    if (pageViewed.pageID !== null) {
      return state.pages[pageViewed.pageID];
    }
  };

  /**
   * Variable referring to ^ function above
   */
  const isOpen = getCurrentPage().open;

  /**
   * Functioon for disabling lessons
   * @param type - Context action e.g. 'DISABLE_LESSON'
   */
  const handleStateChange = (type: string) => {
    dispatch({ type: type, payload: pageViewed.stage });
  };

  /**
   * Function for opening/closing components for students
   * @param open - if boolean value is true, close, else open
   */
  const handleOpenCloseComponent = (open: boolean) => {
    if (open) {
      return handleStateChange('CLOSE_LESSON');
    }
    return handleStateChange('OPEN_LESSON');
  };

  return (
    <div className={`w-full h-8 top-0 flex space-between font-medium bg-light-gray bg-opacity-10`}>
      <div className='h-8 pl-2 align-middle font-bold text-xs leading-8 '>
        <span className='mr-2'>Workspace:</span>

        {/**
         *
         * TITLEBAR LESSON CONTROL
         * 
         * open/close & enable/disable buttons are only
         * visible when teacher is NOT on the intro,
         * and when you're NOT currently viewing a studento
         *
         */}
        {pageViewed.pageID !== 0 && !state.studentViewing.live && getCurrentPage().disabled === false ? (
          getCurrentPage().open ? (
            <span
              className='mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-red-600 hover:bg-red-500 hover:text-underline p-1 rounded-lg cursor-pointer'
              onClick={() => handleOpenCloseComponent(isOpen)}>
              Close Component
            </span>
          ) : (
            <span
              className='mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-sea-green hover:bg-green-500 hover:text-underline p-1 rounded-lg cursor-pointer'
              onClick={() => handleOpenCloseComponent(isOpen)}>
              Open Component
            </span>
          )
        ) : null}

        {pageViewed.pageID !== 0 && !state.studentViewing.live ? (
          getCurrentPage().disabled ? (
            <span
              className='mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-sea-green hover:bg-green-500 hover:text-underline p-1 rounded-lg cursor-pointer'
              onClick={() => handleStateChange('DISABLE_LESSON')}>
              Enable Component
            </span>
          ) : (
            <span
              className='mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-yellow-500 hover:bg-yellow-400 hover:text-underline p-1 rounded-lg cursor-pointer'
              onClick={() => handleStateChange('DISABLE_LESSON')}>
              Disable Component
            </span>
          )
        ) : null}
      </div>

      <div className='w-24 flex space-between'>
        <div
          className='w-auto cursor-pointer w-full text-xl z-50'
          onClick={() => setFullscreenInstructions(!fullscreenInstructions)}>
          <IconContext.Provider
            value={{
              color: '#E2E8F0',
              size: '2rem',
              style: {
                zIndex: 50,
              },
            }}>
            <FaInfoCircle />
          </IconContext.Provider>
        </div>

        <div className='w-auto cursor-pointer w-full text-xl z-50' onClick={handleFullscreen}>
          <IconContext.Provider
            value={{
              color: '#E2E8F0',
              size: '2rem',
              style: {
                zIndex: 50,
              },
            }}>
            {fullscreen ? <FaCompress /> : <FaExpand />}
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default StudentWindowTitleBar;
