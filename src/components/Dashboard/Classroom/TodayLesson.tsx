import React, { useContext, useEffect, useState } from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';
import { GlobalContext } from '../../../contexts/GlobalContext';

const Today: React.FC<LessonProps> = (props: LessonProps) => {
  const { theme } = useContext(GlobalContext);
  const { activeRoom, activeRoomInfo,isTeacher, lessonLoading, lessons } = props;
  const [accessible, setAccessible] = useState<boolean>(true);

  useEffect(() => {
    setAccessible(true);
  }, [props]);

  return (
    <>
      {lessonLoading ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>Loading lessons...</div>
      ) : null}

      {!lessonLoading && lessons.length > 0
        ? lessons.map((lesson: any, key: number) => {
            return (
              <div id={`todayLesson_${key}_wrapper`} key={`todayLesson_${key}_wrapper`}>
                <StandardLessonCard
                  isTeacher={isTeacher}
                  keyProps={`todayLesson_${key}`}
                  activeRoomInfo={activeRoomInfo}
                  lessonProps={lesson}
                  accessible={accessible}
                  lessonType={lesson.lesson.type}
                />
              </div>
            );
          })
        : null}

      {activeRoom === '' ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>⬅️ Select a classroom to see applicable lessons...</div>
      ) : null}

      {activeRoom !== '' && !lessonLoading && lessons.length === 0 ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>No lessons...</div>
      ) : null}
    </>
  );
};

export default Today;
