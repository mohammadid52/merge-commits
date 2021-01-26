import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import * as customQueries from '../../../customGraphql/customQueries';
import API, { graphqlOperation } from '@aws-amplify/api';
import TodayUpcomingTabs from './TodayUpcomingTabs';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import SurveyCard from './SurveyCard';
import Today from './TodayLesson';
import UpcomingLessons from './UpcomingLessons';
import CompletedLessons from './CompletedLessons';
import { DashboardProps } from '../Dashboard';
import TopWidgetBar from '../TopWidgetBar/TopWidgetBar';
import DateAndTime from '../DateAndTime/DateAndTime';

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
  open: boolean;
  status?: string;
  openedAt: string;
  closedAt: string;
  complete: boolean;
  roster: string[];
  viewing: any;
  expectedStartDate: string;
  expectedEndDate: string;
  SELStructure?: string;
  courseID: string;
  lessonID: string;
  lesson: {
    id?: string;
    title: string;
    artist?: any;
    language: string;
    summary: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LessonProps extends DashboardProps {
  lessons: Lesson[];
}

export interface LessonCardProps {
  isTeacher?: boolean;
  keyProps: string;
  lessonProps: Lesson;
  accessible?: boolean;
  openCards?: string;
  setOpenCards?: React.Dispatch<React.SetStateAction<string>>;
  lessonType?: string;
}

const Classroom: React.FC<DashboardProps> = (props: DashboardProps) => {
  const {
    isTeacher,
    currentPage,
    activeRoom,
    setActiveRoom,
    visibleLessonGroup,
    setVisibleLessonGroup,
    handleSyllabusActivation,
    lessonLoading,
    setLessonLoading,
    syllabusLoading,
    setSyllabusLoading,
  } = props;
  const { state, theme, dispatch } = useContext(GlobalContext);
  const [curriculum, setCurriculum] = useState<CurriculumInfo>();
  const [survey, setSurvey] = useState<any>({
    display: false,
    data: null,
  });

  const [listCurriculum, setListCurriculum] = useState<Lesson[]>();
  const [status, setStatus] = useState('today');
  const [lessonGroupCount, setLessonGroupCount] = useState<{ today: string; upcoming: string; completed: string }>({
    today: '0',
    upcoming: '0',
    completed: '0',
  });

  /**
   * LIFECYCLE - on mount
   *
   * TODO:
   *  Tell Mike about the getCourse('1') below
   *  This will essentially fetch the lessons associated
   *  with a course or room
   */

  // LEGACY CODE
  // useEffect(() => {
  //   getCourse('1');
  // }, []);

  useEffect(() => {
    if (state.roomData.lessons && state.roomData.lessons.length > 0) {
      const todayCount = todayLessons.length.toString();
      const upcomingCount = upcomingLessons.length.toString();
      const completedCount = completedLessons.length.toString();

      setLessonGroupCount({
        today: todayCount,
        upcoming: upcomingCount,
        completed: completedCount,
      });

      dispatch({
        type: 'UPDATE_SIDEBAR',
        payload: {
          section: 'upcomingLessons',
          data: upcomingLessons,
        },
      });
    }
  }, [state.roomData.lessons]);

  /**
   * ssSSSssHOW SURVEY IF IT HAS NOT BEEN COMPLETED
   */

  useEffect(() => {
    if (!state.user.onBoardSurvey && !survey.data) {
      getSurvey();
    }

    if (!state.user.onBoardSurvey) {
      setSurvey(() => {
        return {
          ...survey,
          display: true,
        };
      });
    } else {
      setSurvey(() => {
        return {
          ...survey,
          display: false,
        };
      });
    }
  }, [state]);

  // async function getCourse(id: string) {
  //   try {
  //     const course: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: id }));
  //     const lessonsInfo = course.data.getCourse.classrooms.items;
  //     const nextLesson = lessonsInfo.lesson;
  //     setCurriculum(nextLesson);
  //     setListCurriculum(lessonsInfo);
  //     if (state.user.onBoardSurvey) setStatus('done');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const getSurvey = async () => {
    try {
      const surveyData: any = await API.graphql(
        graphqlOperation(customQueries.getClassroom, { id: 'on-boarding-survey-1' })
      );
      await setSurvey(() => {
        let surveyStatus: boolean = state.user.onBoardSurvey ? !state.user.onBoardSurvey : true;

        return {
          ...survey,
          display: surveyStatus,
          data: surveyData.data.getClassroom,
        };
      });
      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * ASSESSMENTS & SURVEYS
   *  Array which filters out only surveys/assessments
   */
  const assessmentsSurveys = state.roomData.lessons.length > 0
    ? state.roomData.lessons.filter((lesson: Lesson, index: number) => {
        if (lesson.lessonID.includes('on-boarding-survey-1') || lesson.lessonID.includes('assessment')) {
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
      ? state.roomData.lessons.filter((lesson: Lesson, index: number) => {
          if (lesson.status === 'Active' && lesson.id !== 'on-boarding-survey-1') {
            if (!lesson.complete) {
              return lesson;
            }
          }
        })
      : [];

  /**
   * Upcoming Lessons -
   *  This array is a filter of lessons which are closed, but not completed
   */
  const upcomingLessons = state.roomData.lessons.length > 0
    ? state.roomData.lessons.filter((lesson: Lesson, index: number) => {
        if (lesson.status === 'Inactive' && lesson.id !== 'on-boarding-survey-1') {
          if (!lesson.complete) {
            return lesson;
          }
        }
      })
    : [];

  const todayAndUpcomingLessons = [...todayLessons, ...upcomingLessons];

  /**
   * Completed Lessons -
   *  This array is a filter of lessons which are completed, closed or open
   */
  const completedLessons = state.roomData.lessons.length > 0
    ? state.roomData.lessons.filter((lesson: Lesson, index: number) => {
        if (lesson.complete) {
          return lesson;
        }
      })
    : [];

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

  if (status !== 'done') {
    return <ComponentLoading />;
  }
  if (status === 'done') {
    return (
      <>
        {
          /**
           * TEST DIV FOR ROOM SWITCHING AND LOADING LESSONS/SYLLABUS
           */

          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} px-4 pb-4 m-auto`}>
              {/**
               *  SYLLABUS BOX
               */}
              {currentPage === 'lesson-planner' ? (
                <div className={`p-4 mb-2 bg-mustard-yellow bg-opacity-20`}>
                  <p>Syllabus: </p>
                  {!syllabusLoading && state.roomData?.syllabus?.length > 0 ? (
                    state.roomData.syllabus.map((syllabus: Syllabus, i: number) => {
                      return (
                        <div
                          key={`testSyllabus_${i}`}
                          id={`testSyllabus_${i}`}
                          className={`p-2 mb-1 flex flex-row bg-white rounded`}>
                          <div>
                            <p className={`text-sm text-darker-gray`}>Name: {syllabus.name}</p>
                            <p className={`text-sm text-darker-gray`}>Description: {syllabus.description}</p>
                          </div>
                          <div
                            className={`cursor-pointer text-xl text-blueberry font-semibold`}
                            onClick={() => handleSyllabusActivation(syllabus.id)}>
                            Activate
                          </div>
                        </div>
                      );
                    })
                  ) : !syllabusLoading && state.roomData?.syllabus?.length === 0 ? (
                    <div>No syllabus...</div>
                  ) : (
                    <div>Loading test syllabus...</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        }

        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} px-4 pb-4 m-auto`}>
            <h2 className={`w-full flex text-xl border-b border-dark-gray pb-1 ${theme.dashboard.sectionTitle}`}>
              <span>{!isTeacher ? 'Classroom' : 'Lesson Planner'}</span>
              <span className={`mr-0 text-right`}>
                <DateAndTime />
              </span>
            </h2>
          </div>
        </div>

        {/**
         *  TOP WIDGET BAR
         *  - Hide for teacher
         */}
        {!isTeacher && (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} px-4 pb-4 m-auto`}>
              <TopWidgetBar />
            </div>
          </div>
        )}

        {/**
         *  ASSESSMENTS/SURVEYS
         */}
        {!isTeacher && state.roomData.lessons.length > 0 && survey.display ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} px-4 text-xl m-auto`}>
              <h2 className={`text-xl w-full ${theme.dashboard.sectionTitle}`}>Surveys & Assessments</h2>
            </div>
          </div>
        ) : null}

        {!isTeacher && state.roomData.lessons.length > 0 && survey.display ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <SurveyCard
                link={'/lesson?id=on-boarding-survey-1'}
                lessons={assessmentsSurveys}
                lessonType={`survey`}
                accessible={survey.display}
              />
            </div>
          </div>
        ) : null}

        {/**
         *  LESSON TAB TOGGLE
         */}
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} px-4 text-xl m-auto`}>
            <TodayUpcomingTabs
              isTeacher={isTeacher}
              lessonGroupCount={lessonGroupCount}
              visibleLessonGroup={visibleLessonGroup}
              setVisibleLessonGroup={setVisibleLessonGroup}
            />
          </div>
        </div>

        {/**
         *  LESSONS
         *    - today
         *    - upcoming
         *    - completed
         */}
        {state.roomData.lessons && state.roomData.lessons.length > 0 && visibleLessonGroup === 'today' ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <Today isTeacher={isTeacher} lessons={!isTeacher ? todayLessons : todayAndUpcomingLessons} />
            </div>
          </div>
        ) : null}

        {!isTeacher && state.roomData.lessons && state.roomData.lessons.length > 0 && visibleLessonGroup === 'upcoming' ? (
          <div className={`bg-grayscale-light bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <UpcomingLessons lessons={upcomingLessons} />
            </div>
          </div>
        ) : null}

        {state.roomData.lessons && state.roomData.lessons.length > 0 && visibleLessonGroup === 'completed' ? (
          <div className={`bg-grayscale-light bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <CompletedLessons isTeacher={isTeacher} lessons={sortedLessons(completedLessons, 'expectedEndDate')} />
            </div>
          </div>
        ) : null}
      </>
    );
  }
};

export default Classroom;
