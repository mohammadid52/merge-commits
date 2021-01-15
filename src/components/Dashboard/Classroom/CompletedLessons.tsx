import React from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';

const CompletedLessons: React.FC<LessonProps> = (props: LessonProps) => {
  const { lessons } = props;

  return (
    <>
      {lessons && lessons.length > 0
        ? lessons.map((value: any, key: number) => {
            return <StandardLessonCard keyProps={`todayLesson_${key}`} lessonProps={value} accessible={false} />;
          })
        : null}
    </>
  );
};

export default CompletedLessons;
