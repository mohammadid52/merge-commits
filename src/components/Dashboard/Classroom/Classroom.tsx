import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Warning} from '@components/Atoms/Alerts/Info';
import {logError, updatePageState} from '@graphql/functions';
import {setPageTitle} from '@utilities/functions';
import {
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData
} from '@utilities/localStorage';
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
// import ClassroomLoader from "./ClassroomLoader";

import FloatingAction from './FloatingActionForTeacherAndStudents';
import FloatingActionTranslation from './FloatingActionTranslation';
import SyllabusSwitch from './SyllabusSwitch';
import ClassroomsList from './ClassroomsList';
import {Skeleton} from 'antd';

interface Artist {
  id: string;
  images: [];
  name: string;
  type: string;
}

export interface CurriculumInfo {
  artist: Artist;
  language: string;
  summary: string;
  title: string;
}

export interface Syllabus {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Lesson {
  id: string;
  open?: boolean;
  status?: string;
  openedAt?: string;
  closedAt?: string;
  complete?: boolean;
  roster?: string[];
  viewing?: any;
  startDate?: string;
  endDate?: string;
  SELStructure?: string;
  courseID?: string;
  lessonID?: string;
  lesson?: {
    id?: string;
    type?: string;
    title?: string;
    artist?: any;
    language?: string;
    summary?: string;
    purpose?: string;
    duration?: number | null;
    cardImage?: string | null;
    cardCaption?: string;
    totalEstTime?: number;
  };
  session?: number;
  sessionHeading?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProps extends DashboardProps {
  lessons: Lesson[];
  syllabus?: any;
  searchTerm?: string;
  handleLessonMutationRating: (lessonID: string, ratingValue: string) => void;
  getLessonRating: (lessonId: string, userEmail: string, userAuthId: string) => any;
}

export interface LessonCardProps {
  isCompleted?: boolean;

  isTeacher?: boolean;
  searchTerm?: string;
  keyProps?: string;
  activeRoomInfo?: any;
  lessonProps?: any;
  syllabusProps?: any;

  accessible?: boolean;
  openCards?: string;
  lessonProgress?: number;
  setOpenCards?: React.Dispatch<React.SetStateAction<string>>;
  lessonType?: string;
  pageNumber?: number;
  handleLessonMutationRating?: (lessonID: string, ratingValue: string) => void;
  getLessonRating?: (lessonId: string, userEmail: string, userAuthId: string) => any;
  getLessonByType?: (type: string, lessonID: string) => any;
  roomID?: string;
  getImageFromS3?: boolean;
  preview?: boolean;
  user?: any;
}

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
  const {
    setClassroomCurriculum,
    classroomCurriculum,
    isTeacher,
    // isOnDemandStudent,
    currentPage,
    activeRoomInfo,
    setActiveRoomInfo,
    lessonLoading,
    syllabusLoading,
    handleRoomSelection,
    loadingRoomInfo,
    homeData
  } = props;

  // ##################################################################### //
  // ############################ BASIC STATE ############################ //
  // ##################################################################### //
  const {state, dispatch, theme, userLanguage, clientKey} = useGlobalContext();

  const {role} = state.user;

  const roomData = getLocalStorageData('room_info');
  const teachingStyle = Boolean(roomData) ? roomData.teachingStyle : '--';

  const {authId, email, pageState, isStudent, isFellow} = useAuth();
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
    if (isTeacher || isFellow) {
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
      handleRoomSelection?.(roomId, name, roomIndex);

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

  useEffect(() => {
    if (lessonLoading) {
      setLessonData([]);
    }
  }, [lessonLoading]);

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
  }, [state.roomData?.syllabus]);

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

      if (classroomCurriculum) {
        const input3 = {
          id: classroomCurriculum.id,
          syllabiHistory: classroomCurriculum.syllabiHistory
            ? classroomCurriculum.syllabiHistory.includes(syllabusID)
              ? classroomCurriculum.syllabiHistory
              : [...classroomCurriculum.syllabiHistory, syllabusID]
            : [syllabusID]
        };
        const updateCurriculum: any = await API.graphql(
          graphqlOperation(mutations.updateCurriculum, {input: input3})
        );
        setClassroomCurriculum(updateCurriculum.data.updateCurriculum);
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
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOM'],
      href: `/dashboard/classroom/${roomId}`,
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

  const handleLessonMutationRating = async (lessonID: string, ratingValue: string) => {
    if (!fetchingPersonData) {
      const id = listPersonData.find((pd) => pd.lessonID === lessonID)?.id;
      try {
        await API.graphql(
          graphqlOperation(mutations.updatePersonLessonsData, {
            input: {
              id,
              lessonID: lessonID,
              ratings: ratingValue
            }
          })
        );
      } catch (error) {
        logError(error, {authId, email}, 'Classroom @handleLessonMutationRating');
      }
    }
  };

  useEffect(() => {
    if (listPersonData.length === 0) {
      fetchLessonPersonData();
    }
  }, []);

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
                  fontStyle="medium"
                  title={` ${classRoomDict[userLanguage]['UNIT_TITLE']} ${
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
                      currentPage={currentPage}
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
              <div className={`bg-opacity-10`}>
                <div className={`pb-4 text-xl m-auto`}>
                  {!Boolean(activeRoomInfo) ? (
                    Array(3)
                      .fill(' ')
                      .map((_: any, index: number) => (
                        <Fragment key={index}>
                          <Skeleton />
                        </Fragment>
                      ))
                  ) : Boolean(activeRoomInfo?.activeSyllabus) ? (
                    <ClassroomsList
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
                      handleLessonMutationRating={handleLessonMutationRating}
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
