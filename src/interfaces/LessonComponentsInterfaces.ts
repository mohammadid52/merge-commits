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
 * UNIVERSAL LESSON BUILDER INTERFACES*
 ***************************************/
//
export interface UniversalLesson{
  id: string;
  syllabusID: string;
  summary: string;
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
  title: string;
  description: string;
  class: string;
  pageContent: PagePart[];
}

export interface PagePart {
  id: string;
  partType: 'component' | 'default';
  class: string;
  partContent: PartContent[]
}

export interface PartContent {
  id: string;
  type?: string;
  value: any[];
}

/**************************************
 * UNIVERSAL LESSON SETUP DATA && STUDENT DATA INTERFACES   *
 **************************************/
//
export interface UniversalLessonStudentData {
  id: string;
  universalLessonID: string;
  universalLessonPageID: string;
  studentAuthID: string;
  studentID: string;
  currentLocation: string;
  lessonProgress: string;
  anthologyContent: any[];
  pageData: StudentDataPageData[];
}

export interface StudentDataPageData {
  pagePartID: string;
  pagePartInput: PagePartInput[];
}

export interface PagePartInput {
  domID: string;
  input: string;
}