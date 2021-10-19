import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import * as mutations from '../../../graphql/mutations';
import BreadCrums from '../../Atoms/BreadCrums';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import {DashboardProps} from '../Dashboard';
import DashboardContainer from '../DashboardContainer';
import DateAndTime from '../DateAndTime/DateAndTime';
import SyllabusSwitch from './SyllabusSwitch';
import Today from './TodayLesson';

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
}

export interface LessonCardProps {
  isTeacher?: boolean;
  keyProps?: string;
  activeRoomInfo?: any;
  lessonProps?: any;
  syllabusProps?: any;
  accessible?: boolean;
  openCards?: string;
  setOpenCards?: React.Dispatch<React.SetStateAction<string>>;
  lessonType?: string;
  roomID?: string;
  getImageFromS3?: boolean;
  preview?: boolean;
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

const Classroom: React.FC<DashboardProps> = (props: DashboardProps) => {
  const {
    setClassroomCurriculum,
    classroomCurriculum,
    isTeacher,
    currentPage,
    activeRoomInfo,
    setActiveRoomInfo,
    activeRoomName,
    lessonLoading,
    syllabusLoading,
    handleRoomSelection,
  } = props;
  // ##################################################################### //
  // ############################ BASIC STATE ############################ //
  // ##################################################################### //
  const {state, theme, dispatch, clientKey, userLanguage} = useContext(GlobalContext);
  const showClassDetails: boolean = !isEmpty(activeRoomInfo);
  const match: any = useRouteMatch();
  const bannerImg = getAsset(clientKey, 'dashboardBanner1');
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {classRoomDict, BreadcrumsTitles} = useDictionary(clientKey);

  // ##################################################################### //
  // ########################### ROOM SWITCHING ########################## //
  // ##################################################################### //
  useEffect(() => {
    if (state.user.role === 'ST') {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'classroom'}});
    }
    if (state.user.role === 'TR' || state.user.role === 'FLW') {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'lesson-planner'}});
    }
  }, [state.user.role]);

  const roomId = match?.params?.roomId;

  useEffect(() => {
    if (!isEmpty(roomId) && state.roomData?.rooms?.length > 0) {
      const roomIndex = state.roomData.rooms.findIndex((d: any) => d.id === roomId);
      const room = state.roomData.rooms[roomIndex];
      const name = room?.name;
      handleRoomSelection(roomId, name, roomIndex);
    }
  }, [roomId, state.roomData.rooms]);

  // ##################################################################### //
  // ########################## TAB LESSON COUNT ######################### //
  // ##################################################################### //
  // const [lessonGroupCount, setLessonGroupCount] = useState<{
  //   open: number;
  //   completed: number;
  // }>({
  //   open: 0,
  //   completed: 0,
  // });
  const [syllabusData, setSyllabusData] = useState<any>({});
  const [lessonData, setLessonData] = useState<Array<any>>([]);
  const [settingLessons, setSettingLessons] = useState<boolean>(true);

  // ##################################################################### //
  // ########################## LESSON GROUPING ########################## //
  // ##################################################################### //
  /**
   * Open Lessons
   */
  // const openLessons =
  //   state.roomData.lessons?.length && activeRoomInfo?.completedLessons?.length
  //     ? state.roomData.lessons.filter(
  //         (lesson: Lesson) =>
  //           activeRoomInfo?.completedLessons.findIndex(
  //             (item: {lessonID?: string | null; time?: string | null}) =>
  //               item.lessonID === lesson.lessonID
  //           ) < 0
  //       )
  //     : [];

  /**
   * Completed Lessons -
   *  This array is a filter of lessons which are completed, closed or open
   */
  // const completedLessons =
  //   state.roomData.lessons?.length && activeRoomInfo?.completedLessons?.length
  //     ? state.roomData.lessons.filter(
  //         (lesson: Lesson) =>
  //           activeRoomInfo?.completedLessons.findIndex(
  //             (item: {lessonID?: string | null; time?: string | null}) =>
  //               item.lessonID === lesson.lessonID
  //           ) > -1
  //       )
  //     : [];

  // ~~~~~~~~~~~ EMPTY EVERYGHING ~~~~~~~~~~ //

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
      // console.log('foundSyllabus - ', foundSyllabus);
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
          const lessonScheduleData = activeSyllabusLessons?.find(
            (lesson: any) => lesson.id === item.id
          );
          let temp = Math.ceil(count + item.lesson.duration);
          const sessionHeading = lessonScheduleData?.startDate
            ? item.lesson.duration > 1
              ? [
                  new Date(lessonScheduleData.startDate).toLocaleDateString(),
                  new Date(lessonScheduleData.estEndDate).toLocaleDateString(),
                ].join(' - ')
              : new Date(lessonScheduleData.startDate).toLocaleDateString()
            : `Session ${
                item.lesson.duration > 1
                  ? range(Math.ceil(count) + 1, temp)
                      .join(', ')
                      .replace(/, ([^,]*)$/, ' & $1')
                  : temp
              }`;
          count += item.lesson.duration;
          const session = Math.ceil(count);
          const lesson = {
            ...item.lesson,
            totalEstTime:
              Math.ceil(
                item.lesson.lessonPlan.reduce(
                  (total: number, obj: any) => Number(obj.estTime) + total,
                  0
                ) / 5
              ) * 5,
          };
          return {...item, lesson, session, sessionHeading};
        })
      );
      setSettingLessons(false);
    } else {
      setSettingLessons(false);
    }
  }, [state.roomData.lessons, state.roomData?.syllabus]);

  // useEffect(() => {
  //   if (state.roomData.lessons?.length > 0) {
  //     setLessonGroupCount({
  //       open: openLessons.length,
  //       completed: completedLessons.length,
  //     });
  //   } else {
  //     setLessonGroupCount({
  //       open: 0,
  //       completed: 0,
  //     });
  //   }
  // }, [state.roomData.lessons]);

  // ##################################################################### //
  // ###################### TEACHER SYLLABUS CONTROL ##################### //
  // ##################################################################### //
  const handleSyllabusActivation = async (syllabusID: string) => {
    const input = {
      id: activeRoomInfo.id,
      institutionID: activeRoomInfo.institutionID,
      classID: activeRoomInfo.classID,
      teacherAuthID: activeRoomInfo.teacherAuthID,
      teacherEmail: activeRoomInfo.teacherEmail,
      name: activeRoomInfo.name,
      maxPersons: activeRoomInfo.maxPersons,
      activeSyllabus: syllabusID,
    };
    const input2 = {
      id: syllabusID,
      isUsed: true,
    };
    const input3 = {
      id: classroomCurriculum.id,
      syllabiHistory: classroomCurriculum.syllabiHistory
        ? classroomCurriculum.syllabiHistory.includes(syllabusID)
          ? classroomCurriculum.syllabiHistory
          : [...classroomCurriculum.syllabiHistory, syllabusID]
        : [syllabusID],
    };

    try {
      const updateRoomMutation: any = await API.graphql(
        graphqlOperation(mutations.updateRoom, {
          input: input,
        })
      );
      const updateUniversalSyllabusMutation: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalSyllabus, {input: input2})
      );
      const updateCurriculum: any = await API.graphql(
        graphqlOperation(mutations.updateCurriculum, {input: input3})
      );
      setClassroomCurriculum(updateCurriculum.data.updateCurriculu);
    } catch (e) {
      console.error('handleSyllabusActivation: ', e);
    } finally {
      setActiveRoomInfo({...activeRoomInfo, activeSyllabus: syllabusID});
    }
  };

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOM'],
      url: `/dashboard/classroom/${roomId}`,
      last: true,
    },
  ];

  return (
    <>
      <DashboardContainer
        bannerImg={bannerImg}
        currentPage={state.currentPage}
        bannerTitle={classRoomDict[userLanguage]['TITLE']}>
        <div className="px-5 2xl:px-0 lg:mx-auto lg:max-w-192 md:max-w-none 2xl:max-w-256">
          <div className="flex flex-row my-0 w-full py-0 mb-4 justify-between">
            <BreadCrums items={breadCrumsList} />
            {/* <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
              <span>
                {!isTeacher
                  ? activeRoomName !== ''
                    ? activeRoomName
                    : classRoomDict[userLanguage]['TITLE']
                  : null}
                {isTeacher ? classRoomDict[userLanguage]['LESSON_PLANNER'] : null}
              </span>
            </div> */}
            <div>
              <span
                className={`mr-0 float-right text-sm md:text-base text-gray-600 text-right`}>
                <DateAndTime />
              </span>
            </div>
          </div>
          <div>
            {/*{isTeacher && state.currentPage === 'lesson-planner' && (*/}
            {isTeacher && (
              <>
                <SectionTitleV3
                  extraContainerClass={'lg:px-0 px-4'}
                  fontSize="2xl"
                  fontStyle="bold"
                  title={`${
                    Boolean(state.roomData?.syllabus?.length)
                      ? `${classRoomDict[userLanguage]['STEP']} 1:`
                      : ''
                  } ${classRoomDict[userLanguage]['UNIT_TITLE']} ${
                    !syllabusLoading ? `for ${state.roomData?.curriculum?.name}` : ''
                  }`}
                  subtitle={classRoomDict[userLanguage]['UNIT_SUB_TITLE']}
                />
                <div className={`bg-opacity-10`}>
                  <div className={`pb-4 m-auto px-0`}>
                    <SyllabusSwitch
                      activeRoom={state.activeRoom}
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

            {Boolean(activeRoomInfo?.activeSyllabus) && (
              <>
                <SectionTitleV3
                  extraContainerClass={'lg:px-0 px-4'}
                  fontSize="2xl"
                  fontStyle="bold"
                  title={`${
                    isTeacher ? `${classRoomDict[userLanguage]['STEP']} 2:` : ''
                  } ${classRoomDict[userLanguage]['LESSON_TITLE']} for ${
                    state.roomData?.activeSyllabus?.name || 'loading'
                  }`}
                  subtitle={
                    isTeacher
                      ? classRoomDict[userLanguage]['LESSON_SUB_TITLE']
                      : 'To enter classroom, select open lesson for this week'
                  }
                />

                <div className={`bg-opacity-10`}>
                  <div className={`pb-4 text-xl m-auto`}>
                    <Today
                      activeRoom={state.activeRoom}
                      activeRoomInfo={activeRoomInfo}
                      isTeacher={isTeacher}
                      lessonLoading={lessonLoading || settingLessons || syllabusLoading}
                      lessons={lessonData}
                      syllabus={syllabusData}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default Classroom;
