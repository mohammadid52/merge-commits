import React, {useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';

import {ClassroomControlProps} from '../Dashboard';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {API, graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import {getArrayOfUniqueValueByProperty} from '../../../utilities/arrays';
import {createFilterToFetchSpecificItemsOnly} from '../../../utilities/strings';
import useDictionary from '../../../customHooks/dictionary';
import * as queries from '../../../graphql/queries';
import Home from '../Home/Home';
import SideRoomSelector from '../Menu/SideRoomSelector';

export interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

const ClassroomControl = (props: ClassroomControlProps) => {
  // Essentials
  const {
    isHomescreen,
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
  const [homeData, setHomeData] = useState<{ class: any }[]>();
  const [classList, setClassList] = useState<any[]>();

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
    const userRole = state.user.role;
    if (userRole === 'ADM') {
      setRoomsLoading(true);
    }
  }, []);

  /******************************************
   * 1.1 PROCESS STUDENT ROOM FETCHING      *
   ******************************************/
  const getDashboardData = async (authId: string, email: string) => {
    try {
      const dashboardDataFetch: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, {
          authId: authId,
          email: email,
        })
      );
      const response = await dashboardDataFetch;
      const arrayOfResponseObjects = response?.data.getPerson.classes.items;
      setHomeData(arrayOfResponseObjects);
    } catch (e) {
      console.error('getDashbaordData -> ', e);
    } finally {
      // need to do some cleanup
    }
  };

  useEffect(() => {
    if (state.user.role === 'ST') {
      const authId = state.user.authId;
      const email = state.user.email;
      getDashboardData(authId, email);
    }
  }, [state.user.role]);

  /******************************************
   * 1.2 REDUCE ROOMS FROM CLASSLIST ARRAY  *
   ******************************************/
  const getClassList =
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
          return [...acc, { name: dataObj.class.name, rooms: dataObj.class.rooms, students: dataObj.class.students }];
        }, [])
      : [];

  useEffect(() => {
    if (homeData && homeData.length > 0) {
      setClassList(getClassList);
    }
  }, [homeData]);

  const getRoomsFromClassList =
    classList && classList.length > 0
      ? classList.reduce((acc: any[], classObj: any) => {
          return [...acc, classObj.rooms.items[0]];
        }, [])
      : [];

  useEffect(() => {
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'rooms',
        data: getRoomsFromClassList,
      },
    });
  }, [classList]);

  /******************************************
   * 2.1 LIST TEACHER ROOMS                 *
   ******************************************/
  const listRoomTeacher = async (teacherAuthID: string) => {
    try {
      const classIdFromRoomsFetch: any = await API.graphql(
        graphqlOperation(customQueries.listRooms, { filter: { teacherAuthID: { eq: teacherAuthID } } })
      );
      const response = await classIdFromRoomsFetch;
      const arrayOfResponseObjects = response?.data?.listRooms?.items;

      setRooms(arrayOfResponseObjects);

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
  };

  useEffect(() => {
    if (state.user.role === 'FLW' || state.user.role === 'TR') {
      const teacherAuthID = state.user.authId;
      listRoomTeacher(teacherAuthID);
    }
  }, [state.user.role]);

  /******************************************
   * 3.1 LIST ALL WIDGETS FOR ROOM          *
   ******************************************/
  useEffect(() => {
    const listRoomWidgets = async () => {
      setWidgetLoading(true);
      //
      try {
        const noticeboardWidgetsFetch: any = await API.graphql(
          graphqlOperation(queries.listNoticeboardWidgets, { filter: { roomID: { eq: state.activeRoom } } })
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
    };
    if (state.activeRoom && widgetLoading === false) {
      listRoomWidgets();
    }
  }, [state.activeRoom]);

  /**
   * 4. LIST ALL CURRICULUMS ASSOCIATED WITH ROOM of ID
   */
  useEffect(() => {
    const listRoomCurriculums = async () => {
      if (state.roomData.rooms.length > 0 && state.activeRoom !== '') {
        try {
          const roomIds = getArrayOfUniqueValueByProperty(state.roomData.rooms, 'id');
          const roomCurriculumsFetch: any = API.graphql(
            graphqlOperation(customQueries.listRoomCurriculums, {
              filter: { roomID: { contains: state.activeRoom } },
            })
          );
          const response = await roomCurriculumsFetch;
          console.log('response curriculums', response)
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
  }, [state.activeRoom]);

  // Save info of selected room to cookie
  useEffect(() => {
    const getRoomFromState = state.roomData.rooms.filter((room: any) => room.id === state.activeRoom);
    if (getRoomFromState.length === 1) {
      setCookie('room_info', getRoomFromState[0]);
      setActiveRoomInfo(getRoomFromState[0]);
    } else {
      setCookie('room_info', {});
    }
  }, [state.activeRoom]);

  /**
   * 5. LIST AVAILABLE SYLLABUS and GET SEQUENCE TO SORT SYLLABI
   */
  useEffect(() => {
    const listSyllabus = async () => {
      if (curriculumIds.length > 0) {
        try {
          const syllabusCSequenceFetch: any = await API.graphql(
            graphqlOperation(queries.getCSequences, { id: `s_${curriculumIds[0]}` })
          );
          const syllabusMultiFetch: any = API.graphql(
            graphqlOperation(customQueries.listSyllabuss, {
              filter: { ...createFilterToFetchSpecificItemsOnly(curriculumIds, 'curriculumID') },
            })
          );

          const responseRoomSyllabusSequence = await syllabusCSequenceFetch;
          const responseRoomSyllabus = await syllabusMultiFetch;


          const arrayOfRoomSyllabusSequence = responseRoomSyllabusSequence?.data.getCSequences?.sequence;
          const arrayOfRoomSyllabus = responseRoomSyllabus?.data?.listSyllabuss?.items;

          // IF A SEQUENCE WAS RETURNED, REORDER, ELSE DO NOT REORDER
          const roomSyllabusReordered = (arrayOfRoomSyllabusSequence) ? arrayOfRoomSyllabusSequence.reduce(
            (acc: any[], syllabusID: string, idx: number) => {
              const matchedSyllabus = arrayOfRoomSyllabus.find((responseObj: any) => responseObj.id === syllabusID);
              if (matchedSyllabus) {
                return [...acc, matchedSyllabus];
              } else {
                return acc;
              }
            },
            []
          ) : arrayOfRoomSyllabus;

          const mappedResponseObjects = roomSyllabusReordered.map((responseObject: any, idx: number) => {
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

    listSyllabus();
  }, [curriculumIds]);

  /******************************************
   * 6.1 LIST ALL THE SYLLABUS LESSON       *
   *      - SEQUENCES                       *
   *      - LESSONS                         *
   ******************************************/

  const getSyllabusLessonCSequence = async (syllabusID: string) => {
    try {
      const syllabusLessonCSequenceFetch: any = await API.graphql(
        graphqlOperation(queries.getCSequences, { id: `lesson_${syllabusID}` })
      );
      const response = await syllabusLessonCSequenceFetch;
      const arrayOfResponseObjects = response?.data.getCSequences?.sequence;
      setSyllabusLessonSequence(arrayOfResponseObjects);
    } catch (e) {
      console.error('getSyllabusLessonCSequence -> ', e);
    }
  };

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

    const getActiveSyllabus = state.currentPage === 'lesson-planner' ? lessonPlannerSyllabus : classRoomActiveSyllabus;
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
        const syllabusLessonsReordered = syllabusLessonSequence.reduce(
          (acc: any[], syllabusLessonID: string, idx: number) => {
            const matchedLesson = arrayOfResponseObjects.find(
              (responseObj: any) => responseObj.id === syllabusLessonID
            );
            if (matchedLesson) {
              return [...acc, matchedLesson];
            } else {
              return acc;
            }
          },
          []
        );

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

  const classRoomActiveSyllabus = state.roomData.rooms
    .filter((room: any) => room.id === state.activeRoom)
    .map((room: any) => {
      return { id: room.activeSyllabus };
    });

  useEffect(() => {
    const getSyllabusLessonsAndCSequence = async () => {
      await getSyllabusLessonCSequence(classRoomActiveSyllabus[0].id);
    };

    if (state.roomData.syllabus && state.roomData.syllabus.length > 0) {
      getSyllabusLessonsAndCSequence();
    }
  }, [state.roomData.syllabus]);

  useEffect(() => {
    if (syllabusLessonSequence.length > 0) {
      listSyllabusLessons(lessonPlannerSyllabus, classRoomActiveSyllabus);
    }
  }, [syllabusLessonSequence]);



  /******************************************
   * 7.1 SELECT ROOM FUNCTION               *
   ******************************************/
  const handleRoomSelection = (e: React.MouseEvent, i: number) => {
    const t = e.target as HTMLElement;
    const name = t.getAttribute('data-name');
    if (state.activeRoom !== t.id) {
      // setActiveRoom(t.id);
      setActiveRoomName(name);

      dispatch({ type: 'UPDATE_ACTIVEROOM', payload: { data: t.id } });

      setSyllabusLoading(true); // Trigger loading ui element
      setLessonLoading(true);
      setActiveRoomSyllabus(state.roomData.rooms[i].activeSyllabus);
    }
  };

  const roomsTitle =
    'h-12 p-2 font-semibold text-grayscale-lightest flex items-center justify-start bg-darker-gray bg-opacity-60';
  const linkClass = 'w-full p-2 text-grayscale-lightest text-xs tracking-wider mx-auto border-b-0 border-medium-gray';

  return isHomescreen ? (
    <Home
      homeData={homeData}
      setHomeData={setHomeData}
      classList={classList}
      setActiveRoomInfo={setActiveRoomInfo}
      handleRoomSelection={handleRoomSelection}
    />
  ) : (
    <SideRoomSelector
      homeData={homeData}
      setHomeData={setHomeData}
      currentPage={currentPage}
      activeRoom={state.activeRoom}
      setActiveRoom={setActiveRoom}
      setActiveRoomInfo={setActiveRoomInfo}
      setActiveRoomName={setActiveRoomName}
      lessonLoading={lessonLoading}
      setLessonLoading={setLessonLoading}
      syllabusLoading={syllabusLoading}
      setSyllabusLoading={setSyllabusLoading}
      activeRoomSyllabus={activeRoomSyllabus}
      setActiveRoomSyllabus={setActiveRoomSyllabus}
      roomsLoading={roomsLoading}
      handleRoomSelection={handleRoomSelection}
    />
  );
};

export default ClassroomControl;
