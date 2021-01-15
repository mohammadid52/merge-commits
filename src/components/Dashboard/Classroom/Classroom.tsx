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

interface DataObject {
  [key: string]: any;
}

export interface Lesson {
  id: string;
  open: boolean;
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
  keyProps: string;
  lessonProps: Lesson;
  accessible?: boolean;
  openCards?: string;
  setOpenCards?: React.Dispatch<React.SetStateAction<string>>;
  lessonType?: string;
}

const Classroom: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { visibleLessonGroup, setVisibleLessonGroup } = props;
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

  async function getCourse(id: string) {
    try {
      const course: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: id }));
      const lessonsInfo = course.data.getCourse.classrooms.items;
      const nextLesson = lessonsInfo.lesson;
      setCurriculum(nextLesson);
      setListCurriculum(lessonsInfo);
      if (state.user.onBoardSurvey) setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }

  const getSurvey = async () => {
    try {
      const surveyData: any = await API.graphql(
        graphqlOperation(customQueries.getClassroom, { id: 'on-boarding-survey-1' })
      );
      await setSurvey(() => {
        let surveyStatus: boolean = state.user.onBoardSurvey ? !state.user.onBoardSurvey : true;
        console.log(surveyStatus, 'status', state);

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
  const assessmentsSurveys = listCurriculum
    ? listCurriculum.filter((lesson: Lesson, index: number) => {
      if (lesson.id.includes('on-boarding-survey-1') || lesson.id.includes('assessment')) {
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
  const todayLessons = listCurriculum
    ? listCurriculum.filter((lesson: Lesson, index: number) => {
        if (lesson.open && lesson.id !== 'on-boarding-survey-1') {
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
  const upcomingLessons = listCurriculum
    ? listCurriculum.filter((lesson: Lesson, index: number) => {
        if (!lesson.open && lesson.id !== 'on-boarding-survey-1') {
          if (!lesson.complete) {
            return lesson;
          }
        }
      })
    : [];

  /**
   * Completed Lessons -
   *  This array is a filter of lessons which are completed, closed or open
   */
  const completedLessons = listCurriculum
    ? listCurriculum.filter((lesson: Lesson, index: number) => {
        if (lesson.complete) {
          return lesson;
        }
      })
    : [];

  /**
   * LIFECYCLE - on mount
   */

  useEffect(() => {
    getCourse('1');
    // history.push('/lesson?id=2');
  }, []);

  useEffect(() => {
    if (listCurriculum && listCurriculum.length > 0) {
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
  }, [listCurriculum]);

  /**
   * ssSSSssHOW SURVEY IF IT HAS NOT BEEN COMPLETED
   */

  useEffect(() => {
    if (!state.user.onBoardSurvey && !survey.data) {
      getSurvey();
    }

    // if (true) {
    //   setSurvey(() => {
    //     return {
    //       ...survey,
    //       display: false,
    //     };
    //   });
    // }

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

  if (status !== 'done') {
    return <ComponentLoading />;
  }
  if (status === 'done') {
    return (
      <>
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} px-4 pb-4 m-auto`}>
            <h2 className={`w-full text-xl border-b border-dark-gray ${theme.dashboard.sectionTitle} pb-1`}>
              Classroom
            </h2>
          </div>
        </div>

        {/**
         *  ASSESSMENTS/SURVEYS
         */}
        {listCurriculum && survey.display ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} px-4 text-xl m-auto`}>
              <h2 className={`text-xl w-full ${theme.dashboard.sectionTitle}`}>Surveys & Assessments</h2>
            </div>
          </div>
        ) : null}

        {listCurriculum && survey.display ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <SurveyCard link={'/lesson?id=on-boarding-survey-1'} curriculum={curriculum} lessons={assessmentsSurveys} lessonType={`survey`} accessible={survey.display}/>
            </div>
          </div>
        ) : null}

        {/**
         *  LESSON TAB TOGGLE
         */}
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} px-4 text-xl m-auto`}>
            <TodayUpcomingTabs
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
        {listCurriculum && listCurriculum.length > 0 && visibleLessonGroup === 'today' ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <Today lessons={todayLessons} />
            </div>
          </div>
        ) : null}

        {listCurriculum && listCurriculum.length > 0 && visibleLessonGroup === 'upcoming' ? (
          <div className={`bg-grayscale-light bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <UpcomingLessons lessons={upcomingLessons} />
            </div>
          </div>
        ) : null}

        {listCurriculum && listCurriculum.length > 0 && visibleLessonGroup === 'completed' ? (
          <div className={`bg-grayscale-light bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <CompletedLessons lessons={completedLessons} />
            </div>
          </div>
        ) : null}
      </>
    );
  }
};

export default Classroom;
