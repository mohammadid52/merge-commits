import {PersonLessonsData} from 'API';
import {UniversalLessonPage} from 'interfaces/UniversalLessonInterfaces';
import React, {SetStateAction} from 'react';

interface LessonComponentsInterface {
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
  pageStateUpdated?: boolean;
  handlePopup?: (isLeavingAfterCompletion?: boolean) => void;
  videoLinkModalVisible?: boolean;
  handleVideoLinkPopup?: (url?: string) => void;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
  isAtEnd?: boolean;
  setisAtEnd?: React.Dispatch<React.SetStateAction<boolean>>;
  setPersonLessonData?: React.Dispatch<React.SetStateAction<any>>;
  handleRequiredNotification?: () => void;
  pages?: UniversalLessonPage[];
  canContinue?: boolean;
  validateRequired?: (pageIdx: number) => boolean;
  updatePageInLocalStorage?: (pageIdx: number) => void;

  personLessonData?: PersonLessonsData | null;

  handleForward?: (back?: boolean) => void;
  getLessonCompletedValue?: () => any;
  createJournalData?: (onSuccess?: () => void) => any;
}

export interface ISideMenuProps {
  isOpen: boolean;

  setOverlay?: React.Dispatch<SetStateAction<string>>;
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
