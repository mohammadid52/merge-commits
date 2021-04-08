import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import { LessonProps } from './Classroom';
import SmallLessonCard from './LessonCards/SmallLessonCard';

const UpcomingLessons: React.FC<LessonProps> = (props: LessonProps) => {
  const { lessons, activeRoomInfo } = props;
  const { theme, clientKey, userLanguage } = useContext(GlobalContext);
  const [openCards, setOpenCards] = useState<string>('');
  const { classRoomDict } = useDictionary(clientKey);

  return (
    <div className={`relative flex flex-wrap justify-start`}>
      {lessons.length === 0 && (
        <div className={`flex justify-center items-center w-full h-48`}>
          <p className="text-center text-lg text-gray-500">No Upcoming Lessons...</p>
        </div>
      )}

      {lessons && lessons.length > 0
        ? lessons.map((lesson: any, i: number) => (
            <div
              key={`upcoming-${i}_parent`}
              className={`relative pl-2 pr-2 w-2.5/10 h-100 transition ease-in-out duration-500`}>
              <SmallLessonCard
                keyProps={`upcoming-${i}`}
                activeRoomInfo={activeRoomInfo}
                lessonProps={lesson}
                openCards={openCards}
                setOpenCards={setOpenCards}
                lessonType={lesson.lesson.type}
              />
            </div>
          ))
        : null}
    </div>
  );
};

export default UpcomingLessons;
