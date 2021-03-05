import React from 'react';

import { Lesson, LessonProps } from '../Classroom/Classroom';

export const ImageWidget = (props: { source: string; altdesc?: string; title?: string; card?: boolean, classProp?: string; }) => {
  const { source, altdesc, title, card, classProp } = props;
  return (
    <div className={`p-2`}>
      <div className={`${card ? 'bg-white border border-dark-gray border-opacity-10' : ''} rounded`}>
        {title && <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>{title}:</p>}
        <div className={`bg-white rounded`}>
          <img src={source} className={classProp} alt={altdesc} />
        </div>
      </div>
    </div>
  );
};

export const UpcomingLessonsWidget = (props: LessonProps) => {
  const { setVisibleLessonGroup, lessons } = props;
  const upcomingCount = lessons.length.toString();

  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray  border-opacity-10 cursor-pointer`} onClick={()=>setVisibleLessonGroup('upcoming')}>Upcoming Lessons ({upcomingCount ? upcomingCount : '0'}):</p>
        {lessons && lessons.length > 0
          ? lessons.map((lesson: Lesson, index: number) => {
              return (
                <div key={`upcoming_side_${index}`} className={`p-2 ${index !== lessons.length -1 ? 'border-b border-dark-gray border-opacity-10' : ''}`}>
                  <p className={`text-sm font-semibold text-dark-gray`}>{lesson.lesson.title}</p>
                  <p className={`text-xs text-dark-gray`}>{lesson.lesson.artist.name}</p>
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
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>Teacher's Note:</p>
        <div key={`teacher_side_note`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
          <p className={`text-xs text-dark-gray`}>
          We invite you to use your Notebook for continued reflection throughtout the workshop today.
          </p>
          <p className={`text-xs text-dark-gray`}><em>- Brandi</em></p>
        </div>
      </div>
    </div>
  );
};

export const MediaRecommendation = () => {
  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray  border-opacity-10`}>Recommended Book:</p>
        <div key={`teacher_side_note`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
          <p className={`text-sm font-medium text-dark-gray border-b pb-2`}>Beyond Survival: Strategies and Stories from the Transformative Justice Movement</p>
          <p className={`text-xs text-dark-gray pt-2`}><a href="https://www.amazon.com/Beyond-Survival-Strategies-Transformative-Movement/dp/184935362X" target="_blank"> <b>Click to purchase on Amazon</b></a></p>
        </div>
      </div>
    </div>
  );
};
