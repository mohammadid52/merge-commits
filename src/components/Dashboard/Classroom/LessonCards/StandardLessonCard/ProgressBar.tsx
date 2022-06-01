import React, {useState, useEffect} from 'react';

interface ProgressBarProps {
  value: string;
  max: string;
  lessonProps: any;
  user?: any;
  getLessonRating?: (lessonId: string, userEmail: string, userAuthId: string) => any;
  getLessonByType?: (type: string, lessonID: string) => any;
}

const ProgressBar = ({value, max, lessonProps, getLessonByType}: ProgressBarProps) => {
  const [progressValue, setProgressValue] = useState<any>();

  useEffect(() => {
    getLessonByType(lessonProps.lesson.type, lessonProps.lesson.id).then((value: any) => {
      const percentCorrect = (value.lessonProgress * 100) / value.totalPages;
      setProgressValue(Math.round(percentCorrect));
    });
  }, []);

  return (
    <div className="flex justify-end px-4 flex-wrap mb-3">
      <div className="flex justify-end mb-1">
        {progressValue > 0 ? progressValue : 0}% complete
      </div>
      <div className="progress-bar">
        <label
          className="progress-value block"
          style={{width: `${progressValue}%`}}></label>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
