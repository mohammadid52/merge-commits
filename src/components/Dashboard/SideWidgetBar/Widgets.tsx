import React from 'react';

import { Lesson, LessonProps } from '../Classroom/Classroom';

export const UpcomingLessonsWidget = (props: LessonProps) => {
  const { lessons } = props;
  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray  border-opacity-10`}>Upcoming Lessons:</p>
        {lessons && lessons.length > 0
          ? lessons.map((lesson: Lesson, index: number) => {
              return (
                <div key={`upcoming_side_${index}`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
                  <p className={`text-sm text-dark-gray`}>{lesson.lesson.title}</p>
                  <p className={`text-sm text-dark-gray`}>{lesson.lesson.artist.name}</p>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export const TeacherNotifications = () => {
  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray  border-opacity-10`}>Recommended Book:</p>
        <div key={`teacher_side_note`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
          <p className={`text-sm text-dark-gray`}>The Late Mattia Pascal</p>
          <p className={`text-sm text-dark-gray`}>By Luigi Pirandello</p>
        </div>
      </div>
    </div>
  );
};

export const FunWidget = () => {
  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray  border-opacity-10`}>Fun Widget:</p>
        <div key={`teacher_side_note`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
          <img
            src={`https://sayingimages.com/wp-content/uploads/funny-school-dear-teacher-memes.jpg`}
            className={`w-auto h-auto`}
            alt={`funny-meme`}
          />
        </div>
      </div>
    </div>
  );
};
