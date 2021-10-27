import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from '../../../contexts/GlobalContext';
import * as mutations from '../../../graphql/mutations';
import {UniversalLessonPage} from '../../../interfaces/UniversalLessonInterfaces';
import {getLocalStorageData, setLocalStorageData} from '../../../utilities/localStorage';
import FullscreenToggle from './TitleBarSections/FullscreenToggle';
import OpenClosePagesToggle from './TitleBarSections/OpenClosePagesToggle';
import PresentationModeToggle from './TitleBarSections/PresentationModeToggle';

export interface StudentWindowTitleBarProps {
  theme?: any;
  themeColor?: string;
  handleFullscreen?: () => void;
  fullscreen?: boolean;
}

const StudentWindowTitleBar: React.FC<StudentWindowTitleBarProps> = (
  props: StudentWindowTitleBarProps
) => {
  const {theme, themeColor, handleFullscreen, fullscreen} = props;
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const displayData = lessonState?.displayData;

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

  // ~~~~~~ GET ROOM INFO FROM SESSION ~~~~~ //
  const getRoomData = getLocalStorageData('room_info');

  const handleOpenComponent = async (pageNr: number) => {
    // ~~~~~~~ GET CURRENT CLOSED PAGES ~~~~~~ //
    const getPagesBefore = lessonState.lessonData.lessonPlan.reduce(
      (pagesBeforeAcc: string[], page: UniversalLessonPage, pageIdx: number) => {
        if (pageIdx <= pageNr) {
          return [...pagesBeforeAcc, page.id];
        } else {
          return pagesBeforeAcc;
        }
      },
      []
    );

    //  ADD/REMOVE PAGEID FROM CLOSED PAGES ARRAY  //
    const finalClosedPages =
      getRoomData.ClosedPages.length > 0
        ? getRoomData.ClosedPages.filter(
            (pageID: string) => !getPagesBefore.includes(pageID)
          )
        : [];

    // ~~~~~~~~~~~~ UPDATE CONTEXT ~~~~~~~~~~~ //
    lessonDispatch({
      type: 'TOGGLE_OPEN_PAGE',
      payload: pageNr,
    });

    // ~~~~~~~~~~~~ UPDATE SESSION ~~~~~~~~~~~ //
    setLocalStorageData('room_info', {...getRoomData, ClosedPages: finalClosedPages});

    // ~~~~~~~~~~~~~~ MUTATE DB ~~~~~~~~~~~~~~ //
    try {
      await API.graphql(
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

  const handleCloseComponent = async (pageNr: number) => {
    const getPagesAfter = lessonState.lessonData.lessonPlan.reduce(
      (pagesAfterAcc: any[], page: any, pageIdx: number) => {
        if (pageIdx >= pageNr) {
          return [...pagesAfterAcc, page.id];
        } else {
          return pagesAfterAcc;
        }
      },
      []
    );
    // ~~~~~~~~~~~~ UPDATE CONTEXT ~~~~~~~~~~~ //
    lessonDispatch({
      type: 'TOGGLE_CLOSE_PAGE',
      payload: pageNr,
    });

    // ~~~~~~~~~~~~ UPDATE SESSION ~~~~~~~~~~~ //
    setLocalStorageData('room_info', {
      ...getRoomData,
      ClosedPages: getPagesAfter,
    });

    // ~~~~~~~~~~~~~~ MUTATE DB ~~~~~~~~~~~~~~ //
    try {
      await API.graphql(
        graphqlOperation(mutations.updateRoom, {
          input: {
            id: getRoomData.id,
            institutionID: getRoomData.institutionID,
            classID: getRoomData.classID,
            teacherAuthID: getRoomData.teacherAuthID,
            teacherEmail: getRoomData.teacherEmail,
            name: getRoomData.name,
            maxPersons: getRoomData.maxPersons,
            ClosedPages: getPagesAfter,
          },
        })
      );
    } catch (e) {
      console.error('handleClosePages - updateRoom mutation - ', e);
    }
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div
      className={`relative w-full py-1 my-auto flex flex-shrink-0 justify-between bg-transparent`}>
      {/* LEFT - TITLEBAR CONTROL */}
      <OpenClosePagesToggle
        theme={theme}
        themeColor={themeColor}
        currentPage={lessonState.currentPage}
        activePageData={activePageData}
        handleOpenComponent={handleOpenComponent}
        handleCloseComponent={handleCloseComponent}
      />

      {/* CENTER - PRESENTATION MODE */}
      <PresentationModeToggle
        theme={theme}
        themeColor={themeColor}
        displayData={displayData}
        lessonDispatch={lessonDispatch}
        lessonData={lessonState.lessonData}
        currentPage={lessonState.currentPage}
      />

      {/* RIGHT - FULLSCREEN BUTTON */}
      <FullscreenToggle
        theme={theme}
        themeColor={themeColor}
        fullscreen={fullscreen}
        handleFullscreen={handleFullscreen}
      />
    </div>
  );
};

export default React.memo(StudentWindowTitleBar);
