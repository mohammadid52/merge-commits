import React, {SetStateAction} from 'react';

export interface LessonComponentsInterface {
  isTeacher?: boolean;
  checkpointsItems?: any[];
  pageList?: any[];
  currentPage?: any;
  setCurrentPage?: React.Dispatch<React.SetStateAction<any>>;
}

export interface LessonHeaderBarProps extends LessonComponentsInterface {
  videoLink?: string;
  lessonDataLoaded?: boolean;
  checkpointsLoaded?: boolean;
  handlePopup?: (isLeavingAfterCompletion?: boolean) => void;
  videoLinkModalVisible?: boolean;
  handleVideoLinkPopup?: (url?: string) => void;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
  isAtEnd?: boolean;
  setisAtEnd?: React.Dispatch<React.SetStateAction<boolean>>;
  handleRequiredNotification?: () => void;
}
