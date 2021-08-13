import React, {useContext} from 'react';

import useDictionary from '../../customHooks/dictionary';
import {GlobalContext} from '../../contexts/GlobalContext';
import {LessonControlContext} from '../../contexts/LessonControlContext';

import LessonInfoTitleBar from './TopMenu/LessonInfoTitleBar';
import LessonControlBar from './LessonControlBar/LessonControlBar';

import HamburgerMenu from './TopMenu/HamburgerMenu';
/**
 * IMPORT FUNCTIONS
 */
import {formatPattern} from '../../utilities/strings';
import {getLocalStorageData} from '../../utilities/localStorage';

interface TopMenuControlProps {
  isSameStudentShared: boolean;
  handleOpen?: () => void;
  handleComplete?: () => void;
  handleLessonButton?: () => void;
  handleQuitViewing: () => void;
  handleShareStudentData: () => void;
  handleQuitShare: () => void;
  handleClick: () => void;
  handleHomePopup: () => void;
  handlePageChange: any;
  setQuickRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

export type LessonInfoTitleBarProps = Pick<
  TopMenuControlProps,
  'handleOpen' | 'handleComplete' | 'handleLessonButton'
>;

const TopMenuControl: React.FC<TopMenuControlProps> = (props: TopMenuControlProps) => {
  const {
    isSameStudentShared,
    handleOpen,
    handleComplete,
    handleLessonButton,
    handleQuitViewing,
    handleShareStudentData,
    handleQuitShare,
    handleClick,
    handleHomePopup,
    handlePageChange,
    setQuickRegister,
  } = props;

  const {lessonState, lessonDispatch, controlState, controlDispatch} = useContext(
    GlobalContext
  );
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {lessonPlannerDict} = useDictionary(clientKey);

  const getRoomData = getLocalStorageData('room_info');

  const studentsOnline = () => {
    if (controlState.roster) {
      return controlState.roster.length;
    } else {
      return 0;
    }
  };

  const basicDetailsElements = () => {
    return (
      <div className="w-full flex flex-col my-auto">
        <p className="text-xs">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDDENT_ONLINE']}:{' '}
          {studentsOnline()}
        </p>
        <p className="text-xs">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['ROOM_NAME']}:{' '}
          {`${getRoomData.name ? getRoomData.name : ''}`}
        </p>

        {/* <p className="text-xs">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['TOPIC']}: Identity
            </p> */}

        {/* <p className="text-xs">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['START_DATE']}:{' '}
              {formatPattern(state.startDate, '-', 'aaaa-bb-cc', 'bb-cc-aaaa')}
            </p>*/}

        <p className="text-xs">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['EST_TIME']}:{' '}
              {lessonState.lessonData?.duration}{' '}
              {`${lessonState.lessonData?.duration > 1 ? 'weeks' : 'week'}`}
            </p>
      </div>
    );
  };

  return (
    <>
      {/* LABELS */}
      <div className="hidden lg:block">
        <div
          className={`relative h-0.5/10 h-8 top-0 font-medium bg-light-gray bg-opacity-10 border-b-0 border-gray-400 flex flex-row items-center`}>
          {/* LEFT */}
          <LessonInfoTitleBar
            handleOpen={handleOpen}
            handleComplete={handleComplete}
            handleLessonButton={handleLessonButton}
          />

          {/* RIGHT */}
          <div className="relative w-6/10 lg:w-full h-full flex flex-row justify-between items-center pl-2">
            <div className="h-8 align-middle font-bold text-xs leading-8 ">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['LESSON_CONTROL']}:
            </div>

            <HamburgerMenu
              handleClick={handleClick}
              setQuickRegister={setQuickRegister}
              handleHomePopup={handleHomePopup}
            />
          </div>
        </div>
      </div>
      {/* for mobile */}
      <div className="block lg:hidden">
        <div className="relative w-full h-full flex flex-row justify-center items-center bg-darker-gray bg-opacity-40">
          <LessonInfoTitleBar
            handleOpen={handleOpen}
            handleComplete={handleComplete}
            handleLessonButton={handleLessonButton}
          />
          <HamburgerMenu
            handleClick={handleClick}
            setQuickRegister={setQuickRegister}
            handleHomePopup={handleHomePopup}
          />
        </div>
      </div>
      {/* BUTTONS & CONTENT */}
      <div className="hidden lg:block">
        <div
          className={`relative w-full h-22 border-b-0 border-gray-400 flex flex-row mt-0 z-50 `}>
          {/* LEFT */}
          <div className="h-full w-4/10 min-w-100 max-w-160  border-r-0 border-white bg-light-gray bg-opacity-10 pl-2 flex flex-row justify-between ">
            {basicDetailsElements()}
          </div>

          {/* RIGHT */}

          {/* CONTROL START */}
          <div
            className="relative 
            w-6/10 lg:w-full h-20 flex flex-col items-center z-100">
            <LessonControlBar handlePageChange={handlePageChange} />
          </div>
          {/* CONTROL END */}
        </div>
      </div>
      {/* For mobile */}
      {/* <div
        className={`relative w-full h-22 border-b-0 border-gray-400 flex flex-row mt-0 z-50 `}>
        <div className="h-full w-full border-r-0 border-white bg-light-gray bg-opacity-10 pl-2 flex flex-row justify-between block lg:hidden">
          {basicDetailsElements()}
        </div>
      </div> */}
    </>
  );
};

export default TopMenuControl;
