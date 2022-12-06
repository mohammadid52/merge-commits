import {PersonStatus} from 'API';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import gsap from 'gsap/all';
import React, {useContext, useRef, useState} from 'react';
import {GoChevronDown, GoChevronUp} from 'react-icons/go';
import {IoMdRefresh} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import RosterRow from './RosterRow';
import RosterRowEmpty from './RosterRowEmpty';

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
  setRecordPrevPage?: React.SetStateAction<React.Dispatch<number>>;
  recordPrevPage?: number;
  removing?: string | null;
  kickoutStudent?: (authId: string, email: string) => void;
}

const RosterSection = ({
  hot,
  handleManualRefresh,
  loading,
  handleToggleRightView,
  kickoutStudent,
  rightView,
  studentList,
  handleResetViewAndShare,
  handleViewStudentData,
  handleShareStudentData,
  viewedStudent,
  sharedStudent,
  handlePageChange,
  removing,
  sectionTitle,
  emptyMessage,
  setRecordPrevPage,
  recordPrevPage
}: IRosterSectionProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);

  const userLanguage = gContext.userLanguage;

  const {lessonPlannerDict} = useDictionary();

  const removeInactiveStudents = (studentList: any[]) => {
    return studentList.filter(
      (student) =>
        student && student.person && student.person.status !== PersonStatus.INACTIVE
    );
  };

  const activeStudentList = removeInactiveStudents(studentList);

  // ~~~~~~~~~ MINIMIZE / ANIMATION ~~~~~~~~ //
  const listRef = useRef();

  const [minimized, setMinimized] = useState<boolean>(false);

  const rollUpAnimation = (ref: React.MutableRefObject<any>) => {
    setMinimized(true);
    gsap.to(ref.current, {
      height: '0%',
      opacity: 0,
      duration: 0.15,
      ease: 'easeInOut'
    });
  };

  const rollDownAnimation = (ref: React.MutableRefObject<any>) => {
    setMinimized(false);
    gsap.to(ref.current, {
      height: 'auto',
      opacity: 1,
      duration: 0.15,
      ease: 'easeInOut'
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
      <div className={`w-full flex items-center bg-transparent mt-4 mb-2 px-4`}>
        <div className="relative w-full h-auto flex flex-row items-center">
          <div className="text-sm flex font-semibold text-gray-600">
            <p className="w-auto">
              {sectionTitle} ({activeStudentList.length})
            </p>
            {hot && (
              <span
                title="refresh list"
                className={`w-auto cursor-pointer iconoclast:text-500 curate:text-500 rounded-full ml-2 iconoclast:bg-100 curate:bg-100 p-0.5`}
                onClick={handleManualRefresh}>
                <IoMdRefresh
                  size={20}
                  className={`${loading ? 'animate-spin' : null} `}
                />
              </span>
            )}
          </div>
          <span
            className="text-sm font-bold w-auto text-gray-600 cursor-pointer p-2"
            onClick={() =>
              toggleAnimation(minimized, listRef, rollDownAnimation, rollUpAnimation)
            }>
            {minimized ? <GoChevronUp size={'1rem'} /> : <GoChevronDown size={'1rem'} />}
          </span>
        </div>
      </div>

      {/* ROSTER HEAD LABELS*/}
      {hot && (
        <div className={`theme-text w-full flex py-2 bg-transparent px-4`}>
          <div className={`w-4/10  relative flex items-center  text-xs`}>
            <span className="w-auto">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['ONE']}
            </span>
          </div>
          <div
            className={`w-3/10 flex items-center justify-center rounded-lg text-center text-xs`}>
            <span className="w-auto">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['TWO']}
            </span>
          </div>
          <div
            className={`w-2.5/10 -ml-6 flex items-center justify-center rounded-lg text-center text-xs`}>
            <span className="w-auto">
              {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['THREE']}
            </span>
          </div>
        </div>
      )}

      <div
        ref={listRef}
        className={`w-full flex flex-col items-center ${
          activeStudentList.length > 0 ? 'border-b-0 border-gray-300' : ''
        }`}>
        {activeStudentList && activeStudentList.length > 0 ? (
          activeStudentList.map(
            (student: any, key: number) =>
              student && (
                <RosterRow
                  key={`rosterrow_inactive_${key}`}
                  number={key}
                  kickoutStudent={kickoutStudent}
                  personEmail={student.person.email}
                  personAuthID={student.personAuthID}
                  firstName={student.person?.firstName ? student.person?.firstName : ''}
                  lastName={student.person?.lastName ? student.person?.lastName : ''}
                  preferredName={
                    student.person?.preferredName ? student.person?.preferredName : ''
                  }
                  removing={removing}
                  setRecordPrevPage={setRecordPrevPage}
                  recordPrevPage={recordPrevPage}
                  onDemand={student.person.onDemand}
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
                  hot={hot}
                />
              )
          )
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
