import React, {useEffect, useState} from 'react';

interface ProgressBarProps {
  personDataObj?: any;
  _isCompleted?: boolean;
}

const ProgressBar = ({personDataObj, _isCompleted}: ProgressBarProps) => {
  const [progressValue, setProgressValue] = useState<any>(0);

  const generateLessonProgress = async () => {
    try {
      if (personDataObj) {
        const isCompleted = personDataObj ? personDataObj?.isCompleted : false;
        const {totalPages = 0, lessonProgress = 0} = personDataObj;
        const roundOff = isCompleted ? 0 : -1;
        let lp = lessonProgress + 1;
        let tp = totalPages + 1;
        const percentCorrect = (lp * 100) / tp;

        const progress = Number.isNaN(percentCorrect) ? 0 : percentCorrect;

        const finalPercent = Math.round(progress) < 100 ? Math.round(progress) : 100;

        setProgressValue(
          isCompleted
            ? 100
            : finalPercent === 100
            ? finalPercent + roundOff
            : finalPercent
        );
      } else {
        setProgressValue(0);
      }
    } catch (error) {
      console.error(` error @getLessonByType Classroom.tsx `, error);
    }
  };

  useEffect(() => {
    generateLessonProgress();
  }, [personDataObj]);

  const infoWhenNinetyNine = '';

  return (
    <div className="flex justify-end px-4 flex-wrap mb-3">
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-500 text-sm">
          {_isCompleted ? 100 : progressValue > 0 ? progressValue : 0}% complete{' '}
          <span className="italic">{progressValue === 99 ? infoWhenNinetyNine : ''}</span>
        </p>
      </div>
      <div className="w-full h-2 iconoclast:bg-200 curate:bg-200 rounded-full">
        <div
          style={{width: `${_isCompleted ? '100' : progressValue}%`}}
          className="h-full text-center transition-all duration-1000 text-xs text-white iconoclast:bg-600 curate:bg-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
