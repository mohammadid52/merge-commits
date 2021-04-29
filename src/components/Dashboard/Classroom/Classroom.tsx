import React, {useContext, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router';
import isEmpty from 'lodash/isEmpty';

import {GlobalContext} from '../../../contexts/GlobalContext';

import SurveyCard from './SurveyCard';
import Today from './TodayLesson';
import UpcomingLessons from './UpcomingLessons';
import CompletedLessons from './CompletedLessons';
import {DashboardProps} from '../Dashboard';
import TopWidgetBar from '../Noticebooard/TopWidgetBar';
import DateAndTime from '../DateAndTime/DateAndTime';
import SyllabusSwitch from './SyllabusSwitch';
import useDictionary from '../../../customHooks/dictionary';
import {initRosterSyllabusLessons} from '../../../uniqueScripts/InitRoster_in_SyllabusLessons';
import BreadCrums from '../../Atoms/BreadCrums';
import {BreadcrumsTitles} from '../../../dictionary/dictionary.iconoclast';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import Buttons from '../../Atoms/Buttons';
import Selector from '../../Atoms/Form/Selector';
import HeroBanner from '../../Header/HeroBanner';
import DashboardContainer from '../DashboardContainer';
import Chat from '../../RoomChat/Chat';

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
  };
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

const Classroom: React.FC<DashboardProps> = (props: DashboardProps) => {
  const {
    isTeacher,
    currentPage,
    activeRoomInfo,
    activeRoomName,
    visibleLessonGroup,
    setVisibleLessonGroup,
    handleSyllabusActivation,
    lessonLoading,
    syllabusLoading,
    handleRoomSelection,
  } = props;
  const {state, theme, dispatch, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const showClassDetails: boolean = !isEmpty(activeRoomInfo);
  const match: any = useRouteMatch();
  const bannerImg = getAsset(clientKey, 'dashboardBanner1');

  const {classRoomDict} = useDictionary(clientKey);
  const [survey] = useState<any>({
    display: false,
    data: null,
  });

  const [lessonGroupCount, setLessonGroupCount] = useState<{
    today: number;
    upcoming: number;
    completed: number;
  }>({
    today: 0,
    upcoming: 0,
    completed: 0,
  });

  //  INITIALIZE CURRENT PAGE LOCATION
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

  /**
   * ASSESSMENTS & SURVEYS
   *  Array which filters out only surveys/assessments
   */
  const assessmentsSurveys =
    state.roomData.lessons.length > 0
      ? state.roomData.lessons.filter((lesson: Lesson) => {
          if (
            lesson?.lesson?.type.includes('survey') ||
            lesson?.lesson?.type.includes('assessment')
          ) {
            return lesson;
          }
        })
      : [];

  /**
   * Today's Lessons -
   *  This array is a filter of lessons which are open & not completed
   *  (If there were enough lessons, this array should
   *  actually be a filter of lessons from today)
   */
  const todayLessons =
    state.roomData.lessons.length > 0
      ? state.roomData.lessons.filter((lesson: Lesson) => {
          if (lesson.hasOwnProperty('lesson') && lesson.lesson !== null) {
            if (lesson?.status === 'Active' && lesson?.lesson.type !== 'survey') {
              if (!lesson.complete) {
                return lesson;
              }
            }
          }
        })
      : [];

  /**
   * Upcoming Lessons -
   *  This array is a filter of lessons which are closed, but not completed
   */
  const upcomingLessons =
    state.roomData.lessons.length > 0
      ? state.roomData.lessons.filter((lesson: Lesson) => {
          if (lesson.hasOwnProperty('lesson') && lesson.lesson !== null) {
            if (lesson.status === 'Inactive' && lesson.lesson?.type !== 'survey') {
              if (!lesson.complete) {
                return lesson;
              }
            }
          }
        })
      : [];

  const todayAndUpcomingLessons = [...todayLessons, ...upcomingLessons];

  // if there are top widgets
  const thereAreTopWidgets: boolean = state.roomData.widgets.some(
    (widget: any) => widget.placement === 'topbar'
  );
  /**
   * Completed Lessons -
   *  This array is a filter of lessons which are completed, closed or open
   */
  const completedLessons =
    state.roomData.lessons.length > 0
      ? state.roomData.lessons.filter((lesson: Lesson) => {
          if (lesson.complete) {
            return lesson;
          }
        })
      : [];

  useEffect(() => {
    if (state.roomData.lessons.length > 0) {
      setLessonGroupCount({
        today: todayLessons.length,
        upcoming: upcomingLessons.length,
        completed: completedLessons.length,
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

  const Counter: React.FC<{count: number}> = ({count}) => {
    return (
      <div className="w-5 h-5 p-1  bg-indigo-500 rounded-full flex justify-center align-center items-center content-center">
        <span className="w-auto h-auto text-xs text-white font-bold">{count}</span>
      </div>
    );
  };

  const tabs = [
    {
      index: 0,
      icon: <Counter count={lessonGroupCount.today} />,
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
              lessons={!isTeacher ? todayLessons : todayAndUpcomingLessons}
            />
          </div>
        </div>
      ),
    },
    {
      index: 1,
      icon: <Counter count={lessonGroupCount.upcoming} />,
      title: 'Upcoming',
      active: false,
      content: (
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} p-4 text-xl m-auto`}>
            <UpcomingLessons activeRoomInfo={activeRoomInfo} lessons={upcomingLessons} />
          </div>
        </div>
      ),
    },
    {
      index: 2,
      icon: <Counter count={lessonGroupCount.completed} />,
      title: 'Completed',
      active: false,
      content: (
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} p-4 text-xl m-auto`}>
            <CompletedLessons
              isTeacher={isTeacher}
              lessons={sortedLessons(completedLessons, 'expectedEndDate')}
            />
          </div>
        </div>
      ),
    },
  ];

  const tabsForTeacher = tabs
    .filter((tab) => tab.index !== 1)
    .map((tab) => {
      if (tab.index === 2) {
        const modifiedTab = {
          ...tab,
          index: tab.index - 1,
        };
        return modifiedTab;
      } else {
        return {
          ...tab,
        };
      }
    });

  return (
    <>
      <DashboardContainer
        bannerImg={bannerImg}
        currentPage={state.currentPage}
        bannerTitle={classRoomDict[userLanguage]['TITLE']}>
        <div className="mx-auto max-w-256">
          <div className="flex flex-row my-0 w-full py-0 mb-4 justify-between">
            <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
              <span>
                {!isTeacher
                  ? activeRoomName !== ''
                    ? activeRoomName
                    : classRoomDict[userLanguage]['TITLE']
                  : null}
                {isTeacher ? classRoomDict[userLanguage]['LESSON_PLANNER'] : null}
              </span>
            </div>
            <div>
              <span className={`mr-0 float-right text-gray-600 text-right`}>
                <DateAndTime />
              </span>
            </div>
          </div>
          <div>
            {/* {thereAreTopWidgets && (
              <div className={`bg-opacity-10`}>
                <div className={`pb-4 m-auto`}>
                  <TopWidgetBar />
                </div>
              </div>
            )} */}
            {isTeacher && state.currentPage === 'lesson-planner' && (
              <>
                <SectionTitleV3
                  fontSize="2xl"
                  fontStyle="bold"
                  title={classRoomDict[userLanguage]['UNIT_TITLE']}
                />
                <div className={`bg-opacity-10`}>
                  <div className={`pb-4 m-auto`}>
                    <SyllabusSwitch
                      activeRoom={state.activeRoom}
                      currentPage={currentPage}
                      syllabusLoading={syllabusLoading}
                      handleSyllabusActivation={handleSyllabusActivation}
                    />
                  </div>
                </div>
              </>
            )}
            {state.roomData.lessons.length > 0 && assessmentsSurveys.length > 0 ? (
              <>
                <SectionTitleV3
                  fontSize="2xl"
                  fontStyle="bold"
                  title={classRoomDict[userLanguage]['ASSESSMENT_TITLE']}
                />
                <div className={`bg-opacity-10`}>
                  <div className={`text-xl m-auto`}>
                    <SurveyCard
                      roomID={roomId}
                      isTeacher={isTeacher}
                      link={'/lesson/on-boarding-survey-1'}
                      lessons={assessmentsSurveys}
                      lessonType={`survey`}
                      accessible={survey.display}
                    />
                  </div>
                </div>
              </>
            ) : null}

            {!isTeacher &&
            state.roomData.lessons.length > 0 &&
            assessmentsSurveys.length > 0 ? (
              <SectionTitleV3
                fontSize="2xl"
                fontStyle="bold"
                title={classRoomDict[userLanguage]['LIST_LESSON']}
              />
            ) : null}

            {showClassDetails && (
              <div
                className={`w-full min-h-56 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4`}>
                <UnderlinedTabs tabs={!isTeacher ? tabs : tabsForTeacher} />
              </div>
            )}
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default Classroom;
