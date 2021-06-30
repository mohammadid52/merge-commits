import React, { useContext, useEffect, useState } from 'react';
import {LessonControlContext} from '../../../contexts/LessonControlContext';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaCompress, FaExpand, FaInfoCircle} from 'react-icons/fa';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { UniversalLessonPage } from '../../../interfaces/UniversalLessonInterfaces';

interface StudentWindowTitleBarProps {
  handleFullscreen: () => void;
  fullscreen: boolean;
  instructions: {
    visible: boolean;
    available: boolean;
    content: any;
  };
  setInstructions: React.Dispatch<React.SetStateAction<object>>;
}

const StudentWindowTitleBar: React.FC<StudentWindowTitleBarProps> = (
  props: StudentWindowTitleBarProps
) => {
  const {
    handleFullscreen,
    fullscreen,
    instructions,
    setInstructions,
  } = props;
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const [activePageData, setActivePageData] = useState<UniversalLessonPage>();

  useEffect(() => {
    const PAGES = lessonState.lessonData.lessonPlan;
    if (PAGES) {
      const CURRENT_PAGE = lessonState.currentPage;
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
  }, [lessonState.lessonData, lessonState.currentPage]);


  /**
   * Variable referring to ^ function above
   */
  const isOpen = activePageData ? activePageData.open : false;

  /**
   * Function for opening/closing components for students
   * @param pageNr
   */
  const handleOpenCloseComponent = (pageNr: number) => {
    lessonDispatch({
      type: 'TOGGLE_OPEN_PAGE',
      payload: pageNr,
    });
  };

  return (
    <div
      className={`w-full h-8 top-0 flex space-between font-medium bg-light-gray bg-opacity-10`}>
      <div className="h-8 pl-2 align-middle font-bold text-xs leading-8 ">
        <span className="mr-2">Workspace:</span>

        {/**
         *
         * TITLEBAR LESSON CONTROL
         *
         * open/close & enable/disable buttons are only
         * visible when teacher is NOT on the intro,
         * and when you're NOT currently viewing a studento
         *
         */}
        {lessonState.currentPage !== 0 &&
        (activePageData && activePageData.enabled === true) ? (
          activePageData.open ? (
            <span
              className="mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-red-600 hover:bg-red-500 hover:text-underline p-1 rounded-lg cursor-pointer"
              onClick={() => handleOpenCloseComponent(lessonState.currentPage)}>
              Close Component
            </span>
          ) : (
            <span
              className="mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-sea-green hover:bg-green-500 hover:text-underline p-1 rounded-lg cursor-pointer"
              onClick={() => handleOpenCloseComponent(lessonState.currentPage)}>
              Open Component
            </span>
          )
        ) : null}


      </div>

      <div className="w-auto flex justify-between">
        {instructions.available ? (
          <div
            className="w-auto flex justify-center items-center cursor-pointer text-xl z-50 px-2 text-black hover:text-blueberry"
            onClick={() =>
              setInstructions({
                visible: !instructions.visible,
                available: instructions.available,
                content: instructions.content,
              })
            }>
            <IconContext.Provider
              value={{
                size: '1.5rem',
                style: {
                  zIndex: 50,
                },
              }}>
              <FaInfoCircle />
            </IconContext.Provider>
          </div>
        ) : null}

        <div
          className="w-8 mr-4 flex justify-center items-center cursor-pointer text-xl z-50 px-2 text-black hover:text-blueberry"
          onClick={handleFullscreen}>
          <IconContext.Provider
            value={{
              size: '1.5rem',
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