import React, { useState, useContext, useEffect } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { studentObject } from '../../state/LessonControlState';
import ProgressSwitch from '../General/LessonProgressSwitch';
import ToolTip from '../General/ToolTip/ToolTip';
import RosterRow from './ClassRoster/RosterRow';

import * as queries from '../../graphql/queries';

/**
 * Function imports
 */
import { lc } from '../../utilities/strings';
import { API, graphqlOperation } from '@aws-amplify/api';

interface classRosterProps {
  handleUpdateSyllabusLesson: () => Promise<void>;
  handleShareStudentData: () => Promise<void>;
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
  setPageViewed: React.Dispatch<React.SetStateAction<object>>;
}

enum SortByEnum {
  FNAME = 'firstName',
  PAGE = 'lessonProgress',
  ACTION = 'action',
}

const ClassRoster = (props: classRosterProps) => {
  const {
    handleUpdateSyllabusLesson,
    handleShareStudentData,
    isSameStudentShared,
    handleQuitShare,
    handleQuitViewing,
    setPageViewed,
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const [sortBy, setSortBy] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);

  let subscription: any;

  useEffect(() => {
    // load students into roster
    const getSyllabusLessonStudents = async () => {
      const syllabusLessonStudents: any = await API.graphql(
        graphqlOperation(queries.listPersonLocations, {
          filter: { syllabusLessonID: { contains: state.syllabusLessonID } },
        })
      );
      console.log('students --- ', syllabusLessonStudents);
      const quickFix = syllabusLessonStudents.data.listPersonLocations.items.map((student: any) => {
        return {...student, currentLocation: getPageLabel(student.currentLocation)}
      })
      setStudents(quickFix)
    };
    if (state.syllabusLessonID) getSyllabusLessonStudents();
    // assign subscription
  }, [state.syllabusLessonID]);

  useEffect(() => {
    console.log(state.studentViewing);

    // if (state.studentViewing.studentInfo) {
    //     handleUpdateClassroom()
    // }
  }, [state.studentViewing]);

  /**
   * UPDATE THIS SORT FUNCTION TO SORT CONTEXT
   * @param column - which column you want sorted
   */
  const sortStudentBy = (column: string) => {
    const thereAreStudents = state.roster && state.roster.length > 0;

    if (thereAreStudents) {
      if (column === SortByEnum.FNAME) {
        return state.roster.sort((a: any, b: any) => {
          if (lc(a.student[column]) < lc(b.student[column])) {
            return -1;
          } else {
            return 1;
          }
        });
      }

      if (column === SortByEnum.PAGE) {
        return state.roster.sort((a: any, b: any) => {
          if (lc(a.lessonProgress) < lc(b.lessonProgress)) {
            return -1;
          } else {
            return 1;
          }
        });
      }

      if (column === SortByEnum.ACTION) {
        return state.roster.sort((a: any, b: any) => {
          if (a.lessonProgress.includes('breakdown') && b.lessonProgress.includes('breakdown') === false) {
            return -1;
          } else {
            return 1;
          }
        });
      }
    }
  };

  const studentRoster = () => {
    switch (sortBy) {
      case 'firstName':
        return sortStudentBy(SortByEnum.FNAME);
      case 'lessonProgress':
        return sortStudentBy(SortByEnum.PAGE);
      case 'action':
        return sortStudentBy(SortByEnum.ACTION);
      default:
        return students;
    }
  };

  const handleSelect = async (e: any) => {
    const { id } = e.target;
    const selected = students.filter((student: any) => {
      return student.personAuthID === id;
    });


    console.log('selected', id, selected[0]);
    dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] });
  };

  const initials = (lastName: string) => {
    let lastInitial = lastName.charAt(0).toUpperCase();
    return lastInitial + '.';
  };

  const studentStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <div className="flex justify-center items-center">
            <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-green-400"></span>
          </div>
        );
      case 'IDLE':
        return (
          <div className="flex justify-center items-center ">
            <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-yellow-400"></span>
          </div>
        );
      case 'OFFLINE':
        return (
          <div className="flex justify-center items-center ">
            <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-red-400"></span>
          </div>
        );
      default:
        return (
          <div className="flex justify-center items-center">
            <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400"></span>
          </div>
        );
    }
  };

    const getPageLabel = (locationIndex: string) => {
      return state.pages[parseInt(locationIndex)].stage
    }

  return (
    <div className={`w-full h-full bg-light-gray bg-opacity-20 overflow-y-auto overflow-x-hidden`}>
      {/* TABLE HEAD */}
      <div className={`w-full h-8 flex py-2 pl-2 pr-1 text-white bg-darker-gray bg-opacity-40`}>
        {/* <div className={`w-1/10 text-center text-xs flex`}></div> */}
        <div className={`w-3.5/10 overflow-hidden mx-2 flex items-center hover:underline cursor-pointer text-xs`}>
          Student Name
        </div>
        <div className={`w-3.5/10 mx-2 flex items-center overflow-hidden text-center text-xs `}>Current Page</div>
        <div className={`w-2/10 mx-2 flex items-center justify-center rounded-lg text-xs`}>Action</div>
      </div>

      {/* ROWS */}
      <div className={`w-full flex flex-col items-center`}>
        {/* STUDENTS */}
        {students.length > 0
          ? studentRoster().map((student: any, key: number) => (
              <React.Fragment key={`classroster_${key}`}>
                <RosterRow
                  key={key}
                  keyProp={key}
                  number={key}
                  id={student.personAuthID}
                  status={student.person.status}
                  firstName={student.person.firstName}
                  lastName={student.person.lastName}
                  preferredName={student.person.preferredName}
                  role={student.person.role}
                  currentLocation={student.currentLocation}
                  lessonProgress={student.lessonProgress}
                  handleSelect={handleSelect}
                  studentStatus={studentStatus}
                  handleShareStudentData={handleShareStudentData}
                  handleQuitShare={handleQuitShare}
                  handleQuitViewing={handleQuitViewing}
                  isSameStudentShared={isSameStudentShared}
                />
              </React.Fragment>
            ))
          : null}
      </div>
    </div>
  );
};

export default ClassRoster;
