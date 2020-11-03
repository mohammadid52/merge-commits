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
      const courses: any = await API.graphql(
        graphqlOperation(customQueries.getCourse, { id: id, limit: limit })
      );
      const nextLesson = courses.data.getCourse.curriculum.lessons.items[0].lesson;
      const lessonsInfo = courses.data.getCourse.curriculum.lessons.items;
      setCurriculum(nextLesson);
      setListCurriculum(lessonsInfo.slice(1, 2));
      if (state.user.onBoardSurvey) setStatus('done');
      // console.log(lessonsInfo, 'list');
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
    // history.push('/lesson?id=1')
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
      <div>
        {
          console.log('theme: ', theme)
        }
        <p className='md:hidden text-xl text-center flex justify-center mb-4' style={{ top: '0' }}>
          * lessons are available on PC or laptop *
        </p>
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

            <Today display={survey.display} link={'/lesson?id=1'} curriculum={curriculum} />
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
