import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../../../contexts/GlobalContext';
import * as customMutations from '../../../customGraphql/customMutations';
import * as mutations from '../../../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';
import Classroom, {Syllabus} from '../Classroom/Classroom';
import {DashboardProps} from '../Dashboard';

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
    setCurrentPage,
    activeRoomInfo,
    setActiveRoomInfo,
    visibleLessonGroup,
    setVisibleLessonGroup,
    lessonLoading,
    setLessonLoading,
    syllabusLoading,
    setSyllabusLoading,
    handleRoomSelection,
  } = props;

  // const {state, dispatch} = useContext(GlobalContext);
  // useHistory();

  /**
   *
   * THIS COMPONENT HAS BECOME REDUNDANT
   * SYLLABUSACTIVATION PUSHED TO CLASSROOM.tsx
   *
   */

  // const handleSyllabusActivation = async (syllabusID: string) => {
  //   const roomID = activeRoomInfo.id;
  //   const syllabusArray = state.roomData.syllabus;
  //   const updatedSyllabusArray = syllabusArray.map((syllabus: Syllabus) => {
  //     if (syllabus.id === syllabusID) {
  //       return {...syllabus, active: true};
  //     } else {
  //       return {...syllabus, active: false};
  //     }
  //   });
  //   const roomStateObject = state.roomData.rooms.reduce((acc: {}, room: any) => {
  //     if (room.id === activeRoomInfo.id) {
  //       return {...acc, room};
  //     } else {
  //       return acc;
  //     }
  //   }, {});
  //
  //   try {
  //     const updateRoomMutation: any = API.graphql(
  //       graphqlOperation(mutations.updateRoom, {
  //         id: activeRoomInfo.id,
  //         activeSyllabus: syllabusID,
  //       })
  //     );
  //     await updateRoomMutation;
  //   } catch (e) {
  //     console.error('handleSyllabusActivation: ', e);
  //   } finally {
  //     dispatch({
  //       type: 'UPDATE_ROOM',
  //       payload: {
  //         property: 'syllabus',
  //         data: updatedSyllabusArray,
  //       },
  //     });
  //   }
  // };

  return (
    <Classroom
      handleRoomSelection={handleRoomSelection}
      activeRoomInfo={activeRoomInfo}
      setActiveRoomInfo={setActiveRoomInfo}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isTeacher={true}
      visibleLessonGroup={visibleLessonGroup}
      setVisibleLessonGroup={setVisibleLessonGroup}
      lessonLoading={lessonLoading}
      setLessonLoading={setLessonLoading}
      syllabusLoading={syllabusLoading}
      setSyllabusLoading={setSyllabusLoading}
    />
  );
};

export default LessonPlanHome;
