import {PagePart, UniversalLesson} from './UniversalLessonInterfaces';

export interface ULBSelectionProps {
  universalLessonDetails?: UniversalLesson;
  deleteFromULBHandler?: (targetID: string) => UniversalLesson;
  updateFromULBHandler?: (
    targetID: string,
    propertyToTarget: string,
    replacementValue?: string
  ) => void;
  createNewBlockULBHandler?: IContentTypeComponentProps['createNewBlockULBHandler'];
  updateBlockContentULBHandler?: IContentTypeComponentProps['updateBlockContentULBHandler'];
  selectedPageID?: string;
  setSelectedPageID?: React.Dispatch<React.SetStateAction<string>>;
  targetID?: string;
  setTargetID?: React.Dispatch<React.SetStateAction<string>>;
  selectedPagePartID?: string;
  setSelectedPagePartID?: React.Dispatch<React.SetStateAction<string>>;
  selectedPartContentID?: string;
  setSelectedPartContentID?: React.Dispatch<React.SetStateAction<string>>;
  handleTagModalOpen?: (targetID: string, inputObj: any) => void;
}

export interface RowComposerProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  contentID?: string;
  dataIdAttribute?: string;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number,
    classString?: string
  ) => void;
  handleModalPopToggle?: (
    dialogToToggle: string,
    position?: number,
    section?: string,
    targetID?: string
  ) => void;
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

export interface IContentTypeComponentProps {
  closeAction: () => void;
  createNewBlockULBHandler: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputValue: any,
    position?: number,
    classString?: string,

    customPageContentId?: string
  ) => any;
  inputObj?: any;
  selectedPageID?: string;
  updateBlockContentULBHandler: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputValue: any,
    addBlockAtPosition?: number,
    classString?: string,
    customPageContentId?: string,
    pageContentIdx?: number,
    partContentIdx?: number
  ) => any;
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setSavingStatus?: any;

  askBeforeClose: () => void;
}
