import React, { useContext, useEffect, useState } from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

const Today: React.FC<LessonProps> = (props: LessonProps) => {
  const { activeRoom, activeRoomInfo, isTeacher, lessonLoading, lessons } = props;
  const { state, theme, clientKey, userLanguage  } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);
  const [accessible, setAccessible] = useState<boolean>(true);

  useEffect(() => {
    setAccessible(true);
  }, [props]);

  return (
    <>
      {classRoomDict && lessonLoading ? (
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
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
          ⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_CLASSROOM}...
        </div>
      ) : null}

      {activeRoom !== '' && !lessonLoading && lessons.length === 0 ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
          {classRoomDict[userLanguage].MESSAGES.NO_LESSONS}...
        </div>
      ) : null}
    </>
  );
};

export default Today;
