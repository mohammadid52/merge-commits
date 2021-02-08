import React, { useContext, useEffect, useState } from 'react';
import { SideMenuProps } from '../Dashboard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import { getArrayOfUniqueValueByProperty } from '../../../utilities/arrays';
import { createFilterToFetchSpecificItemsOnly } from '../../../utilities/strings';

interface Room {
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
    setActiveRoomName,
    lessonLoading,
    setLessonLoading,
    syllabusLoading,
    setSyllabusLoading,
  } = props;
  const { state, theme, dispatch } = useContext(GlobalContext);
  // Fetching results
  const [classIds, setClassIds] = useState<string[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [curriculumIds, setCurriculumIds] = useState<string[]>([]);
  const [syllabusId, setSyllabusId] = useState<string[]>([]);
  // Menu state
  const [loaded, setLoaded] = useState<boolean>(false);
  // const [activeRoom, setActiveRoom] = useState<string>('');

  useEffect(() => {
    const listClassStudents = async () => {
      const standardUserID = state.user.id;
      const userAuthID = state.user.authId;
      const userRole = state.user.role;

      if (userRole === 'STD') {
        try {
          const classesFetch: any = await API.graphql(
            graphqlOperation(customQueries.listClassStudents, { studentID: standardUserID })
          );
          const response = await classesFetch;
          const arrayOfResponseObjects = response?.data?.listClassStudents?.items;
          const arrayOfClassIDs = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'classID');
          setClassIds(arrayOfClassIDs);
          console.log('1 -> ', arrayOfClassIDs);
        } catch (e) {
          console.error('Classes Fetch ERR: ', e);
        }
      }

      if(userRole === 'FLW'){
        try {
          const classIdFromRoomsFetch: any = await API.graphql(
            graphqlOperation(customQueries.listRooms, { teacherAuthId: userAuthID })
          );
          const response = await classIdFromRoomsFetch;
          const arrayOfResponseObjects = response?.data?.listRooms?.items;
          const arrayOfClassIDs = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'classID');
          setClassIds(arrayOfClassIDs);
          console.log('1 -> ', arrayOfClassIDs);
        } catch (e) {
          console.error('Classes Fetch ERR: ', e);
        }
      }
    };
    listClassStudents();
  }, []);

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
          console.log('2 --> ', arrayOfResponseObjects)
        } catch (e) {
          console.error('Rooms Fetch ERR: ', e);
        } finally {
          setLoaded(true);
        }
      }
    };
      listRooms();
  }, [classIds]);

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
          console.log('3 --> ', arrayOfCurriculumIds)
        } catch (e) {
          console.error('RoomCurriculums fetch ERR: ', e);
        }
      }
    };
    listRoomCurriculums();
  }, [activeRoom]);

  /**
   * LISTSYLLABUS SHOULD ONLY BE DONE FOR TEACHER
   */
  useEffect(() => {
    const listSyllabus = async () => {
      if (curriculumIds.length > 0) {
        try {
          const syllabusMultiFetch: any = API.graphql(
            graphqlOperation(customQueries.listSyllabuss, {
              filter: { ...createFilterToFetchSpecificItemsOnly(curriculumIds, 'curriculumID') },
            })
          );
          const response = await syllabusMultiFetch;
          const arrayOfResponseObjects = response?.data?.listSyllabuss?.items;

          /**
           * mappedResponseObjects explanation:
           *   the activeSyllabusAll reduce loops over all the rooms in the array of room objects
           *    IF the activeSyllabus property which comes from the database, is set with a string ->
           *    return that string.
           *      SO if any rooms come from the database with activeSyllabus ID's, the context will
           *      show this
           *      OTHERWISE no syllabus will be active on mount
           */
          const mappedResponseObjects = arrayOfResponseObjects.map((responseObject: any) => {
            const activeSyllabusAll = rooms.reduce((acc: string[], room: any) => {
              if (room.activeSyllabus !== null) {
                return [...acc, room.activeSyllabus];
              } else {
                return acc;
              }
            }, []);
            if (activeSyllabusAll.includes(responseObject.id)) {
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

    if (currentPage === 'lesson-planner') {
      listSyllabus();
    }
  }, [curriculumIds]);

  useEffect(() => {
    const listSyllabusLessons = async () => {
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

      const getActiveSyllabus = currentPage === 'lesson-planner' ? lessonPlannerSyllabus : classRoomActiveSyllabus;
      /**
       * IF there are any syllabus active, do a fetch for lessons
       */
      if (getActiveSyllabus.length > 0) {
        try {
          // console.log('attempting fetch of listSyllabusLessons :: ', getActiveSyllabus[0].id)
          const syllabusLessonFetch: any = API.graphql(
            graphqlOperation(customQueries.listSyllabusLessons, {
              syllabusID: getActiveSyllabus[0].id,
            })
          );
          const response = await syllabusLessonFetch;
          const arrayOfResponseObjects = response?.data?.listSyllabusLessons?.items;

          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'lessons',
              data: arrayOfResponseObjects,
            },
          });
        } catch (e) {
          console.error('syllabus lessons: ', e);
        } finally {
          setLessonLoading(false);
        }
      }
    };

    listSyllabusLessons();

    // TODO: update listener below for activeRoom state
  }, [curriculumIds, state.roomData.syllabus]);

  const handleRoomSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const name = t.getAttribute('data-name');
    if (activeRoom !== t.id) {
      setActiveRoom(t.id);
      setActiveRoomName(name);
      setSyllabusLoading(true); // Trigger loading ui element
      setLessonLoading(true);
    }
  };


  const linkClass = 'w-full text-xs tracking-wider mx-auto p-2 bg-white';

  return (
    <div className={`${theme.sidemenu.secondary} mr-2`}>
      {rooms.length > 0 ? (
        rooms.map((room: Room, i: number) => {
          return (
            <div
              key={`room_button_sb${i}`}
              id={room.id}
              data-name={room.name}
              onClick={handleRoomSelection}
              className={`cursor-pointer ${linkClass} ${
                activeRoom === room.id
                  ? 'border border-blueberry border-opacity-80'
                  : 'border border-dark-gray border-opacity-10'
              } truncate ...`}>
              {room.name}
            </div>
          );
        })
      ) : loaded === false ? (
        <>
          <p className={`${linkClass}`}>Loading rooms...</p>
        </>
      ) : (
        <>
          <p className={`${linkClass}`}>No available rooms.</p>
        </>
      )}
    </div>
  );
};

export default SideRoomSelector;
