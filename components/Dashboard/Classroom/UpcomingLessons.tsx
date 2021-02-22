import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { LessonProps } from './Classroom';
import SmallLessonCard from './LessonCards/SmallLessonCard';

const UpcomingLessons: React.FC<LessonProps> = (props: LessonProps) => {
  const { lessons } = props;
  const { theme } = useContext(GlobalContext);
  const [openCards, setOpenCards] = useState<string>('');

  return (
    <div className={`relative h-auto flex flex-wrap justify-start`}>
      {lessons && lessons.length > 0
        ? lessons.map((lesson: any, i: number) => (
            <div key={`upcoming-${i}_parent`} className={`relative pl-2 pr-2 w-2.5/10 h-100 transition ease-in-out duration-500`}>
              <SmallLessonCard
                keyProps={`upcoming-${i}`}
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
