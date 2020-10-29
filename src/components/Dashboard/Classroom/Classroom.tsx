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
  const [today, setToday] = useState<any>();
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

      console.log(course);
      
      const lesson = course.data.getCourse.curriculum.lessons.items.slice(1, 2)
      const nextLesson = lesson.lesson;
      
      const lessonsInfo = course.data.getCourse.curriculum.lessons.items;
      console.log(lessonsInfo, 'courses')
      setToday(lesson);
      setCurriculum(nextLesson);
      setListCurriculum(lessonsInfo.slice(2, 7));
      if (state.user.onBoardSurvey) setStatus('done');
      // console.log(lessonsInfo, 'list');
    } catch (error) {
      console.error(error);
    }
  }

  // const [ open, setOpen ] = useState<any>();

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

  // console.log(open, 'lesson')

  // useEffect(() => {
  //   getClassroom('1')
  // }, [])


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

  useEffect(() => {
    getCourse('1');

    // history.push('/lesson?id=1');
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
      <div
        className={`h-9.28/10 md:h-auto flex flex-col justify-center items-center overflow-scroll md:overflow-auto `}>
        <p className='md:hidden text-xl text-center flex justify-center mb-4' style={{ top: '0' }}>
          * lessons are available on PC or laptop *
        </p>
        <div className='w-full bg-opacity-10'>
          {survey.display ? (
            <h2 className={`w-64rem text-xl m-auto ${theme.dashboard.sectionTitle}`}>
              Welcome to Iconoclast Artists
            </h2>
          ) : (
            ''
          )}
        </div>

        {survey.display ? (
          <SurveyCard link={'/lesson?id=on-boarding-survey-1'} curriculum={curriculum} />
        ) : null}

        <div className='w-full bg-opacity-10'>
          <div className='w-64rem text-xl m-auto'>
            <h2 className={`w-64rem text-xl m-auto ${theme.dashboard.sectionTitle}`}>
              Today's Lesson
            </h2>

            <Today display={survey.display} link={'/lesson?id=1'} curriculums={today} />
          </div>
        </div>

        <div className='w-full bg-grayscale-light bg-opacity-10'>
          <div className='w-64rem text-xl m-auto'>
            <h2 className={`w-64rem text-xl m-auto ${theme.dashboard.sectionTitle}`}>
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
