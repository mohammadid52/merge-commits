import React, {useContext} from 'react';
import {GlobalContext} from '../../contexts/GlobalContext';
import useDictionary from '../../customHooks/dictionary';
import {getLocalStorageData} from '../../utilities/localStorage';
import LessonControlBar from './LessonControlBar/LessonControlBar';
import HamburgerMenu from './TopMenu/HamburgerMenu';
import LessonInfoTitleBar from './TopMenu/LessonInfoTitleBar';

interface TopMenuControlProps {
  isSameStudentShared: boolean;
  handleOpen?: () => void;
  handleComplete?: () => void;
  handleQuitViewing: () => void;
  handleQuitShare: () => void;
  handleLeavePopup: () => void;
  handleHomePopup: () => void;
  handlePageChange: any;
  setQuickRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenuControl: React.FC<TopMenuControlProps> = ({
  handleLeavePopup,
  handleHomePopup,
  handlePageChange,
  setQuickRegister,
}: TopMenuControlProps) => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const controlState = gContext.controlState;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;

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
          <LessonInfoTitleBar />

          {/* RIGHT */}
          <div className="relative w-full lg:w-7/10 h-full flex flex-row justify-between items-center pl-2">
            <div className="h-8 align-middle font-bold text-xs leading-8 ">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['LESSON_CONTROL']}:
            </div>

            <HamburgerMenu
              handleLeavePopup={handleLeavePopup}
              setQuickRegister={setQuickRegister}
              handleHomePopup={handleHomePopup}
            />
          </div>
        </div>
      </div>
      {/* for mobile */}
      <div className="block lg:hidden">
        <div className="relative w-full h-full flex flex-row justify-center items-center bg-darker-gray bg-opacity-40">
          <LessonInfoTitleBar />
          <HamburgerMenu
            handleLeavePopup={handleLeavePopup}
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
          <div className="h-full w-full lg:w-3/10 min-w-100 border-r-0 border-white bg-light-gray bg-opacity-10 pl-2 flex flex-row justify-between ">
            {basicDetailsElements()}
          </div>

          {/* RIGHT */}

          {/* CONTROL START */}
          <div
            className="relative h-full
            w-full lg:w-7/10 h-20 flex flex-col items-center z-100">
            <LessonControlBar handlePageChange={handlePageChange} />
          </div>
          {/* CONTROL END */}
        </div>
      </div>
      {/* For mobile */}
      {/* <div
        className={`relative w-full h-22 border-b-0 border-gray-400 flex flex-row mt-0 z-50 `}>
        <div className="h-full w-full border-r-0 border-white bg-light-gray bg-opacity-10 pl-2  flex-row justify-between block lg:hidden">
          {basicDetailsElements()}
        </div>
      </div> */}
    </>
  );
};

export default TopMenuControl;
