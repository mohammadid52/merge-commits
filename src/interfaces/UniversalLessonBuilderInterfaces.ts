import {PagePart, UniversalLessonPage} from './UniversalLessonInterfaces';
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
  contentID?: string;
  dataIdAttribute?: string;
  selectedPageDetails?: UniversalLessonPage;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export interface RowWrapperProps extends RowComposerProps {
  hasContent?: boolean;
  contentID?: string;
  editedID?: string;
  dataIdAttribute?: string;
  hoveredID?: string;
  children?: React.ReactNode;
  pagePart?: PagePart;
  isComponent?: boolean;
  handleEditBlockToggle?: (dataID: string) => void;
}
