import {DashboardProps} from '@components/Dashboard/Dashboard';

interface Artist {
  id: string;
  images: [];
  name: string;
  type: string;
}

export interface CurriculumInfo {
  artist: Artist;
  language: string;
  summary: string;
  title: string;
}

export interface Syllabus {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Lesson {
  id: string;
  open?: boolean;
  status?: string;
  openedAt?: string;
  closedAt?: string;
  complete?: boolean;
  roster?: string[];
  viewing?: any;
  startDate?: string;
  endDate?: string;
  SELStructure?: string;
  courseID?: string;
  lessonID?: string;
  lesson?: {
    id?: string;
    type?: string;
    title?: string;
    artist?: any;
    language?: string;
    summary?: string;
    purpose?: string;
    duration?: number | null;
    cardImage?: string | null;
    cardCaption?: string;
    totalEstTime?: number;
  };
  session?: number;
  sessionHeading?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProps extends DashboardProps {
  lessons: Lesson[];
  syllabus?: any;
  searchTerm?: string;
  handleLessonMutationRating: (lessonID: string, ratingValue: string) => void;
  getLessonRating: (lessonId: string, userEmail: string, userAuthId: string) => any;
}

export interface LessonCardProps {
  isCompleted?: boolean;

  isTeacher?: boolean;
  searchTerm?: string;
  keyProps?: string;
  activeRoomInfo?: any;
  lessonProps?: any;
  syllabusProps?: any;

  accessible?: boolean;
  openCards?: string;
  lessonProgress?: number;
  setOpenCards?: React.Dispatch<React.SetStateAction<string>>;
  lessonType?: string;
  pageNumber?: number;
  handleLessonMutationRating?: (lessonID: string, ratingValue: string) => void;
  getLessonRating?: (lessonId: string, userEmail: string, userAuthId: string) => any;
  getLessonByType?: (type: string, lessonID: string) => any;
  roomID?: string;
  getImageFromS3?: boolean;
  preview?: boolean;
  user?: any;
}
