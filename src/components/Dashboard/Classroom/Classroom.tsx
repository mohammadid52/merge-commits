import React, {useContext, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router';
import isEmpty from 'lodash/isEmpty';
import {GlobalContext} from '../../../contexts/GlobalContext';
import SurveyCard from './SurveyCard';
import Today from './TodayLesson';
import UpcomingLessons from './UpcomingLessons';
import CompletedLessons from './CompletedLessons';
import {DashboardProps} from '../Dashboard';
import DateAndTime from '../DateAndTime/DateAndTime';
import SyllabusSwitch from './SyllabusSwitch';
import useDictionary from '../../../customHooks/dictionary';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import BreadCrums from '../../Atoms/BreadCrums';
import DashboardContainer from '../DashboardContainer';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as mutations from '../../../graphql/mutations';

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
    totalEstTime?: number;
  };
  session?: number;
  sessionHeading?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProps extends DashboardProps {
  lessons: Lesson[];
}

export interface LessonCardProps {
  isTeacher?: boolean;
  keyProps?: string;
  activeRoomInfo?: any;
  lessonProps: Lesson;
  accessible?: boolean;
  openCards?: string;
  setOpenCards?: React.Dispatch<React.SetStateAction<string>>;
  lessonType?: string;
  roomID?: string;
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
    classRoomActiveSyllabus,
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
  // #################### ROOM SWITCHING (DEPRECATED) #################### //
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
  const [lessonGroupCount, setLessonGroupCount] = useState<{
    open: number;
    completed: number;
  }>({
    open: 0,
    completed: 0,
  });

  // ##################################################################### //
  // ########################## LESSON GROUPING ########################## //
  // ##################################################################### //
  /**
   * Open Lessons
   */
  const openLessons =
    state.roomData.lessons?.length && activeRoomInfo?.completedLessons?.length
      ? state.roomData.lessons.filter(
          (lesson: Lesson) =>
            activeRoomInfo?.completedLessons.findIndex(
              (item: {lessonID?: string | null; time?: string | null}) =>
                item.lessonID === lesson.lessonID
            ) < 0
        )
      : [];

  /**
   * Completed Lessons -
   *  This array is a filter of lessons which are completed, closed or open
   */
  const completedLessons =
    state.roomData.lessons?.length && activeRoomInfo?.completedLessons?.length
      ? state.roomData.lessons.filter(
          (lesson: Lesson) =>
            activeRoomInfo?.completedLessons.findIndex(
              (item: {lessonID?: string | null; time?: string | null}) =>
                item.lessonID === lesson.lessonID
            ) > -1
        )
      : [];

  let count: number = 0;
  let lessonData = state.roomData.lessons;
  lessonData?.map((item: any) => {
    let temp = Math.ceil(count + item.lesson.duration);
    item.sessionHeading = `Session ${
      item.lesson.duration > 1
        ? range(count + 1, temp)
            .join(', ')
            .replace(/, ([^,]*)$/, ' & $1')
        : temp
    }`;
    count += item.lesson.duration;
    item.session = Math.ceil(count);
    item.lesson = {
      ...item.lesson,
      totalEstTime:
        Math.ceil(
          item.lesson.lessonPlan.reduce(
            (total: number, obj: any) => Number(obj.estTime) + total,
            0
          ) / 5
        ) * 5,
    };

    return item;
  });

  useEffect(() => {
    if (state.roomData.lessons?.length > 0) {
      setLessonGroupCount({
        open: openLessons.length,
        completed: completedLessons.length,
      });
    } else {
      setLessonGroupCount({
        open: 0,
        completed: 0,
      });
    }
  }, [state.roomData.lessons]);

  const sortedLessons = (lessonArray: any[], sortProperty: string) => {
    return lessonArray.sort((a: any, b: any) => {
      if (a[sortProperty] > b[sortProperty]) {
        return 1;
      }
      if (a[sortProperty] < b[sortProperty]) {
        return -1;
      }
    });
  };

  // ##################################################################### //
  // ########################### ADDITIONAL UI ########################### //
  // ##################################################################### //
  const Counter: React.FC<{count: number}> = ({count}) => {
    return (
      <div
        className={`w-5 h-5 p-1 ${theme.btn[themeColor]} rounded-full flex justify-center align-center items-center content-center`}>
        <span className="w-auto h-auto text-xs text-white font-bold">{count}</span>
      </div>
    );
  };

  const tabs = [
    {
      index: 0,
      icon: <Counter count={lessonGroupCount.open} />,
      title: !isTeacher
        ? classRoomDict[userLanguage]['LESSON_TABS']['TAB_ONE']
        : classRoomDict[userLanguage]['LESSON_TABS']['TAB_TWO'],
      active: true,
      content: (
        <div className={`bg-opacity-10`}>
          <div className={`p-4 text-xl m-auto`}>
            <Today
              activeRoom={state.activeRoom}
              activeRoomInfo={activeRoomInfo}
              isTeacher={isTeacher}
              lessonLoading={lessonLoading}
              lessons={openLessons}
            />
          </div>
        </div>
      ),
    },
    {
      index: 1,
      icon: <Counter count={lessonGroupCount.completed} />,
      title: 'Completed',
      active: false,
      content: (
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} p-4 text-xl m-auto`}>
            {/*<CompletedLessons isTeacher={isTeacher} lessons={completedLessons} />*/}
          </div>
        </div>
      ),
    },
  ];

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

    try {
      const updateRoomMutation: any = API.graphql(
        graphqlOperation(mutations.updateRoom, {
          input,
        })
      );
      await updateRoomMutation;
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
              <span className={`mr-0 float-right text-gray-600 text-right`}>
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
                  title={`${classRoomDict[userLanguage]['STEP']} 1: ${
                    classRoomDict[userLanguage]['UNIT_TITLE']
                  } ${!syllabusLoading ? `for ${state.roomData?.curriculum?.name}` : ''}`}
                  subtitle={classRoomDict[userLanguage]['UNIT_SUB_TITLE']}
                />
                <div className={`bg-opacity-10`}>
                  <div className={`pb-4 m-auto lg:px-0 px-4`}>
                    <SyllabusSwitch
                      completedLessons={activeRoomInfo?.completedLessons}
                      classRoomActiveSyllabus={activeRoomInfo?.activeSyllabus}
                      activeRoom={state.activeRoom}
                      currentPage={currentPage}
                      syllabusLoading={syllabusLoading}
                      handleSyllabusActivation={handleSyllabusActivation}
                    />
                  </div>
                </div>
              </>
            )}

            <SectionTitleV3
              extraContainerClass={'lg:px-0 px-4'}
              fontSize="2xl"
              fontStyle="bold"
              title={classRoomDict[userLanguage]['LESSON_TITLE']}
              subtitle={
                isTeacher
                  ? `${classRoomDict[userLanguage]['STEP']} 2: ${classRoomDict[userLanguage]['LESSON_SUB_TITLE']}`
                  : 'To enter classroom, select open lesson for this week'
              }
            />

            <div className={`bg-opacity-10`}>
              <div className={`pb-4 text-xl m-auto`}>
                <Today
                  activeRoom={state.activeRoom}
                  activeRoomInfo={activeRoomInfo}
                  isTeacher={isTeacher}
                  lessonLoading={lessonLoading}
                  lessons={lessonData}
                />
              </div>
            </div>
            {/* {showClassDetails && (
              <div
                className={`w-full min-h-56 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4`}>
                <UnderlinedTabs activeTab={0} tabs={tabs} />
              </div>
            )} */}
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default Classroom;
