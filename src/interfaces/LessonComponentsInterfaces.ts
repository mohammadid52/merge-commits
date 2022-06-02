import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
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
  pages?: UniversalLessonPage[];
  canContinue?: boolean;
  handleForward?: () => void;
  getLessonCompletedValue?: () => any;
  createJournalData?: () => any;
}

export interface ISideMenuProps {
  isOpen: boolean;
  overlay: string;
  setOverlay: (overlay: string) => void;
  handleHome?: () => void;
  handleBack?: () => void;
  handleVideoLink?: () => void;
  videoLink?: string;
  videoLinkModalVisible?: boolean;
  handleVideoLinkPopup?: (url?: string) => void;
  isAtEnd?: boolean;
  setisAtEnd?: React.Dispatch<React.SetStateAction<boolean>>;
  handleRequiredNotification?: () => void;
  pages?: UniversalLessonPage[];
  canContinue?: boolean;
  handleForward?: () => void;
  handlePopup?: (isLeavingAfterCompletion?: boolean) => void;
}
