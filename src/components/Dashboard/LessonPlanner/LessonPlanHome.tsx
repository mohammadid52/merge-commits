import React from 'react';
import Classroom from '../Classroom/Classroom';
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

interface LessonPlanHome extends DashboardProps {
  homeData: any[];
}

const LessonPlanHome: React.FC<LessonPlanHome> = (props: LessonPlanHome) => {
  const {
    setClassroomCurriculum,
    classroomCurriculum,
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
    homeData,
    handleRoomSelection
  } = props;

  return (
    <Classroom
      homeData={homeData}
      setClassroomCurriculum={setClassroomCurriculum}
      classroomCurriculum={classroomCurriculum}
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
