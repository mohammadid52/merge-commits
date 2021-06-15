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
  deleteFromULBHandler?: (targetID: string) => void;
  updateFromULBHandler?: (
    targetID: string,
    propertyToTarget: string,
    replacementValue?: string
  ) => void;
  createNewBlockULBHandler?: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    replacementValue?: any,
    addBlockAtPosition?: number,
    classString?: string
  ) => void;
  updateBlockContentULBHandler?: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    replacementValue?: string,
    addBlockAtPosition?: number
  ) => void;
  selectedPageID?: string;
  setSelectedPageID?: React.Dispatch<React.SetStateAction<string>>;
  targetID?: string;
  setTargetID?: React.Dispatch<React.SetStateAction<string>>;
  selectedPagePartID?: string;
  setSelectedPagePartID?: React.Dispatch<React.SetStateAction<string>>;
  selectedPartContentID?: string;
  setSelectedPartContentID?: React.Dispatch<React.SetStateAction<string>>;
  handleTagModalOpen?: (targetID: string, inputObj:any) => void;
}

export interface RowComposerProps extends ULBSelectionProps {
  mode: 'building' | 'viewing';
  contentID?: string;
  dataIdAttribute?: string;
  handleEditBlockContent?: (type: string, section: string, inputObj: any, targetId: string, indexToUpdate: number) => void;
  handleModalPopToggle?: (dialogToToggle: string, position?: Number, section?:string, targetID?:string) => void;
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
  idx?: number;
  isPagePart?: boolean;
}

export interface IContentTypeComponentProps{
  closeAction: () => void;
  createNewBlockULBHandler: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputValue: any
  ) => void;
  updateBlockContentULBHandler: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputValue: any
  ) => void;
}