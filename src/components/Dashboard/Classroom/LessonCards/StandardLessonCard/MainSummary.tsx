import React, { useContext } from 'react';
import { LessonCardProps } from '../../Classroom';
import { GlobalContext } from '../../../../../contexts/GlobalContext';

const MainSummary = (props: LessonCardProps) => {
  const { theme } = useContext(GlobalContext);
  const { lessonType, lessonProps } = props;

  const reverseDateString = () => {
    if (lessonProps.hasOwnProperty('endDate')) {
      return lessonProps.endDate.split('-').reverse().join('-');
    }
  };
  return (
    <div className={`${lessonType !== 'survey' ? 'h-44' : 'h-auto'} p-4 flex flex-col justify-start items-center`}>
      <h1 className={`${theme.lessonCard.title} mb-2`}>
        <span>{lessonProps.lesson && lessonProps.lesson.title ? lessonProps.lesson.title : null}</span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>
              {lessonProps.complete && lessonProps.endDate ? 'Completed on ' + reverseDateString() : ''}
            </span>
      </h1>
      {
        lessonType === 'survey' ? (
          <p className='overflow-ellipsis overflow-hidden ... text-sm text-left'
             dangerouslySetInnerHTML={{ __html: lessonProps.lesson && lessonProps.lesson?.purpose ? lessonProps.lesson?.purpose : '' }}>
          </p>
        ) : (
          <p className='overflow-ellipsis overflow-hidden ... text-sm text-left'
             dangerouslySetInnerHTML={{ __html: lessonProps.lesson && lessonProps.lesson?.summary ? lessonProps.lesson?.summary : '' }}>
          </p>
        )
      }
    </div>
  );
};

export default MainSummary;