import React, { SetStateAction } from 'react';

export interface LessonComponentsInterface {
  isTeacher?: boolean;
  checkpointsItems?: any[];
}

export interface LessonHeaderBarProps extends LessonComponentsInterface {
  lessonDataLoaded?: boolean;
  checkpointsLoaded?: boolean;
  handlePopup?: () => void;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
}