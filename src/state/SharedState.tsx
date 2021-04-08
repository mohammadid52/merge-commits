import {
  UniversalLessonPage,
  UniversalLessonPlanStage,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';

interface QuestionData {
  [key: string]: string | null;
}

interface QuestionDataUpdate {
  id?: string;
  checkpointID: string;
}

//THIS MIGHT NEED TO BE MODIFIED IF THERE ARE MISSING VALUES
export interface StudentRosterObject {
  id: string;
  personAuthID: string;
  personEmail: string;
  student: {
    id: string;
    authId: string;
    email: string;
    firstName: string;
    language: string;
    lastName: string;
    preferredName: string;
  };
}

interface StudentTeacherStateInterface {
  status?: string;
  complete?: boolean;
  //user properties should be renamed for teacher & student context
  authID?: string;
  username?: string;
  //lesson
  universalLessonID?: string;
  universalLessonPageID?: string;
  //student
  universalStudentDataID?: string;
  currentPage?: string;
  lessonProgress?: string;
  canContinue?: boolean;
  viewing?: boolean;
  questionData?: QuestionData[];
  questionDataUpdate?: QuestionDataUpdate[];
  saveCount?: number;
  firstSave?: boolean;
  //teacher
  sharing?: boolean;
  open?: boolean;
  roster?: StudentRosterObject[];
  studentDataUpdated?: boolean;
  studentViewing?: {
    live?: boolean;
    studentInfo?: UniversalLessonStudentData;
  };
  //shared data
  pages?: UniversalLessonPlanStage[];
  componentState?: UniversalLessonPage[];
  displayData?: UniversalLessonStudentData[];
  //subscriptions
  subscription?: any;
  subscribeFunc?: () => any;
}


/**************************************
 * THE CONTEXT FOR TEACHER & STUDENT  *
 **************************************/
export const sharedState: StudentTeacherStateInterface = {
  //
}