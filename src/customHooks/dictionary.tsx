import * as iconoclastDict from '@dictionary/dictionary.iconoclast';
import * as curateDict from '@dictionary/dictionary.curate';
import * as demoDict from '@dictionary/dictionary.demo';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  AuthDictInterface,
  CommunityDictInterface,
  CsvDictInterface,
  GeneralInterface,
  DashboardDictInterface,
  InstitutionDictInterface,
  InstitutionEditDictInterface,
  InstitutionAddDictInterface,
  InstitutionBuilderDictInterface,
  InstitueRommsInterface,
  CurricularBuilderdictInterface,
  RoomBuilderdictInterface,
  EditCurriculardictInterface,
  RoomEDITdictInterface,
  RoomDetailsDictInterface,
  GroupFormDictInterface,
  CourseScheduleDictInterface,
  CHECKPOINTSDICTInterface,
  LEARINGOBJECTIVEDICTInterface,
  SYLLABUSInterface,
  TOPICLISTDICTInterface,
  ADDLEARINGOBJDICTInterface,
  addQuestionDictInterface,
  SelectPreviousQuestionDictInterface,
  AddMeasurementDictInterface,
  AddProfileCheckpointDictInterface,
  AddSyllabusDictInterface,
  AddTopicDictInterface,
  EditLearningObjectiveDictInterface,
  EditMeasurementDictInterface,
  EditProfileCheckpointDictInterface,
  EditSyllabusDictInterface,
  EditTopicDictInterface,
  ProfileCheckpointlookupDictInterface,
  RegistrationDictInterface,
  CourseBuilderDictInterface,
  SyllabusDictInterface,
  UserDictInterface,
  UserEditDictInterface,
  UserInformationDictInterface,
  UserLookupDictInterface,
  AddQuestionModalDictInterface,
  AddNewCheckPointDictInterface,
  AddNewQuestionDictInterface,
  CheckpointLookupDictInterface,
  CheckpointQueTableDictInterface,
  EditCheckPointDictInterface,
  EditQuestionDictInterface,
  SelectedCheckPointsListDictInterface,
  StudentDictInterface,
  AddNewLessonFormDictInterface,
  AssessmentInstuctionsDictInterface,
  GeneralInformationDictInterface,
  PreviousQuestionsDictInterface,
  QuestionBuilderDictInterface,
  UnitLookupDictInterface,
  LessonBuilderDictInterface,
  LessonEditDictInterface,
  LessonsListDictInterface,
  EditQuestionModalDictInterface,
  UniversalBuilderDictInterface,
  LearningEvidenceDictInterface,
  CommonlyUsedDictInterface,
  QuestionLookupDictInterface,
  LessonPlannerDictInterface,
  ClassroomDictInterface,
  LessonDictInterface,
  MeasurementDictInterface,
  CurricularViewInterface,
  ClassBuilderdictInterface,
  InstituteCurriculumInterface,
  InstituteClassInterface,
  InstitutionInfoInterface,
  ButtonInterface,
  AnthologyDictInterface,
  AppDictInterface,
  BreadcrumbsTitlesInterface,
  DashboardProfileDictInterface,
  DashboardTestCasesDictInterface,
  EditClassDictInterface,
  NoticeboardDictInterface,
  SideBarLinksDictInterface,
  StaffBuilderDictInterface,
  ManageUsersDictInterface,
  SpBuilderDictInterface
} from '@interfaces/dictionary.interface';

function useDictionary(_clientKey?: 'iconoclast' | 'demo' | 'curate'): {
  userLanguage: 'ES' | 'EN';
  AuthDict: AuthDictInterface;
  CommunityDict: CommunityDictInterface;
  CsvDict: CsvDictInterface;
  BUTTONS: ButtonInterface;
  General: GeneralInterface;
  BreadcrumsTitles: BreadcrumbsTitlesInterface;
  appDict: AppDictInterface;
  anthologyDict: AnthologyDictInterface;
  sideBarLinksDict: SideBarLinksDictInterface;
  DashboardDict: DashboardDictInterface;
  noticeboardDict: NoticeboardDictInterface;
  dashboardProfileDict: DashboardProfileDictInterface;
  dashboardTestCasesDict: DashboardTestCasesDictInterface;
  staffBuilderDict: StaffBuilderDictInterface;
  editClassDict: EditClassDictInterface;
  spBuilderDict: SpBuilderDictInterface;
  manageusersDict: ManageUsersDictInterface;
  InstitutionDict: InstitutionDictInterface;
  Institute_info: InstitutionInfoInterface;
  InstitutionEditDict: InstitutionEditDictInterface;
  InstitutionAddDict: InstitutionAddDictInterface;
  InstitutionBuilderDict: InstitutionBuilderDictInterface;
  Institute_class: InstituteClassInterface;
  InstitueCurriculum: InstituteCurriculumInterface;
  InstitueRomms: InstitueRommsInterface;
  classBuilderdict: ClassBuilderdictInterface;
  CurricularBuilderdict: CurricularBuilderdictInterface;
  RoomBuilderdict: RoomBuilderdictInterface;
  EditCurriculardict: EditCurriculardictInterface;
  RoomEDITdict: RoomEDITdictInterface;
  RoomDetailsDict: RoomDetailsDictInterface;
  GroupFormDict: GroupFormDictInterface;
  CourseScheduleDict: CourseScheduleDictInterface;
  curricularviewdict: CurricularViewInterface;
  CHECKPOINTSDICT: CHECKPOINTSDICTInterface;
  LEARINGOBJECTIVEDICT: LEARINGOBJECTIVEDICTInterface;
  SYLLABUS: SYLLABUSInterface;
  Measurementdict: MeasurementDictInterface;
  TOPICLISTDICT: TOPICLISTDICTInterface;
  ADDLEARINGOBJDICT: ADDLEARINGOBJDICTInterface;
  lessonDict: LessonDictInterface;
  classRoomDict: ClassroomDictInterface;
  lessonPlannerDict: LessonPlannerDictInterface;
  addQuestionDict: addQuestionDictInterface;
  SelectPreviousQuestionDict: SelectPreviousQuestionDictInterface;
  AddMeasurementDict: AddMeasurementDictInterface;
  AddProfileCheckpointDict: AddProfileCheckpointDictInterface;
  AddSyllabusDict: AddSyllabusDictInterface;
  AddTopicDict: AddTopicDictInterface;
  EditLearningObjectiveDict: EditLearningObjectiveDictInterface;
  EditMeasurementDict: EditMeasurementDictInterface;
  EditProfileCheckpointDict: EditProfileCheckpointDictInterface;
  EditSyllabusDict: EditSyllabusDictInterface;
  EditTopicDict: EditTopicDictInterface;
  ProfileCheckpointlookupDict: ProfileCheckpointlookupDictInterface;
  RegistrationDict: RegistrationDictInterface;
  CourseBuilderDict: CourseBuilderDictInterface;
  SyllabusDict: SyllabusDictInterface;
  UserDict: UserDictInterface;
  UserEditDict: UserEditDictInterface;
  UserInformationDict: UserInformationDictInterface;
  UserLookupDict: UserLookupDictInterface;
  UserLookupWithTokenDict: UserLookupDictInterface;
  AddQuestionModalDict: AddQuestionModalDictInterface;
  AddNewCheckPointDict: AddNewCheckPointDictInterface;
  AddNewQuestionDict: AddNewQuestionDictInterface;
  CheckpointLookupDict: CheckpointLookupDictInterface;
  CheckpointQueTableDict: CheckpointQueTableDictInterface;
  EditCheckPointDict: EditCheckPointDictInterface;
  EditQuestionDict: EditQuestionDictInterface;
  QuestionLookupDict: QuestionLookupDictInterface;
  SelectedCheckPointsListDict: SelectedCheckPointsListDictInterface;
  StudentDict: StudentDictInterface;
  AddNewLessonFormDict: AddNewLessonFormDictInterface;
  AssessmentInstuctionsDict: AssessmentInstuctionsDictInterface;
  GeneralInformationDict: GeneralInformationDictInterface;
  PreviousQuestionsDict: PreviousQuestionsDictInterface;
  QuestionBuilderDict: QuestionBuilderDictInterface;
  UnitLookupDict: UnitLookupDictInterface;
  LessonBuilderDict: LessonBuilderDictInterface;
  LessonEditDict: LessonEditDictInterface;
  LessonsListDict: LessonsListDictInterface;
  EditQuestionModalDict: EditQuestionModalDictInterface;
  UniversalBuilderDict: UniversalBuilderDictInterface;
  LearningEvidenceDict: LearningEvidenceDictInterface;
  CommonlyUsedDict: CommonlyUsedDictInterface;
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
