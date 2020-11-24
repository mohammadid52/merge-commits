import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import * as customQueries from '../../../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import Today from './TodayLesson';
import Upcoming from './Upcoming';
import Completed from './Completed';
import Dashboard from './Dashboard';
import Loading from '../../Lesson/Loading/ComponentLoading';
import SurveyCard from './SurveyCard';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import queryString from 'query-string';

import useDeviceDetect from '../../../customHooks/deviceDetect';

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

  const [listCurriculum, setListCurriculum] = useState<Array<CurriculumInfo>>();
  const [status, setStatus] = useState('');

  async function getCourse(id: string) {
    let limit = 2;
    try {
      const course: any = await API.graphql(
        graphqlOperation(customQueries.getCourse, { id: id })
      );
      const lessonsInfo = course.data.getCourse.classrooms.items;
      const nextLesson = lessonsInfo.lesson;
      setCurriculum(nextLesson);
      setListCurriculum(lessonsInfo);
      if (state.user.onBoardSurvey) setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }

  // async function getClassroom(id: string) {
  //   let queryParams = queryString.parse(location.search)

  //   try {
  //       // this any needs to be changed once a solution is found!!!
  //       const classroom: any = await API.graphql(graphqlOperation(customQueries.getClassroom, { id: id }))
  //       // console.log('classroom data', classroom);
  //       console.log(classroom.data.getClassroom, 'classroom')
  //       setOpen(classroom.data.getClassroom.open)
  //       // dispatch({
  //       //   type: 'INITIAL_LESSON_SETUP', 
  //       //   payload: { 
  //       //     pages: classroom.data.getClassroom.lessonPlan, 
  //       //     data: classroom.data.getClassroom,
  //       //     students: classroom.data.getClassroom.data.items
  //       // }})
  //       // subscription = subscribeToStudentData()
  //   } catch (error) {
  //       console.error(error)
  //   }
  // }


  const getSurvey = async () => {
    try {
      const surveyData: any = await API.graphql(
        graphqlOperation(customQueries.getClassroom, { id: 'on-boarding-survey-1' })
      );
      // console.log('survey', surveyData)
      await setSurvey(() => {
        // let surveyStatus: boolean = state.user.onBoardSurvey ? !state.user.onBoardSurvey : true;,
        // console.log(surveyStatus, 'status', state);

        return {
          ...survey,
          // display: surveyStatus,
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
   * 
   * AUTO-PUSH TO SPECIFIC LESSON
   * 
   * 
   */

  useEffect(() => {
    getCourse('1');

    // history.push('/lesson?id=2');
  }, []);

  useEffect(() => {
    if (!state.user.onBoardSurvey && !survey.data) {
      getSurvey();
    }

    if (state.user.onBoardSurvey) {
      // console.log('user', state.user);
      setSurvey(() => {
        // console.log('setFalse');
        return {
          ...survey,
          display: false,
        };
      });
    }

    if (!state.user.onBoardSurvey) {
      // console.log('user', state.user);
      setSurvey(() => {
        // console.log('setTrue');
        return {
          ...survey,
          display: true,
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
      <div className='transform translate-y-12'>
        {survey.display ? (
          <div className={` bg-opacity-10`} >
            <div className={`${theme.section} p-4`}>
              <h2 className={`text-xl w-full ${theme.dashboard.sectionTitle}`}>
                Welcome to Iconoclast Artists
              </h2>
            </div>
          </div>
        ) : (
            ''
          )}

        {survey.display ? (
          <div>
            <div className={`${theme.section} p-4`}>
              <SurveyCard link={'/lesson?id=on-boarding-survey-1'} curriculum={curriculum} />
            </div>
          </div>
        ) : null}

        <div className={`bg-opacity-10`}>
          <div className={`${theme.section} p-4 text-xl m-auto`}>
            <h2 className={`text-xl w-full ${theme.dashboard.sectionTitle}`}>
              Today's Lesson
            </h2>

            <Today display={survey.display} link={'/lesson?id=1'} curriculums={listCurriculum} />
          </div>
        </div>

        <div className={`bg-grayscale-light bg-opacity-10`}>
          <div className={`${theme.section} p-4 text-xl m-auto`}>
            <h2 className={`text-xl w-full ${theme.dashboard.sectionTitle}`}>
              Upcoming Lessons
            </h2>

            <Upcoming curriculum={listCurriculum} />
            {/* <Dashboard /> */}
          </div>
        </div>
      </div>
    );
  }
};

export default Classroom;
