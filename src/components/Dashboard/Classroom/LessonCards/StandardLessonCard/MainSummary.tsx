import React, {useContext} from 'react';
import {LessonCardProps} from '../../Classroom';
import {GlobalContext} from 'contexts/GlobalContext';
import {ellipsis} from 'utilities/functions';

const MainSummary = (props: LessonCardProps) => {
  const {theme} = useContext(GlobalContext);
  const {lessonType, lessonProps} = props;

  const reverseDateString = () => {
    if (lessonProps.hasOwnProperty('endDate')) {
      return lessonProps.endDate.split('-').reverse().join('-');
    }
  };

  return (
    <div className={`sm:h-44 p-5 px-5 flex flex-col justify-start items-center`}>
      <h1 className={`${theme.lessonCard.title} flex-col sm:flex-row w-full font-medium`}>
        <span className="w-full">
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
      <div className="descriptive overflow-hidden hover-overflow-auto">
        <p
          className="text-md mt-1 text-gray-500 text-left"
          dangerouslySetInnerHTML={{
            __html:
              lessonProps.lesson && lessonProps.lesson?.summary
                ? lessonProps.lesson?.summary
                : ''
          }}></p>
      </div>
    </div>
  );
};

export default MainSummary;
