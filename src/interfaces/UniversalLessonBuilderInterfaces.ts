import { PagePart, UniversalLesson, UniversalLessonPage } from './UniversalLessonInterfaces';
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

export interface ULBSelectionProps {
  universalLessonDetails?: UniversalLesson;
  deleteFromULBHandler?: (targetID:string) => void;
  updateFromULBHandler?: (targetID:string, propertyToTarget: string, replacementValue?: string) => void;
  selectedPageID?: string;
  setSelectedPageID?: React.Dispatch<React.SetStateAction<string>>;
  targetID?: string;
  setTargetID?: React.Dispatch<React.SetStateAction<string>>;
  selectedPagePartID?: string;
  setSelectedPagePartID?: React.Dispatch<React.SetStateAction<string>>;
  selectedPartContentID?: string;
  setSelectedPartContentID?: React.Dispatch<React.SetStateAction<string>>;
}

export interface RowComposerProps extends ULBSelectionProps {
  mode: 'building' | 'viewing';
  contentID?: string;
  dataIdAttribute?: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export interface RowWrapperProps extends RowComposerProps, ULBSelectionProps {
  hasContent?: boolean;
  contentID?: string;
  classString?: string;
  editedID?: string;
  dataIdAttribute?: string;
  hoveredID?: string;
  children?: React.ReactNode;
  pagePart?: PagePart;
  isComponent?: boolean;
  isLast?: boolean;
  handleEditBlockToggle?: () => void;
}
