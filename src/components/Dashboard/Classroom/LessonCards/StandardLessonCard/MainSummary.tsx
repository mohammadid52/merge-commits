import React, {useContext} from 'react';
import {LessonCardProps} from '../../Classroom';
import {GlobalContext} from '../../../../../contexts/GlobalContext';

const MainSummary = (props: LessonCardProps) => {
  const {theme} = useContext(GlobalContext);
  const {lessonType, lessonProps} = props;

  const reverseDateString = () => {
    if (lessonProps.hasOwnProperty('endDate')) {
      return lessonProps.endDate.split('-').reverse().join('-');
    }
  };

  return (
    <div className={`h-44 p-4 px-5 flex flex-col justify-start items-center`}>
      <h1 className={`${theme.lessonCard.title} font-medium`}>
        <span>
          {lessonProps.lesson && lessonProps.lesson.title
            ? lessonProps.lesson.title
            : null}
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>
          {lessonProps.complete && lessonProps.endDate
            ? 'Completed on ' + reverseDateString()
            : ''}
        </span>
      </h1>
      <p
        className="overflow-ellipsis overflow-hidden ... text-md mt-1 text-gray-500 text-left"
        dangerouslySetInnerHTML={{
          __html:
            lessonProps.lesson && lessonProps.lesson?.summary
              ? lessonProps.lesson?.summary
              : '',
        }}></p>
    </div>
  );
};

export default MainSummary;