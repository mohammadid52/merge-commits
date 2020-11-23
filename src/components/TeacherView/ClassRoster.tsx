import React, { useContext, useEffect } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { studentObject } from '../../state/LessonControlState';
import ProgressSwitch from '../General/LessonProgressSwitch';
import ToolTip from '../General/ToolTip/ToolTip';
import RosterRow from './ClassRoster/RosterRow';

interface ClassRosterProps {
  handleUpdateClassroom: () => Promise<void>;
  handleShareStudentData: () => void;
  isSameStudentShared: boolean;
}

const ClassRoster = (props: ClassRosterProps) => {
  const { handleUpdateClassroom, handleShareStudentData, isSameStudentShared } = props;
  const { state, dispatch } = useContext(LessonControlContext);

  /**
   * JASPER's GLORIOUS SORTING FUNCTION :D
   */
  const sortedRoster = state.roster.sort((a: any, b: any) => {
    if (a.student.role > b.student.role) {
      if (a.student.role !== 'ST') {
        return -1;
      } else {
        return 1;
      }
    }
    if (a.student.role < b.student.role) {
      if (b.student.role !== 'ST') {
        return 1;
      } else {
        return -1;
      }
    }
  });

  /**
   * ALL I WANTS IS THE STUDENTS || non-STUDENTS FROM THE ROSTER
   */
  const studentRoster = state.roster.filter((entry: any) => {
    return entry.student.role === 'ST';
  });

  const nonStudentRoster = state.roster.filter((entry: any) => {
    return entry.student.role !== 'ST';
  });

  useEffect(() => {
    console.log(' sorted : ', sortedRoster);
  }, []);

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
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-green-400 border border-white'></span>
          </div>
        );
      case 'IDLE':
        return (
          <div className='flex justify-center items-center '>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-yellow-400 border border-dark-gray'></span>
          </div>
        );
      case 'OFFLINE':
        return (
          <div className='flex justify-center items-center '>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-red-400 border border-dark-gray'></span>
          </div>
        );
      default:
        return (
          <div className='flex justify-center items-center'>
            <span className='inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400 border border-dark-gray'></span>
          </div>
        );
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col bg-dark-gray bg-opacity-20 border border-dark-gray rounded-lg overflow-y-scroll overflow-x-auto`}>
      {/* TABLE HEAD */}
      <div
        className={`w-full flex justify-center font-medium py-3 pl-4 pr-1 bg-dark-gray bg-opacity-40`}>
        <div className={`w-.5/10 mx-2 text-center`}></div>
        <div className={`w-4.3/10 mx-2`}>Name</div>
        <div className={`w-3.5/10 mx-2`}>Page</div>
        <div className={`w-1.5/10 mx-2`}>Action</div>
      </div>

      {/* ROWS */}
      <div className={`w-full flex flex-col items-center bg-dark-gray bg-opacity-20`}>
        {/* STUDENTS */}
        {state.roster && state.roster.length > 0
          ? studentRoster.map((item: any, key: number) => (
              <>
                <RosterRow
                  key={key}
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
                />
              </>
            ))
          : null}
      </div>

      <div className={`w-full flex flex-col items-center mt-auto mb-0 text-xs`}>
        <span>Non-students logged in: </span>
        {/* non-STUDENTS */}
          {
            state.roster && state.roster.length > 0
            ? nonStudentRoster.reduce((acc: string, elem: any, i: number )=>{
              return acc + `${elem.student.firstName} ${elem.student.lastName} (${elem.student.role})${i !== nonStudentRoster.length-1 ? ',' : ''} `
            },'')
            : null
          }
      </div>
    </div>
  );
};

export default ClassRoster;
