/**************************************
 * UNIVERSAL LESSON BUILDER INTERFACES*
 ***************************************/
//
export interface UniversalLesson{
  id: string;
  isDraft?: boolean; //will determine if curriculum builder can see lesson to add to syllabus
  institute?: string;
  designers: string[];
  teachers?: string[];
  summary?: string;
  purpose?: string; //input this information on LESSON
  objectives?: string; //input this information on LESSON
  curriculum?: string; //get this information from LESSON PLAN BUILDER
  unit?: string; //get this information from LESSON PLAN BUILDER
  categories?: string[];
  additionalFiles?: string[];
  // universalLessonPlan: UniversalLessonPlanStage[];
  lessonPlan: UniversalLessonPage[];
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
  enabled?: boolean;
  open?: boolean;
  active?: boolean;
  label?: string;
  title: string;
  description: string;
  class: string;
  dataLifecycleManagements?: boolean; //will determine if cleanup happens for page
  estTime?: number;
  pageContent: PagePart[];
  [key: string]:any;
}

export interface PagePart {
  id: string;
  partType: 'component' | 'default';
  class: string;
  partContent: PartContent[];
  [key: string]:any;
}

export interface PartContent {
  id: string;
  type?: string;
  value: any[];
  [key: string]:any;
}

export interface PartContentSub {
  id?: string;
  type?: string;
  label?: string;
  value?: string;
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