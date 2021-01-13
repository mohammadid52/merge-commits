import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import * as customQueries from '../../../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import Today from './TodayLesson';
import Upcoming from './Upcoming';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import SurveyCard from './SurveyCard';
import TodayUpcomingTabs from './TodayUpcomingTabs';

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

const Classroom: React.FC = () => {
  const history = useHistory();
  const { state, theme } = useContext(GlobalContext);
  const [curriculum, setCurriculum] = useState<CurriculumInfo>();
  const [survey, setSurvey] = useState<any>({
    display: false,
    data: null,
  });
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('');
  const [listCurriculum, setListCurriculum] = useState<Array<CurriculumInfo>>();
  const [status, setStatus] = useState('today');

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
      // console.log('survey', surveyData)
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
   *
   * AUTO-PUSH TO SPECIFIC LESSON
   *
   */

  useEffect(() => {
    getCourse('1');

    // history.push('/lesson?id=2');
  }, []);

  /**
   *
   * ssSSSssHOW SURVEY IF IT HAS NOT BEEN COMPLETED
   *
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

  const handleLink = () => {
    history.push('/lesson');
  };

  if (status !== 'done') {
    return <ComponentLoading />;
  }
  {
    return (
      <>
        {/**
         *  ASSESSMENTS/SURVEYS
         */}
        {survey.display ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <h2 className={`text-xl w-full ${theme.dashboard.sectionTitle}`}>Welcome to Iconoclast Artists</h2>

              <SurveyCard link={'/lesson?id=on-boarding-survey-1'} curriculum={curriculum} />
            </div>
          </div>
        ) : null}

        {/**
         *  LESSON TAB TOGGLE
         */}
        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} p-4 text-xl m-auto`}>
            <TodayUpcomingTabs visibleLessonGroup={visibleLessonGroup} setVisibleLessonGroup={setVisibleLessonGroup} />
          </div>
        </div>

        {/**
         *  LESSONS
         */}
        {visibleLessonGroup === 'today' ? (
          <div className={`bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <Today link={'/lesson?id=1'} curriculums={listCurriculum} />
            </div>
          </div>
        ) : null}

        {visibleLessonGroup === 'upcoming' ? (
          <div className={`bg-grayscale-light bg-opacity-10`}>
            <div className={`${theme.section} p-4 text-xl m-auto`}>
              <Upcoming curriculum={listCurriculum} />
            </div>
          </div>
        ) : null}
      </>
    );
  }
};

export default Classroom;
