// ##################################################################### //
// #################### UNIVERSAL LESSON INTERFACES #################### //

import {UniversalLessonWritingExcercises} from 'API';

// ##################################################################### //
export interface UniversalLesson {
  id: string;
  isDraft?: boolean; //will determine if curriculum builder can see lesson to add to syllabus
  institute?: string;
  designers?: string[];
  teachers?: string[];
  summary?: string;
  purpose?: string; //input this information on LESSON
  objectives?: string; //input this information on LESSON
  curriculum?: string; //get this information from LESSON PLAN BUILDER
  unit?: string; //get this information from LESSON PLAN BUILDER
  categories?: string[];
  additionalFiles?: string[];
  institutionID?: string;
  lessonPlan: UniversalLessonPage[];
  darkMode?: boolean;
}

export interface UniversalLessonPage {
  id: string;
  enabled?: boolean;
  open?: boolean;
  active?: boolean;
  label?: string;
  tags?: string[];
  title?: string;
  description?: string;
  class?: string;
  estTime?: number;
  pageContent?: PagePart[];
  [key: string]: any;
}

export interface PagePart {
  id: string;
  partType: 'component' | 'default' | string;
  class: string;
  partContent: PartContent[];
  [key: string]: any;
}

export interface PartContent {
  id: string;
  type: string;
  value: PartContentSub[];

  class: string;
  [key: string]: any;
}

export interface PartContentSub {
  // this is end object
  id?: string;
  isRequired?: boolean;
  type?: string;
  label?: string;
  value?: string;
  class?: string;
  options?: Options[];
  placeholderText?: string;
}

export interface Options {
  id?: string;
  label?: string;
  text?: string;
}

// ##################################################################### //
// ################### UNIVERSAL LESSON STUDENT DATA ################### //
// ##################################################################### //
export interface UniversalLessonStudentData {
  id: string;
  universalLessonID: string;
  universalLessonPageID: string;
  roomID?: string;
  studentAuthID: string;
  studentID: string;
  studentEmail?: string;
  currentLocation: string;
  lessonProgress: string;
  pageData: StudentPageInput[];
  exerciseData?: StudentExerciseData[];
  updatedAt?: string;
  createdAt?: string;
}
export interface StudentPageInput {
  domID: string;
  input: string[];
  comments?: TeacherStudentComments[];
}

export interface StudentExerciseData {
  id: string;
  entryData?: {domID: string; input: string}[];
  feedbacks?: string[];
  shared?: boolean;
}

interface TeacherStudentComments {
  commentBy: string;
  comment: string;
}

// ##################################################################### //
// ####################### UNIVERSAL JOURNAL DATA ###################### //
// ##################################################################### //
export interface UniversalJournalData {
  id: string;
  studentID: string;
  studentAuthID: string;
  studentEmail: string;
  type?: string;
  feedbacks?: string[];
  shared?: boolean;
  entryData?: {domID: string; type: string; input: string}[];
  roomID?: string;
  syllabusLessonID?: string;
  updatedAt?: any;
  createdAt?: any;
  recordID?: string;
}

export type UniversalClassData = UniversalLessonWritingExcercises;

export interface IFormBlockProps {
  id?: string;
  label?: string;
  value?: string;
  mode?: string;
  numbered?: boolean;
  isStudent?: boolean;
  required?: boolean;
  type?: string;
  index?: string;
  inputID?: string;
  classString?: string;
}
export interface IFile {
  _status: 'progress' | 'failed' | 'success' | 'other';
  progress: number | string | null;
  file: File;
  id?: string;
  fileKey?: string;
  fileName?: string;
}

export interface IFileComponent extends IFile {
  UPLOAD_KEY?: string;
}
