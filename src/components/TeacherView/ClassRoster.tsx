import React, { useState, useContext, useEffect } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoMdRefresh } from 'react-icons/io';

import { LessonControlContext } from '../../contexts/LessonControlContext';
import useDictionary from '../../customHooks/dictionary';
import { GlobalContext } from '../../contexts/GlobalContext';

import RosterRow from './ClassRoster/RosterRow';

import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions';

/**
 * Function imports
 */
import { lc } from '../../utilities/strings';
import API, { graphqlOperation } from '@aws-amplify/api';
import exp from 'constants';
import { useCookies } from 'react-cookie';
import { getClass } from '../../graphql/queries';

interface classRosterProps {
  handleUpdateSyllabusLesson: () => Promise<void>;
  handleShareStudentData: () => Promise<void>;
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
  handlePageChange?: any;
}

enum SortByEnum {
  FNAME = 'firstName',
  PAGE = 'lessonProgress',
  ACTION = 'action',
}

const ClassRoster = (props: classRosterProps) => {
  // Essentials
  const {
    handleUpdateSyllabusLesson,
    handleShareStudentData,
    isSameStudentShared,
    handleQuitShare,
    handleQuitViewing,
    handlePageChange,
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const { clientKey, userLanguage } = useContext(GlobalContext);
  const { lessonPlannerDict } = useDictionary(clientKey);

  const [cookies] = useCookies(['room_info']);

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Roster related
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [personLocationStudents, setPersonLocationStudents] = useState<any[]>([]);
  const [updatedStudent, setUpdatedStudent] = useState<any>({});
  const [viewedStudent, setViewedStudent] = useState<string>('');

  let subscription: any;

  // Load students from the class associated with the current Room,
  // with this we'll be able to compared which students are online/offline
  const getClassStudents = async (cookieClassID: string) => {
    try {
      const classStudents: any = await API.graphql(
        graphqlOperation(queries.listClassStudents, {
          filter: { classID: { contains: cookieClassID } },
        })
      );
      const classStudentList = classStudents.data.listClassStudents.items;
      const initClassStudentList = classStudentList.map((student: any, i: number) => {
        return {
          id: '',
          personAuthID: student.studentAuthID,
          personEmail: student.studentEmail,
          syllabusLessonID: '',
          roomID: '',
          currentLocation: '',
          lessonProgress: '',
          person: student.student,
          syllabusLesson: {},
          room: '',
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
          saveType: '',
        };
      });
      setClassStudents(initClassStudentList);
      // dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: initClassStudentList } });
    } catch (e) {
      console.error('getClassStudents - ', e);
    }
  };

  useEffect(() => {
    if (cookies['room_info']) {
      const roomInfoCookie = cookies['room_info'];
      if (Object.keys(roomInfoCookie).length > 0 && roomInfoCookie.hasOwnProperty('classID')) {
        getClassStudents(roomInfoCookie['classID']);
      }
    }
  }, [cookies]);

  // load students from PersonLocation -> syllabusLessonID into roster
  const getSyllabusLessonStudents = async () => {
    setLoading(true);
    try {
      const syllabusLessonStudents: any = await API.graphql(
        graphqlOperation(queries.listPersonLocations, {
          filter: { syllabusLessonID: { contains: state.syllabusLessonID } },
        })
      );
      const syllabusLessonStudentList = syllabusLessonStudents.data.listPersonLocations.items;
      setPersonLocationStudents(syllabusLessonStudentList);
      dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: syllabusLessonStudentList } });
      subscription = subscribeToPersonLocations();
    } catch (e) {
      console.error('getSyllabusLessonstudents - ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.syllabusLessonID && state.roster.length === 0) {
      getSyllabusLessonStudents();
    }
  }, [state.syllabusLessonID]);

  // Subscriptions and updating
  const subscribeToPersonLocations = () => {
    const syllabusLessonID = state.syllabusLessonID;
    // @ts-ignore
    const personLocationSubscription = API.graphql(
      graphqlOperation(subscriptions.onChangePersonLocation, { syllabusLessonID: syllabusLessonID })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onChangePersonLocation;

        console.log('new location: ', updatedStudent);
        setUpdatedStudent(updatedStudent);
      },
    });
    return personLocationSubscription;
  };

  //

  // Update the student roster
  useEffect(() => {
    console.log('current location: ', state.studentViewing?.studentInfo?.currentLocation);
    const updateStudentRoster = (newStudent: any) => {
      const studentExists =
        personLocationStudents.filter((student: any) => student.personAuthID === newStudent.personAuthID).length > 0;

      if (studentExists) {
        // console.log('student exists YES', ' --> update loc')
        const existRoster = personLocationStudents.map((student: any) => {
          if (student.personAuthID === newStudent.personAuthID) {
            return { ...student, currentLocation: newStudent.currentLocation };
          } else {
            return student;
          }
        });
        setPersonLocationStudents(existRoster);
        dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: existRoster } });
        setUpdatedStudent({});
      } else {
        // console.log('student exists NO', ' --> update loc')
        const newRoster = [...personLocationStudents, newStudent];
        setPersonLocationStudents(newRoster);
        dispatch({ type: 'UPDATE_STUDENT_ROSTER', payload: { students: newRoster } });
        setUpdatedStudent({});
      }
    };
    if (Object.keys(updatedStudent).length) {
      updateStudentRoster(updatedStudent);
    }
  }, [updatedStudent]);

  const handleSelect = async (e: any) => {
    const { id } = e.target;
    const selected = state.roster.filter((student: any) => {
      return student.personAuthID === id;
    });

    // console.log('row ID : ', id)
    setViewedStudent(id);
    dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] });
  };

  const handleManualRefresh = () => {
    if (loading === false) {
      getSyllabusLessonStudents();
    }
  };

  const inactiveStudents = classStudents.filter((student: any) => {
    const isInStateRoster = state.roster.find(
      (studentTarget: any) => studentTarget.personAuthID === student.personAuthID
    );
    if (isInStateRoster === undefined) {
      return student;
    }
  });

  return (
    <div className={`w-full h-full bg-light-gray bg-opacity-20 overflow-y-auto overflow-x-hidden`}>
      {/* TABLE HEAD */}
      <div className={`w-full h-8 flex py-2 pl-2 pr-1 text-white bg-darker-gray bg-opacity-40`}>
        <div className={`w-3.5/10 relative mx-2 flex items-center hover:underline cursor-pointer text-xs`}>
          <span>{lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['ONE']}</span>
          <span className={`w-auto absolute right-0 translate-x-4`} onClick={handleManualRefresh}>
            <IconContext.Provider value={{ color: '#EDF2F7' }}>
              <IoMdRefresh size={28} className={`${loading ? 'animate-spin' : null}`} />
            </IconContext.Provider>
          </span>
        </div>
        <div className={`w-3.5/10 mx-2 flex items-center overflow-hidden text-center text-xs `}>
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['TWO']}
        </div>
        <div className={`w-2/10 mx-2 flex items-center justify-center rounded-lg text-xs`}>
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['THREE']}
        </div>
      </div>

      {/* ROWS */}
      <div className={`w-full flex flex-col items-center`}>
        {state.roster.length > 0 ? (
          <div className={`w-full pl-4 text-xs font-semibold text-white bg-medium-gray bg-opacity-20`}>
            {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION']['IN_CLASS']}
          </div>
        ) : null}

        {/* STUDENTS - Active */}
        {state.roster.length > 0
          ? state.roster.map((student: any, key: number) => (
              <RosterRow
                key={key}
                keyProp={key}
                number={key}
                id={student.personAuthID}
                active={true}
                firstName={student.person.firstName}
                lastName={student.person.lastName}
                preferredName={student.person.preferredName}
                role={student.person.role}
                currentLocation={student.currentLocation}
                lessonProgress={student.lessonProgress}
                handleSelect={handleSelect}
                handleShareStudentData={handleShareStudentData}
                handleQuitShare={handleQuitShare}
                handleQuitViewing={handleQuitViewing}
                viewedStudent={viewedStudent}
                setViewedStudent={setViewedStudent}
                isSameStudentShared={isSameStudentShared}
                handlePageChange={handlePageChange}
              />
            ))
          : null}

        {/* STUDENTS - INActive */}
        {inactiveStudents.length > 0 ? (
          <div className={`w-full pl-4 text-xs font-semibold text-white bg-medium-gray bg-opacity-20`}>
            {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION']['NOT_IN_CLASS']}
          </div>
        ) : null}
        {inactiveStudents.length > 0
          ? inactiveStudents.map((student: any, key: number) => (
              <RosterRow
                key={key}
                keyProp={key}
                number={key}
                id={student.personAuthID}
                active={false}
                firstName={student.person.firstName}
                lastName={student.person.lastName}
                preferredName={student.person.preferredName}
                role={student.person.role}
                currentLocation={student.currentLocation}
                lessonProgress={student.lessonProgress}
                handleSelect={handleSelect}
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
