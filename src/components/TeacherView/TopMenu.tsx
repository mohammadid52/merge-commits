import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import React, {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {getLocalStorageData} from 'utilities/localStorage';
import LessonControlBar from './LessonControlBar/LessonControlBar';
import StudentWindowTitleBar from './StudentWindow/StudentWindowTitleBar';
import CloseLesson from './StudentWindow/TitleBarSections/CloseLesson';
import FullscreenToggle from './StudentWindow/TitleBarSections/FullscreenToggle';
import HamburgerMenu from './TopMenu/HamburgerMenu';
import LessonInfoTitleBar from './TopMenu/LessonInfoTitleBar';

interface TopMenuControlProps {
  themeColor?: string;
  isSameStudentShared: boolean;
  handleOpen?: () => void;
  handleComplete?: () => void;
  handleQuitViewing: () => void;
  handleQuitShare: () => void;
  handleLeavePopup: () => void;
  handleHomePopup: () => void;
  handlePageChange: any;
  fullscreen?: boolean;
  handleFullscreen?: () => void;
}

const TopMenuControl: React.FC<TopMenuControlProps> = ({
  themeColor,
  handleLeavePopup,
  handleHomePopup,
  handlePageChange,
  fullscreen,
  handleFullscreen
}: TopMenuControlProps) => {
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const theme = gContext.theme;
  const userLanguage = gContext.userLanguage;
  const {lessonPlannerDict} = useDictionary(clientKey);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //

  const {breakpoint} = useTailwindBreakpoint();

  return (
    <div
      className={`${
        breakpoint === 'xl' || breakpoint === '2xl' ? 'px-4' : 'px-2'
      } h-auto flex flex-col`}>
      {/* LABELS */}
      <div className="hidden lg:block  h-8 py-1 mb-2">
        <div className={`relative font-medium bg-transparent flex flex-row items-center`}>
          {/* LEFT */}

          {/* RIGHT */}
          <div className="relative w-full h-full flex flex-row justify-between items-center ">
            <div className="h-8 align-middle text-sm font-semibold text-gray-600 leading-8 ">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['LESSON_CONTROL']}:
            </div>
            {/* RIGHT - FULLSCREEN BUTTON */}
            <div className="w-auto gap-1 flex items-center">
              <CloseLesson />

              {breakpoint === 'xl' || breakpoint === '2xl' ? (
                <FullscreenToggle
                  theme={theme}
                  themeColor={themeColor}
                  fullscreen={fullscreen}
                  handleFullscreen={handleFullscreen}
                />
              ) : (
                <div className=" "></div>
              )}

              {/* <HamburgerMenu
                theme={theme}
                themeColor={themeColor}
                handleLeavePopup={handleLeavePopup}
                handleHomePopup={handleHomePopup}
              /> */}
            </div>
          </div>
        </div>
      </div>
      {/* BUTTONS & CONTENT */}
      <div className="lg:block h-12">
        {/* CONTROL START */}

        <LessonControlBar handlePageChange={handlePageChange} />

        {/* CONTROL END */}
      </div>

      <StudentWindowTitleBar
        theme={theme}
        themeColor={themeColor}
        handleFullscreen={handleFullscreen}
        fullscreen={fullscreen}
      />
    </div>
  );
};

export default TopMenuControl;
