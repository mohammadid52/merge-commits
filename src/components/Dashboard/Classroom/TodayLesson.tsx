import React, { useContext, useEffect, useState } from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import Loader from '../../Atoms/Loader';

const Today: React.FC<LessonProps> = (props: LessonProps) => {
  const { activeRoom, activeRoomInfo, isTeacher, lessonLoading, lessons } = props;
  const { state, theme, clientKey, userLanguage } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);
  const [accessible, setAccessible] = useState<boolean>(true);

  useEffect(() => {
    setAccessible(true);
  }, [props]);

  const emptyStyles = 'flex justify-center items-center w-full h-48';

  return (
    <>
      {classRoomDict && lessonLoading ? (
        <div className={`${emptyStyles}`}>
          <div className="w-3/10">
            <Loader color="rgba(107, 114, 128, 1)" />
            <p className="mt-2 text-center text-lg text-gray-500">Loading lessons...</p>
          </div>
        </div>
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

      {/*{activeRoom === '' ? (
        <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
          ⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_CLASSROOM}...
        </div>
      ) : null}*/}

      {activeRoom !== '' && !lessonLoading && lessons.length === 0 ? (
        <div className={`${emptyStyles}`}>
          <p className="text-center text-lg text-gray-500">{classRoomDict[userLanguage].MESSAGES.NO_LESSONS}</p>
        </div>
      ) : null}
    </>
  );
};

export default Today;
