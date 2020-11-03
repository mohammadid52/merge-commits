import React, { useState, useEffect, useContext } from 'react';
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
  const [today, setToday] = useState<CurriculumInfo>();
  const [test, setTest] = useState<any>();

  async function getCourse(id: string) {
    try {
      const courses: any = await API.graphql(
        graphqlOperation(customQueries.getCourse, { id: '1' })
      );
      const classrooms = courses.data.getCourse.classrooms
      const testLesson = classrooms.items

      (console.log(classrooms.items, 'testLesson'))
      
      const lesson = courses.data.getCourse.curriculum.lessons.items
      console.log(courses.data, 'data')
      // .slice(0, 3)
      setToday(lesson);

      setTest(testLesson)

      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }

  const curriculumLesson = test
    ? test.filter((value: any, index: number, array: CurriculumInfo[]) => {
        if(!value.complete && value.SELStructure !== null && !value.open ) {
          return value.lesson;
        }
      })
    : [];

    console.log(curriculumLesson, 'test if this works')
  useEffect(() => {
    getCourse('1');
  }, []);

  if (status !== 'done') {
    return <ComponentLoading />;
  }
  {
    return (
      <div className='w-full'>
        <div className={`w-full bg-blueberry text-sm text-white pl-2`}>You're about to teach a lesson!</div>
        <div className='w-64rem text-xl m-auto'>
          <h2 className={`w-64rem text-xl m-auto ${theme.dashboard.sectionTitle}`}>
            Today's Lesson
          </h2>
          <div className={`w-64rem h-9.28/10 md:h-auto flex flex-col mx-auto`}>
            <Today link='/lesson-control?id=1' curriculums={today} />
          </div>
        </div>
      </div>
    );
  }
};

export default LessonPlanHome;
