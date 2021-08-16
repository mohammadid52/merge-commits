import React from 'react';
import { LessonProps } from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';

const CompletedLessons: React.FC<LessonProps> = (props: LessonProps) => {
  const { isTeacher, lessons } = props;

  return (
    <>
      {lessons?.length === 0 && (
        <div className={`flex justify-center items-center w-full h-48`}>
          <p className="text-center text-lg text-gray-500">No Completed Lessons...</p>
        </div>
      )}
      {lessons && lessons?.length > 0
        ? lessons.map((value: any, key: number) => {
            return (
              <div id={`completedLesson_${key}_wrapper`} key={`completedLesson_${key}_wrapper`}>
                <StandardLessonCard
                  isTeacher={isTeacher}
                  keyProps={`completedLesson_${key}`}
                  lessonProps={value}
                  accessible={false}
                  lessonType={value.lesson.type}
                />
              </div>
            );
          })
        : null}
    </>
  );
};

export default CompletedLessons;
