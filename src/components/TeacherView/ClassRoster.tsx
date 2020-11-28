import React, { useContext, useEffect } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { studentObject } from '../../state/LessonControlState';
import ProgressSwitch from '../General/LessonProgressSwitch';
import ToolTip from '../General/ToolTip/ToolTip';
import RosterRow from './ClassRoster/RosterRow';

interface classRosterProps {
  handleUpdateClassroom: () => Promise<void>;
  handleShareStudentData: () => Promise<void>;
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
}

const ClassRoster = (props: classRosterProps) => {
  const { handleUpdateClassroom, handleShareStudentData, isSameStudentShared, handleQuitShare, handleQuitViewing } = props;
  const { state, dispatch } = useContext(LessonControlContext);

  // console.log(state.roster)

  const handleSelect = async (e: any) => {
    const { id } = e.target;
    const selected = state.roster.filter((item: any) => {
      return item.id === id;
    });

    // console.log('selected', id, selected[0]);
    dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] });
  };

  const initials = (lastName: string) => {
    let lastInitial = lastName.charAt(0).toUpperCase();
    return lastInitial + '.';
  };

  useEffect(() => {
    console.log(state.studentViewing);

    // if (state.studentViewing.studentInfo) {
    //     handleUpdateClassroom()
    // }
  }, [state.studentViewing]);

  const studentStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <div className='flex justify-center items-center'>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-green-400'></span>
          </div>
        );
      case 'IDLE':
        return (
          <div className='flex justify-center items-center '>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-yellow-400'></span>
          </div>
        );
      case 'OFFLINE':
        return (
          <div className='flex justify-center items-center '>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-red-400'></span>
          </div>
        );
      default:
        return (
          <div className='flex justify-center items-center'>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400'></span>
          </div>
        );
    }
  };

  return (
    <div
      className={`w-full h-full bg-gray-500 overflow-y-auto overflow-x-hidden border-r-2 border-t-2 border-black`}>
      {/* TABLE HEAD */}
      <div className={`w-full h-8 flex py-2 pl-2 pr-1 text-white bg-darker-gray bg-opacity-80`}>
        <div className={`w-1/10 text-center text-xs flex`}></div>
        <div className={`w-3.5/10 overflow-hidden mx-2 flex items-center hover:underline cursor-pointer text-sm`}>Students <span className='font-bold'>( {state.roster.length} )</span></div>
        <div className={`w-3.5/10 mx-2 flex justify-center items-center overflow-hidden text-sm text-center`}>Page</div>
        <div className={`w-2/10 mx-2 flex items-center justify-center rounded-lg text-sm`}>Action</div>
      </div>

      {/* ROWS */}
      <div className={`w-full flex flex-col items-center`}>
        {/* STUDENTS */}
        {state.roster && state.roster.length > 0
          ? state.roster.map((item: any, key: number) => (
            <>
            <RosterRow
              key={key}
              keyProp={key}
              number={key}
              id={item.id}
              status={item.status}
              firstName={item.student.firstName}
              lastName={item.student.lastName}
              preferredName={item.student.preferredName}
              role={item.student.role}
              currentLocation={item.currentLocation}
              lessonProgress={item.lessonProgress}
              handleSelect={handleSelect}
              studentStatus={studentStatus}
              handleShareStudentData={handleShareStudentData}
              handleQuitShare={handleQuitShare}
              handleQuitViewing={handleQuitViewing}
              isSameStudentShared={isSameStudentShared}
            />
          </>
            ))
          : null}
      </div>
    </div>
  );
};

export default ClassRoster;
