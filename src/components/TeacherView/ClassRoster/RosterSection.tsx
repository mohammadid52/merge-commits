import {getAsset} from 'assets';
import React, {useContext, useRef, useState} from 'react';
import {IoMdRefresh} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import RosterRow from './RosterRow';
import RosterRowEmpty from './RosterRowEmpty';
import gsap from 'gsap/all';
import Buttons from '@components/Atoms/Buttons';

export interface IRosterSectionProps {
  hot?: boolean;
  handleManualRefresh?: () => void;
  loading?: boolean;
  handleToggleRightView?: (rightViewObj: {view: string; option?: string}) => void;
  rightView?: {view: string; option?: string};
  setRightView?: any;
  studentList?: any[];
  handleResetViewAndShare?: () => void;
  handleViewStudentData?: (id: string) => void;
  handleShareStudentData?: (idStr: string, pageIdStr: string) => void;
  viewedStudent: string;
  sharedStudent: string;
  handlePageChange?: any;
  sectionTitle?: string;
  emptyMessage?: string;
}

const RosterSection = ({
  hot,
  handleManualRefresh,
  loading,
  handleToggleRightView,
  rightView,
  studentList,
  handleResetViewAndShare,
  handleViewStudentData,
  handleShareStudentData,
  viewedStudent,
  sharedStudent,
  handlePageChange,
  sectionTitle,
  emptyMessage,
}: IRosterSectionProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const themeColor = getAsset(clientKey, 'themeClassName');

  const {lessonPlannerDict} = useDictionary(clientKey);

  // ~~~~~~~~~ MINIMIZE / ANIMATION ~~~~~~~~ //
  const listRef = useRef();

  const [minimized, setMinimized] = useState<boolean>(false);

  const rollUpAnimation = (ref: React.MutableRefObject<any>) => {
    setMinimized(true);
    gsap.to(ref.current, {
      height: '0%',
      opacity: 0,
      duration: 0.5,
      ease: 'easeInOut',
    });
  };

  const rollDownAnimation = (ref: React.MutableRefObject<any>) => {
    setMinimized(false);
    gsap.to(ref.current, {
      height: 'auto',
      opacity: 1,
      duration: 0.5,
      ease: 'easeInOut',
    });
  };

  const toggleAnimation = (
    isMinimized: boolean,
    ref: React.MutableRefObject<any>,
    anim1: Function,
    anim2: Function
  ) => {
    if (isMinimized) {
      anim1(ref);
    } else {
      anim2(ref);
    }
  };

  return (
    <>
      <div className={`w-full h-10 flex items-center bg-transparent`}>
        <div className="relative w-full h-auto flex flex-row items-center">
          <span className="text-sm font-semibold text-gray-600">{sectionTitle}</span>
          <span
            className="text-sm font-bold text-gray-600 cursor-pointer p-2"
            onClick={() =>
              toggleAnimation(minimized, listRef, rollDownAnimation, rollUpAnimation)
            }>
            {minimized === true ? '+' : '−'}
          </span>
          <span className="relative mr-0 flex justify-end">
            {hot && (
              <Buttons
                overrideClass
                btnClass={`${theme.btn[themeColor]} h-8 font-bold uppercase text-xs p-1 rounded items-center w-auto`}
                label="Sentiments"
                onClick={() => handleToggleRightView({view: 'lessonInfo', option: ''})}
              />
            )}
          </span>
        </div>
      </div>

      {/* ROSTER HEAD LABELS*/}
      {hot && (
        <div
          className={`${theme.textColor[themeColor]} w-full h-8 flex py-2  bg-transparent`}>
          <div
            className={`w-3/10  relative  flex items-center hover:underline cursor-pointer text-xs`}>
            <span className="w-auto">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['ONE']}
            </span>
            <span className={`w-8`} onClick={handleManualRefresh}>
              <IconContext.Provider value={{color: '#EDF2F7'}}>
                <IoMdRefresh size={28} className={`${loading ? 'animate-spin' : null}`} />
              </IconContext.Provider>
            </span>
          </div>
          <div
            className={`w-3/10  flex items-center justify-center rounded-lg text-center text-xs`}>
            <span className="w-auto">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['TWO']}
            </span>
          </div>
          <div
            className={`w-3/10 flex items-center justify-center rounded-lg text-center text-xs`}>
            <span className="w-auto">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['THREE']}
            </span>
          </div>
          <div
            className={`w-1/10 flex items-center justify-center rounded-lg text-center text-xs`}
          />
        </div>
      )}

      <div ref={listRef} className={`w-full flex flex-col items-center`}>
        {studentList && studentList.length > 0 ? (
          studentList.map((student: any, key: number) => (
            <RosterRow
              key={`rosterrow_inactive_${key}`}
              number={key}
              id={student.personAuthID}
              active={false}
              firstName={student.person?.firstName ? student.person?.firstName : ''}
              lastName={student.person?.lastName ? student.person?.lastName : ''}
              preferredName={
                student.person?.preferredName ? student.person?.preferredName : ''
              }
              role={student.person?.role ? student.person?.role : ''}
              currentLocation={student.currentLocation}
              lessonProgress={student.lessonProgress}
              handleResetViewAndShare={handleResetViewAndShare}
              handleViewStudentData={handleViewStudentData}
              handleShareStudentData={handleShareStudentData}
              viewedStudent={viewedStudent}
              sharedStudent={sharedStudent}
              handlePageChange={handlePageChange}
              rightView={rightView}
              handleToggleRightView={handleToggleRightView}
            />
          ))
        ) : (
          <>
            <RosterRowEmpty message={emptyMessage} />
          </>
        )}
      </div>
    </>
  );
};

export default RosterSection;
