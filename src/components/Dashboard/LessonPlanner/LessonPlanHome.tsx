import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import * as customQueries from '../../../customGraphql/customQueries';
import * as customMutations from '../../../customGraphql/customMutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import Classroom, { Syllabus } from '../Classroom/Classroom';
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
  const {
    currentPage,
    activeRoom,
    visibleLessonGroup,
    setVisibleLessonGroup,
    lessonLoading,
    setLessonLoading,
    syllabusLoading,
    setSyllabusLoading,
  } = props;
  const [status, setStatus] = useState('');
  const { state, theme, dispatch } = useContext(GlobalContext);
  const history = useHistory();
  const [listCurriculum, setListCurriculum] = useState<Array<CurriculumInfo>>();

  // useEffect(() => {
  //   getCourse('1');
  // }, []);
  //
  // async function getCourse(id: string) {
  //   try {
  //     const courses: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: '1' }));
  //     const lessons = courses.data.getCourse.classrooms.items;
  //     setListCurriculum(lessons);
  //     setStatus('done');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const handleSyllabusActivation = async (syllabusID: string) => {
    const roomID = activeRoom;
    const syllabusArray = state.roomData.syllabus;
    const updatedSyllabusArray = syllabusArray.map((syllabus: Syllabus) => {
      if (syllabus.id === syllabusID) {
        return { ...syllabus, active: true };
      } else {
        return { ...syllabus, active: false };
      }
    });
    const roomStateObject = state.roomData.rooms.reduce((acc: {}, room: any) => {
      if (room.id === roomID) {
        return { ...acc, room };
      } else {
        return acc;
      }
    }, {});
    const input = {
      id: roomID,
      institutionID: roomStateObject.room.institutionID,
      classID: roomStateObject.room.classID,
      teacherAuthID: roomStateObject.room.teacherAuthID,
      teacherEmail: roomStateObject.room.teacherEmail,
      name: roomStateObject.room.name,
      maxPersons: roomStateObject.room.maxPersons,
      activeSyllabus: syllabusID,
    };

      console.log('lessonplanner -> roomstateObj -> ', roomStateObject )
    try {
      const updateRoomMutation: any = API.graphql(graphqlOperation(customMutations.updateRoom, { input }));
      const response = await updateRoomMutation;
    } catch (e) {
      console.error('handleSyllabusActivation: ', e);
    } finally {
      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'syllabus',
          data: updatedSyllabusArray,
        },
      });
    }
  };

  // if (status !== 'done') {
  //   return <ComponentLoading />;
  // }
  return (
    <Classroom
      activeRoom={activeRoom}
      currentPage={currentPage}
      isTeacher={true}
      visibleLessonGroup={visibleLessonGroup}
      setVisibleLessonGroup={setVisibleLessonGroup}
      handleSyllabusActivation={handleSyllabusActivation}
      lessonLoading={lessonLoading}
      setLessonLoading={setLessonLoading}
      syllabusLoading={syllabusLoading}
      setSyllabusLoading={setSyllabusLoading}
    />
  );
};

export default LessonPlanHome;
