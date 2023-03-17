import * as iconoclastDict from '@dictionary/dictionary.iconoclast';
import * as curateDict from '@dictionary/dictionary.curate';
import * as demoDict from '@dictionary/dictionary.demo';
import {useGlobalContext} from 'contexts/GlobalContext';

function useDictionary(_clientKey?: 'iconoclast' | 'demo' | 'curate'): {
  userLanguage: any;
  AuthDict: any;
  CommunityDict: any;
  CsvDict: any;
  paginationPage: (lang: string, page: number, total: number) => string;
  BUTTONS: any;
  General: any;
  BreadcrumsTitles: any;
  appDict: any;
  anthologyDict: any;
  sideBarLinksDict: any;
  DashboardDict: any;
  noticeboardDict: any;
  dashboardProfileDict: any;
  dashboardTestCasesDict: any;
  staffBuilderDict: any;
  editClassDict: any;
  spBuilderDict: any;
  manageusersDict: any;
  InstitutionDict: any;
  Institute_info: any;
  InstitutionEditDict: any;
  InstitutionAddDict: any;
  InstitutionBuilderDict: any;
  Institute_class: any;
  InstitueCurriculum: any;
  InstitueRomms: any;
  classBuilderdict: any;
  CurricularBuilderdict: any;
  RoomBuilderdict: any;
  EditCurriculardict: any;
  RoomEDITdict: any;
  RoomDetailsDict: any;
  GroupFormDict: any;
  CourseScheduleDict: any;
  curricularviewdict: any;
  CHECKPOINTSDICT: any;
  LEARINGOBJECTIVEDICT: any;
  SYLLABUS: any;
  Measurementdict: any;
  TOPICLISTDICT: any;
  ADDLEARINGOBJDICT: any;
  lessonDict: any;
  classRoomDict: any;
  lessonPlannerDict: any;
  addQuestionDict: any;
  SelectPreviousQuestionDict: any;
  AddMeasurementDict: any;
  AddProfileCheckpointDict: any;
  AddSyllabusDict: any;
  AddTopicDict: any;
  EditLearningObjectiveDict: any;
  EditMeasurementDict: any;
  EditProfileCheckpointDict: any;
  EditSyllabusDict: any;
  EditTopicDict: any;
  ProfileCheckpointlookupDict: any;
  RegistrationDict: any;
  CourseBuilderDict: any;
  SyllabusDict: any;
  UserDict: any;
  UserEditDict: any;
  UserInformationDict: any;
  UserLookupDict: any;
  UserLookupWithTokenDict: any;
  AddQuestionModalDict: any;
  AddNewCheckPointDict: any;
  AddNewQuestionDict: any;
  CheckpointLookupDict: any;
  CheckpointQueTableDict: any;
  EditCheckPointDict: any;
  EditQuestionDict: any;
  QuestionLookupDict: any;
  SelectedCheckPointsListDict: any;
  StudentDict: any;
  AddNewLessonFormDict: any;
  AssessmentInstuctionsDict: any;
  GeneralInformationDict: any;
  PreviousQuestionsDict: any;
  QuestionBuilderDict: any;
  UnitLookupDict: any;
  LessonBuilderDict: any;
  LessonEditDict: any;
  LessonsListDict: any;
  EditQuestionModalDict: any;
  UniversalBuilderDict: any;
  LearningEvidenceDict: any;
  CommonlyUsedDict: any;
} {
  const {clientKey, userLanguage} = useGlobalContext();
  const key = _clientKey || clientKey;

  if (key === 'iconoclast') {
    return {...iconoclastDict, userLanguage};
  } else if (key === 'curate') {
    return {...curateDict, userLanguage};
  } else if (key === 'demo') {
    return {...demoDict, userLanguage};
  }
  return {...iconoclastDict, userLanguage};
}

export default useDictionary;
