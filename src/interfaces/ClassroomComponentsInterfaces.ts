//--------------NEW ARCHITECTURE INTERFACES--------------//
import {UniversalLessonStudentData} from './UniversalLessonInterfaces';

/**
 * Planner would replace need for SyllabusLesson/LiveClassroom
 */
export interface IPlanner {
  id: string;
  activeSyllabus?: string; // redundant...should be on room level?
  syllabusID?: string;
  roomID?: string;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  lessonID?: string;
  title?: string;
  description?: string;
  duration?: number;
  sharingData?: UniversalLessonStudentData[];
  closedPages?: string[];
  disabledPages?: string[];
}

//--------------SOON DEPRECATED INTERFACES--------------//
export interface Quote {
  [key: string]: any;
  text: string;
  author?: string;
}
export interface Link {
  [key: string]: any;
  text?: string;
  url?: string;
}
export interface Widget {
  [key: string]: any;
  id?: string;
  teacherAuthID?: string;
  teacherEmail?: string;
  roomID?: string;
  type?: string;
  placement?: string;
  title?: string;
  description?: string;
  content?: {
    image?: string;
    text?: string;
  };
  quotes?: Quote[];
  links?: Link[];
  active?: boolean;
  teacher?: any;
  createdAt?: string;
  updatedAt?: string;
}