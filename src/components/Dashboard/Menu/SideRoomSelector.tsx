import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { SideMenuProps } from '../Dashboard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import { getArrayOfUniqueValueByProperty } from '../../../utilities/arrays';
import { createFilterToFetchSpecificItemsOnly } from '../../../utilities/strings';
import useDictionary from '../../../customHooks/dictionary';
import * as queries from '../../../graphql/queries';
import { Syllabus } from '../Classroom/Classroom';

export interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

const SideRoomSelector = (props: SideMenuProps) => {
  // Essentials
  const {
    isTeacher,
    currentPage,
    setCurrentPage,
    activeRoom,
    setActiveRoom,
    setActiveRoomInfo,
    setActiveRoomName,
    lessonLoading,
    setLessonLoading,
    syllabusLoading,
    setSyllabusLoading,
    activeRoomSyllabus,
    setActiveRoomSyllabus,
  } = props;
  const { state, theme, dispatch, clientKey, userLanguage } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);

  // Cookie setting for transition to Student/Teacher
  const [cookies, setCookie, removeCookie] = useCookies(['room_info']);

  // Fetching results
  const [classIds, setClassIds] = useState<string[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [curriculumIds, setCurriculumIds] = useState<string[]>([]);
  const [syllabusLessonSequence, setSyllabusLessonSequence] = useState<string[]>(['']);
  // Menu state
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);

  /**
   * INIT ADMIN NOT LOADING ANYTHING
   */
  useEffect(() => {
    const userAuthID = state.user.authId;
    const userRole = state.user.role;
    if (userRole === 'ADM') {
      setRoomsLoading(true);
    }
  }, []);

  /**
   * INIT STUDENT ROOM
   */
  useEffect(() => {
    const standardUserID = state.user.id;
    const userRole = state.user.role;
    const listClassStudents = async () => {
      if (userRole === 'ST') {
        try {
          const classesFetch: any = await API.graphql(
            graphqlOperation(customQueries.listClassStudents, { studentID: standardUserID })
          );
          const response = await classesFetch;
          const arrayOfResponseObjects = response?.data?.listClassStudents?.items;
          const arrayOfClassIDs = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'classID');
          setClassIds(arrayOfClassIDs);
          // console.log('1 -> ', 'loadiung student rooms');
        } catch (e) {
          console.error('Classes Fetch ERR: ', e);
        }
      }
    };
    userRole === 'ST' && listClassStudents();
  }, []);

  /**
   * INIT TEACHER ROOM
   */
  useEffect(() => {
    const userAuthID = state.user.authId;
    const userRole = state.user.role;
    const listRoomTeacher = async () => {
      if (userRole === 'FLW' || userRole === 'TR') {
        try {
          const classIdFromRoomsFetch: any = await API.graphql(
            graphqlOperation(customQueries.listRooms, { filter: { teacherAuthID: { eq: userAuthID } } })
          );
          const response = await classIdFromRoomsFetch;
          const arrayOfResponseObjects = response?.data?.listRooms?.items;
          setRooms(arrayOfResponseObjects);
          // console.log('1 -> ', arrayOfResponseObjects);
          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'rooms',
              data: arrayOfResponseObjects,
            },
          });
        } catch (e) {
          console.error('Classes Fetch ERR: ', e);
        }
      }
    };
    (userRole === 'FLW' || userRole === 'TR') && listRoomTeacher();
  }, []);



  // Fetch widgets for current room & put in context
  useEffect(()=>{
    const listRoomWidgets = async() => {
      setWidgetLoading(true);
      //
      try {
        const noticeboardWidgetsFetch: any = await API.graphql(
          graphqlOperation(queries.listNoticeboardWidgets, { filter: { roomID: { eq: activeRoom } } })
        );
        const response = await noticeboardWidgetsFetch;
        const arrayOfResponseObjects = response?.data?.listNoticeboardWidgets?.items;
        dispatch({
          type: 'UPDATE_ROOM',
          payload: {
            property: 'widgets',
            data: arrayOfResponseObjects,
          },
        });
      } catch (e) {
        console.error('listNoticeboardWidgetsFetch: -> ', e);
      } finally {
        setWidgetLoading(false);
      }
    }
    if(activeRoom && widgetLoading === false){
      listRoomWidgets();
    }
  },[activeRoom])



  useEffect(() => {
    const userRole = state.user.role;

    const listRooms = async () => {
      if (classIds.length > 0) {
        try {
          const roomsFetch: any = await API.graphql(
            graphqlOperation(customQueries.listRooms, {
              filter: { ...createFilterToFetchSpecificItemsOnly(classIds, 'classID') },
            })
          );
          const response = await roomsFetch;
          const arrayOfResponseObjects = response?.data?.listRooms?.items;
          setRooms(arrayOfResponseObjects);
          // Dispatch to context
          // TODO: remove storage of rooms in SideRoomSelector.tsx
          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'rooms',
              data: arrayOfResponseObjects,
            },
          });
          // console.log('2 --> ', arrayOfResponseObjects);
        } catch (e) {
          console.error('Rooms Fetch ERR: ', e);
        } finally {
          setRoomsLoading(true);
        }
      }
    };
    userRole === 'ST' && listRooms();
  }, [classIds]);

  // List curriculums associated with selected room
  useEffect(() => {
    const listRoomCurriculums = async () => {
      if (rooms.length > 0 && activeRoom !== '') {
        try {
          const roomIds = getArrayOfUniqueValueByProperty(rooms, 'id');
          const roomCurriculumsFetch: any = API.graphql(
            graphqlOperation(customQueries.listRoomCurriculums, {
              filter: { roomID: { contains: activeRoom } },
            })
          );
          const response = await roomCurriculumsFetch;
          const arrayOfResponseObjects = response?.data?.listRoomCurriculums?.items;
          const arrayOfCurriculumIds = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'curriculumID');
          setCurriculumIds(arrayOfCurriculumIds);
          // console.log('3 --> ', arrayOfCurriculumIds);
        } catch (e) {
          console.error('RoomCurriculums fetch ERR: ', e);
        }
      }
    };
    listRoomCurriculums();
  }, [activeRoom]);



  // Save info of selected room to cookie
  useEffect(() => {
    const getRoomFromState = state.roomData.rooms.filter((room: any) => room.id === activeRoom);
    if (getRoomFromState.length === 1) {
      setCookie('room_info', getRoomFromState[0]);
      setActiveRoomInfo(getRoomFromState[0]);
    } else {
      setCookie('room_info', {});
    }
  }, [activeRoom]);

  /**
   * LISTSYLLABUS SHOULD ONLY BE DONE FOR TEACHER
   */
  useEffect(() => {
    const listSyllabus = async () => {
      if (curriculumIds.length > 0) {
        try {
          const syllabusCSequenceFetch: any = await API.graphql(graphqlOperation(queries.getCSequences,
            { id: `s_${curriculumIds[0]}` }))
          const syllabusMultiFetch: any = API.graphql(
            graphqlOperation(customQueries.listSyllabuss, {
              filter: { ...createFilterToFetchSpecificItemsOnly(curriculumIds, 'curriculumID') },
            })
          );

          const responseRoomSyllabusSequence = await syllabusCSequenceFetch;
          const responseRoomSyllabus = await syllabusMultiFetch;

          // console.log('responseRoomSyllabusSequence - = >', responseRoomSyllabusSequence)

          const arrayOfRoomSyllabusSequence = responseRoomSyllabusSequence?.data.getCSequences?.sequence;
          const arrayOfRoomSyllabus = responseRoomSyllabus?.data?.listSyllabuss?.items;

          // SOMETHING TO REFACTOR
          const roomSyllabusReordered = arrayOfRoomSyllabusSequence.reduce((acc: any[], syllabusID: string, idx: number) => {
            const matchedSyllabus = arrayOfRoomSyllabus.find((responseObj: any) => responseObj.id === syllabusID);
            if(matchedSyllabus){
              return [...acc, matchedSyllabus]
            } else {
              return acc;
            }
          },[])

          /**
           * mappedResponseObjects explanation:
           *   the activeSyllabusAll reduce loops over all the rooms in the array of room objects
           *    IF the activeSyllabus property which comes from the database, is set with a string ->
           *    return that string.
           *      SO if any rooms come from the database with activeSyllabus ID's, the context will
           *      show this
           *      OTHERWISE no syllabus will be active on mount
           */
          const mappedResponseObjects = roomSyllabusReordered.map((responseObject: any, idx: number) => {
            // const activeSyllabusAll = rooms.reduce((acc: any[], room: any, idx2: number) => {
            //   return { ...acc, [room.id]: room.activeSyllabus };
            // }, []);

            if (activeRoomSyllabus === responseObject.id) {
              return { ...responseObject, active: true };
            } else {
              return { ...responseObject, active: false };
            }
          });

          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'syllabus',
              data: mappedResponseObjects,
            },
          });

          setSyllabusLoading(false);
        } catch (e) {
          console.error('Curriculum ids ERR: ', e);
        }
      }
    };

    // if (currentPage === 'lesson-planner') {
      listSyllabus();
    // }
  }, [curriculumIds]);



  const getSyllabusLessonCSequence = async (syllabusID: string) => {
    try {
      const syllabusLessonCSequenceFetch: any = await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `lesson_${syllabusID}` }))
      const response = await syllabusLessonCSequenceFetch;
      const arrayOfResponseObjects = response?.data.getCSequences?.sequence;
      setSyllabusLessonSequence(arrayOfResponseObjects);
    } catch(e){
      console.error('getSyllabusLessonCSequence -> ',e)
    }
  }


  const listSyllabusLessons = async (lessonPlannerSyllabus: any, classRoomActiveSyllabus: any) => {
    /**
     * getActiveSyllabus explanation:
     *  IF we're on the lesson-planner page, that means the teacher has the ability to activate
     *  a syllabus
     *    SO the first filter will return an array with max length 1 if any syllabus for that room are active
     *    BUT it will return array with length 0 if no syllabus for that room are active
     *  IF we're on the classroom page, multiple syllabus will not be loaded
     *    SO the room objects in room array should contain an activeSyllabus property
     *    THEREFORE if there is an active syllabus, this filter will return a string OR []
     *  FINALLY if there are no active syllabus anywhere, return empty array
     */

    const getActiveSyllabus = currentPage === 'lesson-planner' ? lessonPlannerSyllabus : classRoomActiveSyllabus;
    /**
     * IF there are any syllabus active, do a fetch for lessons
     */
    if (getActiveSyllabus.length > 0) {
      try {
        const syllabusLessonFetch: any = API.graphql(
          graphqlOperation(customQueries.listSyllabusLessons, {
            syllabusID: getActiveSyllabus[0].id,
          })
        );
        const response = await syllabusLessonFetch;
        const arrayOfResponseObjects = response?.data?.listSyllabusLessons?.items;
        // SOMETHING TO REFACTOR
        const syllabusLessonsReordered = syllabusLessonSequence.reduce((acc: any[], syllabusLessonID: string, idx: number) => {
          const matchedLesson = arrayOfResponseObjects.find((responseObj: any) => responseObj.id === syllabusLessonID);
          if(matchedLesson){
            return [...acc, matchedLesson]
          } else {
            return acc;
          }
        },[])

        dispatch({
          type: 'UPDATE_ROOM',
          payload: {
            property: 'lessons',
            data: syllabusLessonsReordered,
          },
        });
      } catch (e) {
        console.error('syllabus lessons: ', e);
      } finally {
        setLessonLoading(false);
      }
    }
  };


  const lessonPlannerSyllabus =
    state.roomData.syllabus.length > 0
      ? state.roomData.syllabus.filter((syllabusObject: any) => {
        if (syllabusObject.hasOwnProperty('active') && syllabusObject.active) {
          return syllabusObject;
        }
      })
      : [];

  const classRoomActiveSyllabus = rooms
    .filter((room: any) => room.id === activeRoom)
    .map((room: any) => {
      return { id: room.activeSyllabus };
    });


  useEffect(()=>{
    const getSyllabusLessonsAndCSequence = async () =>{
      await getSyllabusLessonCSequence(classRoomActiveSyllabus[0].id);
    }

    if(
      state.roomData.syllabus &&
      state.roomData.syllabus.length > 0
    ){
      getSyllabusLessonsAndCSequence();
    }
  },[state.roomData.syllabus])




  useEffect(()=>{
    if(
      syllabusLessonSequence.length > 0
    ){
      listSyllabusLessons(lessonPlannerSyllabus, classRoomActiveSyllabus);
    }
  },[syllabusLessonSequence])


  const handleRoomSelection = (e: React.MouseEvent, i: number) => {
    const t = e.target as HTMLElement;
    const name = t.getAttribute('data-name');
    if (activeRoom !== t.id) {
      setActiveRoom(t.id);
      setActiveRoomName(name);
      setSyllabusLoading(true); // Trigger loading ui element
      setLessonLoading(true);
      setActiveRoomSyllabus(state.roomData.rooms[i].activeSyllabus);
    }
  };

  const roomsTitle =
    'h-12 p-2 font-semibold text-grayscale-lightest flex items-center justify-start bg-darker-gray bg-opacity-60';
  const linkClass = 'w-full p-2 text-grayscale-lightest text-xs tracking-wider mx-auto border-b border-medium-gray';

  return (
    <div className={`${theme.sidemenu.secondary} mr-2`}>
      <div className={roomsTitle}>{classRoomDict[userLanguage]['LIST_TITLE']}:</div>
      {rooms.length > 0 ? (
        rooms.map((room: Room, i: number) => {
          return (
            <div
              key={`room_button_sb${i}`}
              id={room.id}
              data-name={room.name}
              onClick={(e) => handleRoomSelection(e, i)}
              className={`cursor-pointer ${linkClass} 
              ${activeRoom === room.id ? 'bg-grayscale-light bg-opacity-80' : 'bg-darker-gray bg-opacity-20'} 
              truncate ...`}>
              {room.name}
            </div>
          );
        })
      ) : roomsLoading === false ? (
        <>
          <p className={`${linkClass}`}>Loading {classRoomDict[userLanguage]['LIST_TITLE']}...</p>
        </>
      ) : (
        <>
          <p className={`${linkClass}`}>No {classRoomDict[userLanguage]['LIST_TITLE']} assigned to user</p>
        </>
      )}
    </div>
  );
};

export default SideRoomSelector;
