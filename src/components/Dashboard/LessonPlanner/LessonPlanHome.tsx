import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import * as customQueries from '../../../customGraphql/customQueries';
import API, { graphqlOperation } from '@aws-amplify/api';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import Classroom from '../Classroom/Classroom';
import { DashboardProps } from '../Dashboard';

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

const LessonPlanHome: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { visibleLessonGroup, setVisibleLessonGroup } = props;
  const [status, setStatus] = useState('');
  const { theme } = useContext(GlobalContext);
  const history = useHistory();
  const [listCurriculum, setListCurriculum] = useState<Array<CurriculumInfo>>();

  async function getCourse(id: string) {
    try {
      const courses: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: '1' }));
      const lessons = courses.data.getCourse.classrooms.items;
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
      <Classroom
        isTeacher={true}
        visibleLessonGroup={visibleLessonGroup}
        setVisibleLessonGroup={setVisibleLessonGroup}
      />
    );
  }
};

export default LessonPlanHome;
