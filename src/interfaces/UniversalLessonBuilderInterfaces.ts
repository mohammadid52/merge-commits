import { PagePart, UniversalLessonPage } from './UniversalLessonInterfaces';
import React from 'react';

export interface ModalProps {
  saveAction?: () => void;
  closeAction?: () => void;
  message?: string;
  saveLabel?: string;
  onlyInfo?: boolean;
  deleteModal?: boolean;
  deleteLabel?: string;
  cancelLabel?: string;
}


export interface ULBDialogComponent {
  inputJSX?: JSX.Element;
}

export interface RowComposerProps {
  mode: 'building' | 'viewing';
  selectedPageDetails?: UniversalLessonPage;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export interface RowWrapperProps {
  mode?: 'building' | 'viewing';
  children?: React.ReactNode;
  pagePart?: PagePart;
}