import React, { SetStateAction } from 'react';

export interface LessonComponentsInterface {
  isTeacher?: boolean;
}

export interface LessonHeaderBarProps extends LessonComponentsInterface {
  lessonDataLoaded?: boolean;
  checkpointsLoaded?: boolean;
  handlePopup?: () => void;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
}
