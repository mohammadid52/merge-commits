import React, { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Link } from 'react-router-dom';
import Today from '../Classroom/TodayLessonTeacher';
import Upcoming from '../Classroom//Upcoming';
import Completed from '../Classroom/Completed';
import * as customQueries from '../../../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import Dashboard from '../Classroom/Dashboard';

export interface Artist {
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

const LessonPlanHome = () => {
  const [status, setStatus] = useState('');
  const { theme } = useContext(GlobalContext);
  const history =  useHistory();
  const [listCurriculum, setListCurriculum] = useState<Array<CurriculumInfo>>();

  async function getCourse(id: string) {
    try {
      const courses: any = await API.graphql(
        graphqlOperation(customQueries.getCourse, { id: '1' })
      );
      const lessons = courses.data.getCourse.classrooms.items
      setListCurriculum(lessons);
      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    getCourse('1');

    // history.push('/lesson-control?id=1')
  }, []);



  

  if (status !== 'done') {
    return <ComponentLoading />;
  }
  {
    return (
      <div className='w-full'>
        <div className='w-256 text-xl m-auto'>
          <h2 className={`w-256 text-xl m-auto ${theme.dashboard.sectionTitle}`}>
            Today's Lesson
          </h2>
          <div className={`w-256 h-9.28/10 md:h-auto flex flex-col mx-auto`}>
            <Today link='/lesson-control?id=1' curriculums={listCurriculum} />
            {/* <Link to="/lesson-control?id=1">
                Teacher View 
            </Link> */}
            {/* <Upcoming curriculum={listCurriculum}/> */}
            <Dashboard />
          </div>
        </div>
      </div>
    );
  }
};

export default LessonPlanHome;
