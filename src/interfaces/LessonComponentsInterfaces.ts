import React, { SetStateAction } from 'react';

export interface LessonComponentsInterface {
  isTeacher?: boolean;
}

export interface LessonHeaderBarProps extends LessonComponentsInterface {
  handlePopup?: () => void;
  setOverlay?: React.Dispatch<SetStateAction<string>>;
  overlay?: string;
}

/**************************************
* UNIVERSAL LESSON BUILDER INTERFACES *
***************************************/
//
export interface UniversalLesson{
  id: string;
  syllabusID: string;
  description: string;
  designers: string[];
  teachers: string[];
  categories: string[];
  universalLessonPlan: UniversalLessonPlanStage[];
  universalLessonPages: UniversalLessonPage[];
}

export interface UniversalLessonPlanStage {
  enabled: boolean;
  open: boolean;
  active: boolean;
  label: string;
  displayMode: string;
}

//  USED FOR LINKING UNIVERSAL-LESSON-PAGE TO UNIVERSAL-LESSON
interface UniversalLessonPages {
  universalLessonID: string;
  universalLessonPageID: string;
}

//
export interface UniversalLessonPage {
  id: string;
  description: string;
  class: string;
  pageContent: PagePart[];
}

export interface PagePart {
  id: string;
  partType: 'component' | 'default';
  class: string;
  partContent: any[]
}