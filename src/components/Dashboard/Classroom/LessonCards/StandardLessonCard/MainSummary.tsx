import {Status} from '@components/Dashboard/Admin/UserManagement/UserStatus';
import useAuth from '@customHooks/useAuth';
import {GlobalContext} from 'contexts/GlobalContext';
import React, {useContext} from 'react';
import {LessonCardProps} from '../../Classroom';

const MainSummary = (props: LessonCardProps) => {
  const {theme} = useContext(GlobalContext);
  const {lessonProps} = props;

  const reverseDateString = () => {
    if (lessonProps.hasOwnProperty('endDate')) {
      return lessonProps.endDate.split('-').reverse().join('-');
    }
  };

  const {isStudent} = useAuth();

  return (
    <div className={`sm:h-44 relative p-5 px-5 flex flex-col justify-start items-center`}>
      {/* {!isStudent && (
        <div className="w-auto absolute top-1 right-1">
          <Status
            className={
              lessonProps.accessible
                ? 'bg-green-200 text-green-600'
                : 'bg-red-200 text-red-600'
            }>
            {lessonProps.accessible ? 'Open' : 'Closed'}
          </Status>
        </div>
      )} */}
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
