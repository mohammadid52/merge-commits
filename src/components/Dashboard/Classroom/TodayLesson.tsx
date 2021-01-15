import React, { useEffect, useState } from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';

const Today: React.FC<LessonProps> = (props: LessonProps) => {
  const { lessons } = props;
  const [accessible, setAccessible] = useState<boolean>(true);


  useEffect(() => {
    setAccessible(true);
  }, [props]);

  return (
    <>
      {lessons && lessons.length > 0
        ? lessons.map((value: any, key: number) => {
            return (
              <StandardLessonCard keyProps={`todayLesson_${key}`} lessonProps={value} accessible={accessible}/>
            );
          })
        : null}
    </>
  );
};

export default Today;
