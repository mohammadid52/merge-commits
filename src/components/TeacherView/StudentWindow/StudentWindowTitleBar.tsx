import React, {useContext, useEffect, useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {UniversalLessonPage} from '../../../interfaces/UniversalLessonInterfaces';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as mutations from '../../../graphql/mutations';
import {setSessionData} from '../../../utilities/sessionData';
import {getLocalStorageData, setLocalStorageData} from '../../../utilities/localStorage';

interface StudentWindowTitleBarProps {
  handleFullscreen: () => void;
  fullscreen: boolean;
}

const StudentWindowTitleBar: React.FC<StudentWindowTitleBarProps> = (
  props: StudentWindowTitleBarProps
) => {
  const {handleFullscreen, fullscreen} = props;
  const {lessonState, lessonDispatch} = useContext(GlobalContext);
  const [activePageData, setActivePageData] = useState<UniversalLessonPage>();

  useEffect(() => {
    const PAGES = lessonState.lessonData.lessonPlan;
    if (PAGES) {
      const CURRENT_PAGE = lessonState.currentPage;
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
  }, [lessonState.lessonData, lessonState.currentPage]);

  // ##################################################################### //
  // ######################### OPEN / CLOSE PAGES ######################## //
  // ##################################################################### //
  const handleOpenCloseComponent = async (pageNr: number) => {
    // ~~~~~~ GET ROOM INFO FROM SESSION ~~~~~ //
    const getRoomData = getLocalStorageData('room_info');

    // ~~~~~~~ GET CURRENT CLOSED PAGES ~~~~~~ //
    const getClosedPages = lessonState.lessonData.lessonPlan.reduce(
      (acc: string[], lessonPlanObj: UniversalLessonPage) => {
        console.log(lessonPlanObj.open);
        if (lessonPlanObj.open === false) {
          return [...acc, lessonPlanObj.id];
        } else {
          return acc;
        }
      },
      []
    );

    // ~~~~~~~~~~~~ UPDATE CONTEXT ~~~~~~~~~~~ //
    lessonDispatch({
      type: 'TOGGLE_OPEN_PAGE',
      payload: pageNr,
    });

    // ~ APPEND PAGE ID TO CLOSED PAGES ARRAY  //
    const finalClosedPages = getClosedPages.includes(activePageData.id)
      ? getClosedPages.filter((str: string) => str !== activePageData.id)
      : [...getClosedPages, activePageData.id];

    // ~~~~~~~~~~~~ UPDATE SESSION ~~~~~~~~~~~ //
    setLocalStorageData('room_info', {...getRoomData, ClosedPages: finalClosedPages});

    // ~~~~~~~~~~~~~~ MUTATE DB ~~~~~~~~~~~~~~ //
    try {
      const updateOpenClosePages: any = await API.graphql(
        graphqlOperation(mutations.updateRoom, {
          input: {
            id: getRoomData.id,
            institutionID: getRoomData.institutionID,
            classID: getRoomData.classID,
            teacherAuthID: getRoomData.teacherAuthID,
            teacherEmail: getRoomData.teacherEmail,
            name: getRoomData.name,
            maxPersons: getRoomData.maxPersons,
            ClosedPages: finalClosedPages,
          },
        })
      );
    } catch (e) {
      console.error('handleOpenClose - updateRoom mutation - ', e);
    }
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
        activePageData &&
        activePageData.disabled !== true ? (
          activePageData.open !== false ? (
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
