import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Warning} from '@components/Atoms/Alerts/Info';
import {handleLessonMutationRating, logError, updatePageState} from '@graphql/functions';
import {reorderSyllabus, setPageTitle, withZoiqFilter} from '@utilities/functions';
import {removeLocalStorageData, setLocalStorageData} from '@utilities/localStorage';
import {TeachingStyle, UserPageState} from 'API';
import {getAsset} from 'assets';
import BreadCrums from 'atoms/BreadCrums';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import useAuth from 'customHooks/useAuth';
import * as mutations from 'graphql/mutations';
import gsap from 'gsap';
import isEmpty from 'lodash/isEmpty';
import React, {Fragment, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router';
import {Empty} from '../Admin/LessonsBuilder/StepActionComponent/LearningEvidence/CourseMeasurementsCard';
import {DashboardProps} from '../Dashboard';
import DashboardContainer from '../DashboardContainer';
import DateAndTime from '../DateAndTime/DateAndTime';
import ClassroomLoader from './ClassroomLoader';

import FloatingAction from './FloatingActionForTeacherAndStudents';
import FloatingActionTranslation from './FloatingActionTranslation';
import SyllabusSwitch from './SyllabusSwitch';
import Today from './TodayLesson';

const range = (from: number, to: number, step: number = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

interface ClassroomProps extends DashboardProps {
  homeData: any;
}

const Classroom: React.FC<ClassroomProps> = (props: ClassroomProps) => {
  const {homeData} = props;

  // ##################################################################### //
  // ############################ BASIC STATE ############################ //
  // ##################################################################### //
  const {state, zoiqFilter, dispatch, theme, userLanguage, clientKey} =
    useGlobalContext();

  const {activeRoom, roomData} = state;

  const teachingStyle = Boolean(roomData) ? roomData.teachingStyle : '--';

  const {authId, email, isTeacher, role, pageState, isStudent, onDemand} = useAuth();
  const match: any = useRouteMatch();
  const bannerImg = getAsset(clientKey, 'dashboardBanner1');
  const {classRoomDict, BreadcrumsTitles} = useDictionary();

  // ##################################################################### //
  // ########################### ROOM SWITCHING ########################## //
  // ##################################################################### //
  useEffect(() => {
    if (isStudent) {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'classroom'}});
    }
    if (isTeacher) {
      dispatch({
        type: 'UPDATE_CURRENTPAGE',
        payload: {data: 'lesson-planner'}
      });
    }
  }, [role]);

  const roomId = match?.params?.roomId;

  useEffect(() => {
    if (!isEmpty(roomId) && state.roomData?.rooms?.length > 0) {
      const roomIndex = state.roomData.rooms.findIndex((d: any) => d.id === roomId);
      const room = state.roomData.rooms[roomIndex];
      const name = room?.name;
      initUpdateActiveRoom();

      name && setPageTitle(name);

      if (isStudent) {
        updatePageState(
          UserPageState.CLASS,
          {
            authId: authId,
            email: email,
            pageState: pageState
          },
          () => {
            dispatch({
              type: 'UPDATE_PAGE_STATE',
              payload: {
                pageState: UserPageState.CLASS,
                lastPageStateUpdate: new Date().toISOString()
              }
            });
          }
        );
      }
    }
  }, [roomId, state.roomData.rooms]);

  const [syllabusData, setSyllabusData] = useState<any>({});
  const [lessonData, setLessonData] = useState<Array<any>>([]);

  const [settingLessons, setSettingLessons] = useState<boolean>(true);

  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(true);
  const [lessonLoading, setLessonLoading] = useState<boolean>(true);

  const [curriculumId, setCurriculumId] = useState<string>('');
  const [curriculumObj, setCurriculumObj] = useState<any>({});
  const [activeRoomInfo, setActiveRoomInfo] = useState<any>({});

  /******************************************
   * 2.1 LIST TEACHER ROOMS                 *
   ******************************************/
  /***********************************************
   *    THIS FUNCTION CAN ACTUALLY BE REMOVED    *
   * IT'S ACTUALLY RETURNING THE SAME (BUT LESS) *
   *    DATA AS GETDASHBOARDDATAFORTEACHERS()    *
   *    AND ESSENTIALLY USING THE SAME QUERY     *
   ***********************************************/

  const listRoomTeacher = async (teacherAuthID: string) => {
    try {
      const queryObj = {
        name: 'customQueries.listRooms',
        valueObj: {
          filter: withZoiqFilter({teacherAuthID: {eq: teacherAuthID}}, zoiqFilter)
        }
      };

      const classIdFromRoomsFetch: any = await API.graphql(
        graphqlOperation(customQueries.listRooms, queryObj.valueObj)
      );
      const assignedRoomsAsCoTeacher: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}}
        })
      );
      //@ts-ignore
      const arrayOfResponseObjects = [
        ...classIdFromRoomsFetch?.data?.listRooms?.items,
        ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items?.map(
          (item: any) => ({
            ...item,
            ...item.room,
            teacher: item.room?.teacher
          })
        )
      ];

      setLocalStorageData('room_list', arrayOfResponseObjects);

      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'rooms',
          data: arrayOfResponseObjects
        }
      });
    } catch (e) {
      logError(e, {authId: authId, email: email}, 'Dashboard @listRoomTeacher');
      console.error('Classes Fetch ERR: ', e);
    }
  };

  useEffect(() => {
    if (isTeacher) {
      listRoomTeacher(authId);
    }
  }, [isTeacher]);

  /**********************************
   * 3. LIST CURRICULUMS BY ROOM ID *
   **********************************/
  const listRoomCurriculums = async () => {
    try {
      const roomCurriculumsFetch = await API.graphql(
        graphqlOperation(customQueries.listRoomCurriculums, {
          filter: {
            roomID: {eq: activeRoom}
          }
        })
      );

      const response = roomCurriculumsFetch;
      // @ts-ignore
      const arrayOfResponseObjects = response?.data?.listRoomCurricula?.items;
      console.log(
        '🚀 ~ file: Classroom.tsx:293 ~ listRoomCurriculums ~ arrayOfResponseObjects:',
        arrayOfResponseObjects
      );

      if (arrayOfResponseObjects.length > 0) {
        setCurriculumId(arrayOfResponseObjects[0]?.curriculumID);
        setCurriculumObj(arrayOfResponseObjects[0]?.curriculum);
      }
    } catch (e) {
      logError(e, {authId: authId, email: email}, 'Dashboard @listRoomCurriculums');
      console.error('RoomCurriculums fetch ERR: ', e);
    }
  };

  useEffect(() => {
    if (roomData?.rooms?.length > 0 && Boolean(activeRoom)) {
      listRoomCurriculums();
    }
  }, [roomData?.rooms, activeRoom]);

  const [loadingRoomInfo, setLoadingRoomInfo] = useState(true);

  // Save info of selected room to cookie
  useEffect(() => {
    setLoadingRoomInfo(true);
    const getRoomFromState = roomData?.rooms?.find((room: any) => room.id === activeRoom);

    if (getRoomFromState) {
      setLocalStorageData('room_info', getRoomFromState);

      setActiveRoomInfo(getRoomFromState);
    }
    setLoadingRoomInfo(false);
  }, [activeRoom]);

  // ##################################################################### //
  // ######################### SCHEDULE AND TIMES ######################## //
  // ##################################################################### //

  /********************
   * 5. LIST SYLLABUS *
   ********************/

  const listSyllabus = async () => {
    setSyllabusLoading(true);

    try {
      // ~~~~~~~~~~~~~~ CURRICULUM ~~~~~~~~~~~~~ //
      let getCurriculum = await API.graphql(
        graphqlOperation(customQueries.getCurriculumForClasses, {
          id: curriculumId
        })
      );
      // @ts-ignore
      let response = getCurriculum.data.getCurriculum;

      let syllabi = response.universalSyllabus.items;
      let sequence = response.universalSyllabusSeq;

      let mappedResponseObjects = reorderSyllabus(syllabi, sequence);

      //TODO: combine these dispatches
      dispatch({
        type: 'UPDATE_ROOM_MULTI',
        payload: {
          syllabus: mappedResponseObjects,
          curriculum: {id: response.id, name: response.name}
        }
      });
    } catch (e) {
      logError(e, {authId: authId, email: email}, 'Dashboard @listSyllabus');
      console.error('Curriculum ids ERR: ', e);
    } finally {
      setSyllabusLoading(false);
    }
  };

  useEffect(() => {
    const getSyllabusAndSchedule = async () => {
      await listSyllabus();
    };
    if (curriculumId !== '' && activeRoom) {
      getSyllabusAndSchedule();
    }
  }, [activeRoom, curriculumId]);

  /******************************************
   * 6.1 LIST ALL THE SYLLABUS LESSON       *
   *      - LESSONS                         *
   ******************************************/

  const listSyllabusLessons = async (syllabusID: string) => {
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'lessons',
        data: []
      }
    });

    /**
     * IF there are any syllabus active, do a fetch for lessons
     */

    try {
      setLessonLoading(true);
      const syllabusLessonFetch = await API.graphql(
        graphqlOperation(customQueries.getUniversalSyllabus, {
          id: syllabusID
        })
      );
      //@ts-ignore
      const response = await syllabusLessonFetch.data.getUniversalSyllabus;
      const lessons = response?.lessons.items
        .map((t: any) => {
          let index = response?.universalLessonsSeq?.indexOf(t.id);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      dispatch({
        type: 'UPDATE_ROOM_MULTI',
        payload: {
          activeSyllabus: response,
          lessons: lessons
        }
      });
    } catch (e) {
      logError(e, {authId: authId, email: email}, 'Dashboard @listSyllabusLessons');
      console.error('syllabus lessons: ', e);
    } finally {
      setLessonLoading(false);
    }
  };

  // ~~~~~~~~ TRIGGER LESSON LOADING ~~~~~~~ //
  useEffect(() => {
    if (activeRoomInfo?.activeSyllabus) {
      listSyllabusLessons(activeRoomInfo.activeSyllabus);
    }
  }, [activeRoomInfo]);

  useEffect(() => {
    if (lessonLoading) {
      setLessonData([]);
    }
  }, [lessonLoading]);

  const initUpdateActiveRoom = () => {
    dispatch({
      type: 'UPDATE_ACTIVEROOM',
      payload: {
        roomID: roomId,
        syllabusID: roomData?.activeSyllabus?.id,
        name: roomData.name
      }
    });
  };

  // ~~~~~~~~~~~~~ SET SYLLABUS ~~~~~~~~~~~~ //

  useEffect(() => {
    if (state.activeSyllabus) {
      const foundSyllabus =
        state.roomData?.syllabus &&
        state.roomData?.syllabus.find(
          (syllabusObj: any) => syllabusObj.id === state.activeSyllabus
        );
      if (foundSyllabus) {
        setSyllabusData(foundSyllabus);
      }
    }
  }, [state.activeSyllabus]);

  // ~~~~~~~~~~~~~~ SETLESSONS ~~~~~~~~~~~~~ //

  useEffect(() => {
    // reconstructing lesson data after adding some calculated fields
    let count: number = 0;
    let temp = [...state.roomData.lessons];
    const syllabusList = state.roomData?.syllabus;
    const activeSyllabusLessons =
      syllabusList.find((syllabus: any) => syllabus.id === activeRoomInfo?.activeSyllabus)
        ?.lessons?.items || [];
    if (lessonLoading && state.roomData.lessons?.length) {
      setSettingLessons(true);
    }

    if (temp?.length && syllabusList?.length && activeSyllabusLessons?.length) {
      setLessonData(
        temp?.map((item: any) => {
          const currentLessonItem = listPersonData.find(
            (_d) => _d.lessonID === item.lessonID
          )?.pages;

          const currentPage = currentLessonItem
            ? JSON.parse(currentLessonItem)?.currentPage
            : 0;

          const lessonScheduleData = activeSyllabusLessons?.find(
            (lesson: any) => lesson.id === item.id
          );
          let temp = Math.ceil(count + (item?.lesson?.duration || 1));

          const sessionHeading = lessonScheduleData?.startDate
            ? item?.lesson?.duration > 1
              ? [
                  new Date(lessonScheduleData.startDate).toLocaleDateString(),
                  new Date(lessonScheduleData.estEndDate).toLocaleDateString()
                ].join(' - ')
              : new Date(lessonScheduleData.startDate).toLocaleDateString()
            : `Session ${
                item?.lesson?.duration > 1
                  ? range(Math.ceil(count) + 1, temp)
                      .join(', ')
                      .replace(/, ([^,]*)$/, ' & $1')
                  : temp
              }`;
          count += item?.lesson?.duration;
          const session = Math.ceil(count);
          const lesson = {
            ...item?.lesson,
            currentPage,

            totalEstTime:
              Math.ceil(
                item?.lesson?.lessonPlan?.reduce(
                  (total: number, obj: any) => Number(obj.estTime) + total,
                  0
                ) / 5
              ) * 5
          };
          return {...item, lesson, session, sessionHeading};
        })
      );
      setSettingLessons(false);
    } else {
      setSettingLessons(false);
    }
  }, [state.roomData.lessons, state.roomData?.syllabus]);

  // ##################################################################### //
  // ###################### TEACHER SYLLABUS CONTROL ##################### //
  // ##################################################################### //

  const [syllabusActivating, setSyllabusActivating] = useState(false);

  const handleSyllabusActivation = async (syllabusID: string) => {
    setSyllabusActivating(true);
    const input = {
      id: activeRoomInfo.id,
      institutionID: activeRoomInfo.institutionID,
      classID: activeRoomInfo.classID,
      teacherAuthID: activeRoomInfo.teacherAuthID,
      teacherEmail: activeRoomInfo.teacherEmail,
      name: activeRoomInfo.name,
      maxPersons: activeRoomInfo.maxPersons,
      activeSyllabus: syllabusID
    };
    const input2 = {
      id: syllabusID,
      isUsed: true
    };

    try {
      await API.graphql(
        graphqlOperation(mutations.updateRoom, {
          input: input
        })
      );
      await API.graphql(
        graphqlOperation(mutations.updateUniversalSyllabus, {input: input2})
      );

      if (curriculumObj) {
        const input3 = {
          id: curriculumObj.id,
          syllabiHistory: curriculumObj.syllabiHistory
            ? curriculumObj.syllabiHistory.includes(syllabusID)
              ? curriculumObj.syllabiHistory
              : [...curriculumObj.syllabiHistory, syllabusID]
            : [syllabusID]
        };
        const updateCurriculum: any = await API.graphql(
          graphqlOperation(mutations.updateCurriculum, {input: input3})
        );
        setCurriculumObj(updateCurriculum.data.updateCurriculum);
      }
    } catch (e) {
      console.error('handleSyllabusActivation: ', e);
      logError(e, {authId, email}, 'Classroom @handleSyllabusActivation');
    } finally {
      setSyllabusActivating(false);
      setActiveRoomInfo?.({...activeRoomInfo, activeSyllabus: syllabusID});
    }
  };

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      url: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOM'],
      url: `/dashboard/classroom/${roomId}`,
      last: true
    }
  ];

  const [listPersonData, setListPersonData] = useState<any[]>([]);

  const [fetchingPersonData, setFetchingPersonData] = useState(true);

  const fetchLessonPersonData = async () => {
    try {
      const lessonPersonData: any = await API.graphql(
        graphqlOperation(customQueries.lessonsByType, {
          filter: {
            roomId: {eq: roomId},
            studentAuthID: {eq: authId},
            studentEmail: {eq: email}
          },
          limit: 500
        })
      );

      const data = lessonPersonData?.data?.listPersonLessonsData?.items || [];
      removeLocalStorageData('lessonPersonData');
      setLocalStorageData('lessonPersonData', data);
      setListPersonData(data);
    } catch (e) {
      console.error('listLessonPersonData: ', e);
      logError(e, {authId, email}, 'Classroom @fetchLessonPersonData');
    } finally {
      setFetchingPersonData(false);
    }
  };

  const getLessonRating = async (lessonId: string, _: string, __: string) => {
    try {
      const data = listPersonData.find((pd) => pd.lessonID === lessonId);
      if (!isEmpty(data)) {
        const ratingValue = data.ratings;
        const pageNumber = data.pages;
        const currentPage = JSON.parse(pageNumber).currentPage;
        const lessonProgress = JSON.parse(pageNumber).lessonProgress;
        const totalPages = JSON.parse(pageNumber).totalPages;
        return {
          ratingValue,
          currentPage,
          lessonProgress,
          totalPages,
          ...data,
          isCompleted: data?.isCompleted || false
        };
      }
    } catch (error) {
      logError(error, {authId, email}, 'Classroom @getLessonRating');
    }
  };

  useEffect(() => {
    if (listPersonData.length === 0) {
      fetchLessonPersonData();
    }
  }, [listPersonData.length]);

  const addTitle = (data: any[]) =>
    data.map((item: any) => ({
      ...item,
      lessonTitle: item?.lesson?.title || ''
    }));

  const withTitle = lessonData ? addTitle(lessonData) : [];

  const courseName = state?.roomData?.curriculum?.name || '';

  useEffect(() => {
    if (homeData && homeData.length > 0 && activeRoomInfo) {
      gsap.from('.floating-wrapper', {
        duration: 1,
        ease: 'power2.inOut',
        x: 100,
        scale: 0,
        delay: 1
      });
    }
  }, [homeData, activeRoomInfo]);

  const _handleLessonMutationRating = (lessonID: string, ratingValue: string) => {
    if (!fetchingPersonData) {
      try {
        const id = listPersonData.find((pd) => pd.lessonID === lessonID)?.id;
        handleLessonMutationRating(id, lessonID, ratingValue);
      } catch (error) {
        logError(error, {authId, email}, 'Classroom @handleLessonMutationRating');
      }
    }
  };

  return (
    <>
      <DashboardContainer
        user={state.user}
        theme={theme}
        courseName={courseName}
        institutionId={activeRoomInfo?.institutionID}
        clientKey={clientKey}
        bannerImg={bannerImg}
        bannerTitle={`${classRoomDict[userLanguage]['TITLE']}`}>
        <div className="relative px-5 2xl:px-0 lg:mx-auto lg:max-w-256 md:max-w-none">
          <div className="flex flex-row my-0 w-full py-0 mb-4 justify-between items-center">
            <BreadCrums items={breadCrumsList} />

            <div>
              <span
                className={`mr-0 float-right text-sm md:text-base text-gray-600 text-right`}>
                <DateAndTime />
              </span>
            </div>
          </div>
          <div>
            {isTeacher && teachingStyle === TeachingStyle.PERFORMER && (
              <Warning message={'This classroom has Performer mode activated'} />
            )}
            {isTeacher && (
              <>
                <SectionTitleV3
                  fontSize="2xl"
                  fontStyle="bold"
                  title={`${
                    Boolean(state.roomData?.syllabus?.length)
                      ? `${classRoomDict[userLanguage]['STEP']} 1:`
                      : ''
                  } ${classRoomDict[userLanguage]['UNIT_TITLE']} ${
                    !syllabusLoading
                      ? `for ${state.roomData?.curriculum?.name || ''}`
                      : ''
                  }`}
                  subtitle={classRoomDict[userLanguage]['UNIT_SUB_TITLE']}
                />
                <div className={`bg-opacity-10`}>
                  <div className={`pb-4 m-auto px-0`}>
                    <SyllabusSwitch
                      activeRoom={state.activeRoom}
                      syllabusActivating={syllabusActivating}
                      classRoomActiveSyllabus={activeRoomInfo?.activeSyllabus}
                      completedLessons={activeRoomInfo?.completedLessons}
                      curriculumName={state.roomData?.curriculum?.name}
                      handleSyllabusActivation={handleSyllabusActivation}
                      institutionId={activeRoomInfo?.institutionID}
                      syllabusLoading={syllabusLoading}
                    />
                  </div>
                </div>
              </>
            )}

            <>
              <SectionTitleV3
                fontSize="2xl"
                fontStyle="bold"
                title={`${isTeacher ? `${classRoomDict[userLanguage]['STEP']} 2:` : ''} ${
                  classRoomDict[userLanguage]['LESSON_TITLE']
                } for ${state.roomData?.activeSyllabus?.name || 'loading'}`}
                subtitle={
                  isTeacher
                    ? classRoomDict[userLanguage]['LESSON_SUB_TITLE']
                    : onDemand
                    ? classRoomDict[userLanguage]['LESSON_SUB_TITLE_ASYNC']
                    : 'To enter classroom, select open lesson for this week'
                }
              />

              <div className={`bg-opacity-10`}>
                <div className={`pb-4 text-xl m-auto`}>
                  {!Boolean(activeRoomInfo) ? (
                    Array(3)
                      .fill(' ')
                      .map((_: any) => (
                        <Fragment key={_}>
                          <ClassroomLoader />
                        </Fragment>
                      ))
                  ) : Boolean(activeRoomInfo?.activeSyllabus) ? (
                    <Today
                      activeRoom={state.activeRoom}
                      activeRoomInfo={activeRoomInfo}
                      isTeacher={isTeacher}
                      lessonLoading={
                        loadingRoomInfo ||
                        lessonLoading ||
                        settingLessons ||
                        syllabusLoading
                      }
                      lessons={withTitle}
                      syllabus={syllabusData}
                      handleLessonMutationRating={_handleLessonMutationRating}
                      getLessonRating={
                        listPersonData && listPersonData.length > 0
                          ? getLessonRating
                          : () => {}
                      }
                    />
                  ) : (
                    <Empty text="No active unit for this room" />
                  )}
                </div>
              </div>
            </>
          </div>
        </div>

        {homeData && homeData.length > 0 && activeRoomInfo && (
          <div className="fixed floating-wrapper-outer w-auto sm:right-2">
            <div className="floating-wrapper flex flex-col items-center px-2 py-2 bg-white theme-card-shadow rounded-full space-x-4 sm:space-x-0 sm:space-y-4 ">
              <FloatingAction
                roomId={activeRoomInfo.id}
                homeData={homeData}
                name="teacher"
              />
              <FloatingAction
                roomId={activeRoomInfo.id}
                homeData={homeData}
                name="student"
              />
              <FloatingActionTranslation />
            </div>
          </div>
        )}
      </DashboardContainer>
    </>
  );
};

export default Classroom;
