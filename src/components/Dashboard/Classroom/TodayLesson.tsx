import React, { useEffect, useState } from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';

const Today: React.FC<LessonProps> = (props: LessonProps) => {
  const { isTeacher, lessons } = props;
  const [accessible, setAccessible] = useState<boolean>(true);

  useEffect(() => {
    setAccessible(true);
  }, [props]);

  return (
    <>
      {lessons && lessons.length > 0
        ? lessons.map((value: any, key: number) => {
            return (
              <div id={`todayLesson_${key}_wrapper`} key={`todayLesson_${key}_wrapper`}>
                <StandardLessonCard isTeacher={isTeacher} keyProps={`todayLesson_${key}`} lessonProps={value} accessible={accessible} />
              </div>
            );
          })
        : null}
    </>
  );
};

export default Today;
