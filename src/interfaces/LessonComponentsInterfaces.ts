import React, { SetStateAction } from 'react';

export interface LessonComponentsInterface {
  isTeacher?: boolean;
}

export interface LessonHeaderBarProps extends LessonComponentsInterface {
  handlePopup?: () => void;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
}
