import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {LessonsByTypeQueryVariables} from 'API';
import React, {useEffect, useState} from 'react';

interface ProgressBarProps {
  value: string;
  max: string;
  lessonProps: any;
  user?: any;
  getLessonRating?: (lessonId: string, userEmail: string, userAuthId: string) => any;
  getLessonByType?: (type: string, lessonID: string) => any;
}

const ProgressBar = ({lessonProps}: ProgressBarProps) => {
  const [progressValue, setProgressValue] = useState<any>(0);

  const shouldShowProgress = Boolean(lessonProps.lesson.type);

  const {data, isFetched} = useGraphqlQuery<LessonsByTypeQueryVariables, any>(
    'lessonsByType',
    {
      lessonType: lessonProps.lesson.type,
      filter: {lessonID: {eq: lessonProps.lesson.id}}
    },
    {enabled: shouldShowProgress}
  );

  const generateLessonProgress = async () => {
    try {
      const pageNumber = data && data.length > 0 ? data[0].pages : 0;

      const currentPage = JSON.parse(pageNumber).currentPage;

      const totalPages = JSON.parse(pageNumber).totalPages;

      const lessonProgress = JSON.parse(pageNumber).lessonProgress + 1;

      const percentCorrect = (lessonProgress * 100) / totalPages;
      setProgressValue(Math.round(percentCorrect));
      return {
        lessonProgress,
        currentPage,
        totalPages
      };
    } catch (error) {
      console.error(
        `lessondID:${lessonProps.lesson.id} error @getLessonByType Classroom.tsx `,
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

  return (
    <div className="flex justify-end px-4 flex-wrap mb-3">
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-500 text-sm">
          {progressValue > 0 ? progressValue : 0}% complete
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
