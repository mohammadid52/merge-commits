import React, { useState, useContext, useEffect } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { studentObject } from '../../state/LessonControlState';
import ProgressSwitch from '../General/LessonProgressSwitch';
import ToolTip from '../General/ToolTip/ToolTip';
import RosterRow from './ClassRoster/RosterRow';

import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions';

/**
 * Function imports
 */
import { lc } from '../../utilities/strings';
import API, { graphqlOperation } from '@aws-amplify/api';
import exp from 'constants';

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
  const [updatedStudent, setUpdatedStudent] = useState<any[]>([]);
  const [viewedStudent, setViewedStudent] = useState<string>('');

  const [refreshRoster, setRefreshRoster] = useState<any>();

  let subscription: any;

  // load students into roster
  const getSyllabusLessonStudents = async () => {
    try {
      const syllabusLessonStudents: any = await API.graphql(
        graphqlOperation(queries.listPersonLocations, {
          filter: { syllabusLessonID: { contains: state.syllabusLessonID } },
        })
      );
      const studentList = syllabusLessonStudents.data.listPersonLocations.items;
      setStudents(studentList);
      dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: studentList } });
      subscription = subscribeToPersonLocations();
    } catch (e) {
      console.error('getSyllabusLessonstudents - ', e);
    }
  };

  // Set refresh timer on mount
  useEffect(() => {
    if (state.roster.length === 0) {
      console.log('interval for roster refresh set at 5s...');
      setRefreshRoster(
        setInterval(() => {
          console.log('update roster...')
          getSyllabusLessonStudents();
        }, 5000)
      );
    }
  }, []);

  // Clear refresh timer if there are students
  useEffect(() => {
    if (state.roster.length > 0) {
      clearInterval(refreshRoster);
      console.log('interval for roster refresh cleared...');
    }
  }, [state.roster]);

  useEffect(() => {
    if (state.syllabusLessonID && state.roster.length === 0) {
      getSyllabusLessonStudents();
    }
  }, [state.syllabusLessonID]);

  const subscribeToPersonLocations = () => {
    const syllabusLessonID = state.syllabusLessonID;
    // @ts-ignore
    const personLocationSubscription = API.graphql( graphqlOperation(subscriptions.onChangePersonLocation, { syllabusLessonID: syllabusLessonID }) ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onChangePersonLocation;
        setUpdatedStudent(updatedStudent);
      },
    });
    return personLocationSubscription;
  };

  useEffect(() => {
    const updateStudentRoster = (newStudent: any) => {
      const studentExists =
        students.filter((student: any) => student.personAuthID === newStudent.personAuthID).length > 0;

      if (studentExists) {
        const existRoster = students.map((student: any) => {
          if (student.personAuthID === newStudent.personAuthID) {
            return { ...student, currentLocation: newStudent.currentLocation };
          } else {
            return student;
          }
        });
        // console.log('exist roster: ', existRoster);
        setStudents(existRoster);
        dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: existRoster } });
      } else {
        const newRoster = [...students, newStudent];
        // console.log('new roster: ', newRoster);
        setStudents(newRoster);
        dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: newRoster } });
      }
    };
    if (students.length > 0) {
      updateStudentRoster(updatedStudent);
    }
  }, [updatedStudent]);

  const handleSelect = async (e: any) => {
    const { id } = e.target;
    const selected = state.roster.filter((student: any) => {
      return student.personAuthID === id;
    });

    setViewedStudent(id);
    dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] });
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
        {state.roster.length > 0
          ? state.roster.map((student: any, key: number) => (
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
                viewedStudent={viewedStudent}
                setViewedStudent={setViewedStudent}
                isSameStudentShared={isSameStudentShared}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default ClassRoster;
