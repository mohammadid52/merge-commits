import {LessonsByType2Query, LessonsByType2QueryVariables} from 'API';
import useGraphqlQuery from 'customHooks/useGraphqlQuery';
import React, {useEffect, useState} from 'react';

interface ProgressBarProps {
  value: string;
  max: string;
  lessonProps: any;
  user?: any;
  getLessonRating?: (lessonId: string, userEmail: string, userAuthId: string) => any;
  getLessonByType?: (type: string, lessonID: string) => any;
}

const ProgressBar = ({lessonProps, user}: ProgressBarProps) => {
  const [progressValue, setProgressValue] = useState<any>(0);

  const lesson = lessonProps.lesson;

  const shouldShowProgress = Boolean(lesson) && Boolean(user);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const {data, isFetched} = useGraphqlQuery<
    LessonsByType2QueryVariables,
    LessonsByType2Query['lessonsByType2']['items']
  >(
    'lessonsByType2',
    {
      lessonType: lesson.type,
      filter: {
        lessonID: {eq: lesson.id},
        studentAuthID: {eq: user.authId},
        studentEmail: {eq: user.email}
      }
    },
    {enabled: shouldShowProgress && !progressLoaded}
  );

  const generateLessonProgress = async () => {
    try {
      const isCompleted = data && data.length > 0 ? data[0]?.isCompleted : false;
      const pageNumber = data && data.length > 0 ? data[0].pages : '{}';

      const currentPage = JSON.parse(pageNumber).currentPage || 0;

      const totalPages = JSON.parse(pageNumber).totalPages || 0;

      const lessonProgress = JSON.parse(pageNumber).lessonProgress + 1 || 0;

      const roundOff = isCompleted ? 0 : -1;
      const percentCorrect = (lessonProgress * 100) / totalPages;
      const finalPercent =
        Math.round(percentCorrect) < 100 ? Math.round(percentCorrect) : 100;
      setProgressValue(
        isCompleted ? 100 : finalPercent === 100 ? finalPercent + roundOff : finalPercent
      );
      setProgressLoaded(true);
      return {
        lessonProgress,
        currentPage,
        totalPages
      };
    } catch (error) {
      console.error(
        `lessondID:${lesson.id} error @getLessonByType Classroom.tsx `,
        error
      );
    }
  };

  useEffect(() => {
    if (isFetched && data) {
      generateLessonProgress();
    }
  }, [isFetched]);

  if (!shouldShowProgress) return null;

  const infoWhenNinetyNine = '';

  return (
    <div className="flex justify-end px-4 flex-wrap mb-3">
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-500 text-sm">
          {progressValue > 0 ? progressValue : 0}% complete{' '}
          <span className="italic">{progressValue === 99 ? infoWhenNinetyNine : ''}</span>
        </p>
      </div>
      <div className="w-full h-2 iconoclast:bg-200 curate:bg-200 rounded-full">
        <div
          style={{width: `${progressValue}%`}}
          className="h-full text-center transition-all duration-1000 text-xs text-white iconoclast:bg-600 curate:bg-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
