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
        className={`h-9.28/10 md:h-auto flex flex-col justify-center items-center p-8 overflow-scroll md:overflow-auto `}>
        <p className='md:hidden text-xl text-center flex justify-center mb-4' style={{ top: '0' }}>
          * lessons are available on PC or laptop *
        </p>
        {survey.display ? (
          <h2 className='w-64rem text-xl'>
            <p className='w-auto text-black pb-2 font-light'>Welcome to Iconoclast Artists</p>
          </h2>
        ) : (
          ''
        )}

        {survey.display ? (
          <SurveyCard link={'/lesson?id=on-boarding-survey-1'} curriculum={curriculum} />
        ) : null}

        <h2 className='w-64rem text-xl'>
          <p className='w-auto text-black pb-2 font-light'>Today's Lesson</p>
        </h2>

        <Today display={survey.display} link={'/lesson?id=1'} curriculum={curriculum} />

        <h2 className='w-64rem text-xl'>
          <p className='w-auto text-black pb-2 font-light'>Upcoming Lessons</p>
        </h2>

        <Upcoming curriculum={listCurriculum} />
        {/* <Dashboard /> */}
      </div>
    );
  }
};

export default Classroom;
