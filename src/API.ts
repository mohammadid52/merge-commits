/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateInstitutionTypeInput = {
  id?: string | null,
  name: string,
};

export type ModelInstitutionTypeConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelInstitutionTypeConditionInput | null > | null,
  or?: Array< ModelInstitutionTypeConditionInput | null > | null,
  not?: ModelInstitutionTypeConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateInstitutionTypeInput = {
  id: string,
  name?: string | null,
};

export type DeleteInstitutionTypeInput = {
  id?: string | null,
};

export type CreateInstitutionInput = {
  id?: string | null,
  name: string,
  institutionTypeId: string,
  district?: string | null,
  address: string,
  city: string,
  state?: string | null,
  zip: string,
  phone?: string | null,
  contact: ContactInput,
  website?: string | null,
  image?: string | null,
};

export type ContactInput = {
  name?: string | null,
  phone?: string | null,
  email?: string | null,
};

export type ModelInstitutionConditionInput = {
  name?: ModelStringInput | null,
  institutionTypeId?: ModelIDInput | null,
  district?: ModelStringInput | null,
  address?: ModelStringInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  zip?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  website?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelInstitutionConditionInput | null > | null,
  or?: Array< ModelInstitutionConditionInput | null > | null,
  not?: ModelInstitutionConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateInstitutionInput = {
  id: string,
  name?: string | null,
  institutionTypeId?: string | null,
  district?: string | null,
  address?: string | null,
  city?: string | null,
  state?: string | null,
  zip?: string | null,
  phone?: string | null,
  contact?: ContactInput | null,
  website?: string | null,
  image?: string | null,
};

export type DeleteInstitutionInput = {
  id: string,
};

export type CreatePersonInput = {
  id?: string | null,
  authId: string,
  status: PersonStatus,
  email: string,
  role: Role,
  firstName: string,
  preferredName?: string | null,
  lastName: string,
  externalId?: string | null,
  grade?: string | null,
  phone?: string | null,
  birthdate?: string | null,
  image?: string | null,
  language: Language,
};

export enum PersonStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
  HOLD = "HOLD",
}


export enum Role {
  SUP = "SUP",
  ADM = "ADM",
  BLD = "BLD",
  FLW = "FLW",
  CRD = "CRD",
  TR = "TR",
  ST = "ST",
}


export enum Language {
  EN = "EN",
  ES = "ES",
  VT = "VT",
}


export type ModelPersonConditionInput = {
  status?: ModelPersonStatusInput | null,
  role?: ModelRoleInput | null,
  firstName?: ModelStringInput | null,
  preferredName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  externalId?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  birthdate?: ModelStringInput | null,
  image?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  and?: Array< ModelPersonConditionInput | null > | null,
  or?: Array< ModelPersonConditionInput | null > | null,
  not?: ModelPersonConditionInput | null,
};

export type ModelPersonStatusInput = {
  eq?: PersonStatus | null,
  ne?: PersonStatus | null,
};

export type ModelRoleInput = {
  eq?: Role | null,
  ne?: Role | null,
};

export type ModelLanguageInput = {
  eq?: Language | null,
  ne?: Language | null,
};

export type UpdatePersonInput = {
  id: string,
  authId: string,
  status?: PersonStatus | null,
  email: string,
  role?: Role | null,
  firstName?: string | null,
  preferredName?: string | null,
  lastName?: string | null,
  externalId?: string | null,
  grade?: string | null,
  phone?: string | null,
  birthdate?: string | null,
  image?: string | null,
  language?: Language | null,
};

export type DeletePersonInput = {
  email: string,
  authId: string,
};

export type CreateCurriculumInput = {
  id?: string | null,
  name?: string | null,
  grade?: Array< number | null > | null,
  languages?: Array< Language | null > | null,
};

export type ModelCurriculumConditionInput = {
  name?: ModelStringInput | null,
  grade?: ModelIntInput | null,
  languages?: ModelLanguageListInput | null,
  and?: Array< ModelCurriculumConditionInput | null > | null,
  or?: Array< ModelCurriculumConditionInput | null > | null,
  not?: ModelCurriculumConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelLanguageListInput = {
  eq?: Array< Language | null > | null,
  ne?: Array< Language | null > | null,
  contains?: Language | null,
  notContains?: Language | null,
};

export type UpdateCurriculumInput = {
  id: string,
  name?: string | null,
  grade?: Array< number | null > | null,
  languages?: Array< Language | null > | null,
};

export type DeleteCurriculumInput = {
  id: string,
};

export type CreateCurriculumLessonsInput = {
  id?: string | null,
  curriculumID: string,
  lessonID: string,
};

export type ModelCurriculumLessonsConditionInput = {
  curriculumID?: ModelIDInput | null,
  lessonID?: ModelIDInput | null,
  and?: Array< ModelCurriculumLessonsConditionInput | null > | null,
  or?: Array< ModelCurriculumLessonsConditionInput | null > | null,
  not?: ModelCurriculumLessonsConditionInput | null,
};

export type UpdateCurriculumLessonsInput = {
  id: string,
  curriculumID?: string | null,
  lessonID?: string | null,
};

export type DeleteCurriculumLessonsInput = {
  id?: string | null,
};

export type CreateCourseTypeInput = {
  id?: string | null,
  name: string,
};

export type ModelCourseTypeConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelCourseTypeConditionInput | null > | null,
  or?: Array< ModelCourseTypeConditionInput | null > | null,
  not?: ModelCourseTypeConditionInput | null,
};

export type UpdateCourseTypeInput = {
  id: string,
  name?: string | null,
};

export type DeleteCourseTypeInput = {
  id?: string | null,
};

export type CreateCourseInput = {
  id?: string | null,
  name: string,
  courseTypeID: string,
  classID: string,
  curriculumID: string,
  location?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  duration?: number | null,
};

export type ModelCourseConditionInput = {
  name?: ModelStringInput | null,
  courseTypeID?: ModelIDInput | null,
  classID?: ModelIDInput | null,
  curriculumID?: ModelIDInput | null,
  location?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  and?: Array< ModelCourseConditionInput | null > | null,
  or?: Array< ModelCourseConditionInput | null > | null,
  not?: ModelCourseConditionInput | null,
};

export type UpdateCourseInput = {
  id: string,
  name?: string | null,
  courseTypeID?: string | null,
  classID?: string | null,
  curriculumID?: string | null,
  location?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  duration?: number | null,
};

export type DeleteCourseInput = {
  id?: string | null,
};

export type CreateClassInput = {
  id?: string | null,
  name: string,
};

export type ModelClassConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelClassConditionInput | null > | null,
  or?: Array< ModelClassConditionInput | null > | null,
  not?: ModelClassConditionInput | null,
};

export type UpdateClassInput = {
  id: string,
  name?: string | null,
};

export type DeleteClassInput = {
  id?: string | null,
};

export type CreateClassStudentInput = {
  id?: string | null,
  classID: string,
  studentID: string,
  studentEmail: string,
  studentAuth: string,
};

export type ModelClassStudentConditionInput = {
  classID?: ModelIDInput | null,
  studentID?: ModelIDInput | null,
  studentEmail?: ModelStringInput | null,
  studentAuth?: ModelStringInput | null,
  and?: Array< ModelClassStudentConditionInput | null > | null,
  or?: Array< ModelClassStudentConditionInput | null > | null,
  not?: ModelClassStudentConditionInput | null,
};

export type UpdateClassStudentInput = {
  id: string,
  classID?: string | null,
  studentID?: string | null,
  studentEmail?: string | null,
  studentAuth?: string | null,
};

export type DeleteClassStudentInput = {
  id?: string | null,
};

export type CreateStudentDataInput = {
  id?: string | null,
  lessonProgress: string,
  status: string,
  live: boolean,
  classroomID: string,
  studentID: string,
  studentAuthID: string,
  warmupData?: WarmUpDataInput | null,
  corelessonData?: CoreLessonDataInput | null,
  activityData?: ActivityDataInput | null,
};

export type WarmUpDataInput = {
  story?: string | null,
  title?: string | null,
  additional?: Array< AdditionalInputsInput | null > | null,
};

export type AdditionalInputsInput = {
  name?: string | null,
  input?: string | null,
};

export type CoreLessonDataInput = {
  selected?: Array< SelectionInput | null > | null,
};

export type SelectionInput = {
  anchor?: string | null,
  color?: string | null,
  content?: Array< SelectedWordInput | null > | null,
  focus?: string | null,
  id?: number | null,
};

export type SelectedWordInput = {
  id?: number | null,
  text?: string | null,
};

export type ActivityDataInput = {
  editInput?: string | null,
  editMode?: boolean | null,
  lines?: Array< LineInputInput | null > | null,
  title?: string | null,
};

export type LineInputInput = {
  example?: string | null,
  id?: number | null,
  menuOpen?: boolean | null,
  text?: string | null,
};

export type ModelStudentDataConditionInput = {
  lessonProgress?: ModelStringInput | null,
  status?: ModelStringInput | null,
  live?: ModelBooleanInput | null,
  studentAuthID?: ModelStringInput | null,
  and?: Array< ModelStudentDataConditionInput | null > | null,
  or?: Array< ModelStudentDataConditionInput | null > | null,
  not?: ModelStudentDataConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateStudentDataInput = {
  id: string,
  lessonProgress?: string | null,
  status?: string | null,
  live?: boolean | null,
  classroomID: string,
  studentID: string,
  studentAuthID?: string | null,
  warmupData?: WarmUpDataInput | null,
  corelessonData?: CoreLessonDataInput | null,
  activityData?: ActivityDataInput | null,
};

export type DeleteStudentDataInput = {
  classroomID: string,
  studentID: string,
};

export type CreateArtistInput = {
  id?: string | null,
  images?: Array< string > | null,
  name: string,
  type: string,
  bio: Array< string >,
  quotes: Array< QuoteInput >,
  additionalContent?: AdditionalContentInput | null,
};

export type QuoteInput = {
  source: string,
  text: string,
};

export type AdditionalContentInput = {
  video?: string | null,
  links?: Array< LinkInput | null > | null,
};

export type LinkInput = {
  type?: string | null,
  text?: string | null,
  link?: string | null,
};

export type ModelArtistConditionInput = {
  images?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  and?: Array< ModelArtistConditionInput | null > | null,
  or?: Array< ModelArtistConditionInput | null > | null,
  not?: ModelArtistConditionInput | null,
};

export type UpdateArtistInput = {
  id: string,
  images?: Array< string > | null,
  name?: string | null,
  type?: string | null,
  bio?: Array< string > | null,
  quotes?: Array< QuoteInput > | null,
  additionalContent?: AdditionalContentInput | null,
};

export type DeleteArtistInput = {
  id?: string | null,
};

export type CreateClassroomInput = {
  id?: string | null,
  open: boolean,
  openedAt?: string | null,
  closedAt?: string | null,
  roster: Array< string >,
  displayData?: DisplayDataInput | null,
  courseID: string,
  lessonID: string,
  lessonPlan: Array< ComponentSummaryInput >,
};

export type DisplayDataInput = {
  breakdownComponent?: string | null,
  studentInfo?: StudentInfoInput | null,
  warmUpData?: WarmUpDataInput | null,
  corelessonData?: CoreLessonDataInput | null,
  activityData?: ActivityDataInput | null,
};

export type StudentInfoInput = {
  id?: string | null,
  firstName?: string | null,
  preferredName?: string | null,
  lastName?: string | null,
};

export type ComponentSummaryInput = {
  id?: string | null,
  disabled: boolean,
  open: boolean,
  active: boolean,
  stage: string,
  type: string,
  displayMode?: string | null,
};

export type ModelClassroomConditionInput = {
  open?: ModelBooleanInput | null,
  openedAt?: ModelStringInput | null,
  closedAt?: ModelStringInput | null,
  roster?: ModelStringInput | null,
  courseID?: ModelIDInput | null,
  lessonID?: ModelIDInput | null,
  and?: Array< ModelClassroomConditionInput | null > | null,
  or?: Array< ModelClassroomConditionInput | null > | null,
  not?: ModelClassroomConditionInput | null,
};

export type UpdateClassroomInput = {
  id: string,
  open?: boolean | null,
  openedAt?: string | null,
  closedAt?: string | null,
  roster?: Array< string > | null,
  displayData?: DisplayDataInput | null,
  courseID?: string | null,
  lessonID?: string | null,
  lessonPlan?: Array< ComponentSummaryInput > | null,
};

export type DeleteClassroomInput = {
  id?: string | null,
};

export type CreateSELStructureInput = {
  id?: string | null,
  name: string,
  description?: string | null,
};

export type ModelSELStructureConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelSELStructureConditionInput | null > | null,
  or?: Array< ModelSELStructureConditionInput | null > | null,
  not?: ModelSELStructureConditionInput | null,
};

export type UpdateSELStructureInput = {
  id: string,
  name?: string | null,
  description?: string | null,
};

export type DeleteSELStructureInput = {
  id?: string | null,
};

export type CreateLessonInput = {
  id?: string | null,
  title: string,
  grades?: Array< number | null > | null,
  artistID: string,
  language: Language,
  SELStructureID: string,
  connection?: string | null,
  summary: string,
  objectives: Array< string | null >,
  doFirstID: string,
  warmUpId: string,
  coreLessonId: string,
  activityId: string,
};

export type ModelLessonConditionInput = {
  title?: ModelStringInput | null,
  grades?: ModelIntInput | null,
  artistID?: ModelIDInput | null,
  language?: ModelLanguageInput | null,
  SELStructureID?: ModelIDInput | null,
  connection?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  objectives?: ModelStringInput | null,
  doFirstID?: ModelIDInput | null,
  warmUpId?: ModelIDInput | null,
  coreLessonId?: ModelIDInput | null,
  activityId?: ModelIDInput | null,
  and?: Array< ModelLessonConditionInput | null > | null,
  or?: Array< ModelLessonConditionInput | null > | null,
  not?: ModelLessonConditionInput | null,
};

export type UpdateLessonInput = {
  id: string,
  title?: string | null,
  grades?: Array< number | null > | null,
  artistID?: string | null,
  language?: Language | null,
  SELStructureID?: string | null,
  connection?: string | null,
  summary?: string | null,
  objectives?: Array< string | null > | null,
  doFirstID?: string | null,
  warmUpId?: string | null,
  coreLessonId?: string | null,
  activityId?: string | null,
};

export type DeleteLessonInput = {
  id: string,
};

export type CreateLessonCheckpointInput = {
  id?: string | null,
  lessonID: string,
  checkpointID: string,
  position: number,
};

export type ModelLessonCheckpointConditionInput = {
  lessonID?: ModelIDInput | null,
  checkpointID?: ModelIDInput | null,
  position?: ModelIntInput | null,
  and?: Array< ModelLessonCheckpointConditionInput | null > | null,
  or?: Array< ModelLessonCheckpointConditionInput | null > | null,
  not?: ModelLessonCheckpointConditionInput | null,
};

export type UpdateLessonCheckpointInput = {
  id: string,
  lessonID?: string | null,
  checkpointID?: string | null,
  position?: number | null,
};

export type DeleteLessonCheckpointInput = {
  id?: string | null,
};

export type CreateDoFirstInput = {
  id?: string | null,
  type: string,
  required: boolean,
};

export type ModelDoFirstConditionInput = {
  type?: ModelStringInput | null,
  required?: ModelBooleanInput | null,
  and?: Array< ModelDoFirstConditionInput | null > | null,
  or?: Array< ModelDoFirstConditionInput | null > | null,
  not?: ModelDoFirstConditionInput | null,
};

export type UpdateDoFirstInput = {
  id: string,
  type?: string | null,
  required?: boolean | null,
};

export type DeleteDoFirstInput = {
  id?: string | null,
};

export type CreateDoFirstQuestionInput = {
  id?: string | null,
  doFirstID: string,
  questionID: string,
};

export type ModelDoFirstQuestionConditionInput = {
  doFirstID?: ModelIDInput | null,
  questionID?: ModelIDInput | null,
  and?: Array< ModelDoFirstQuestionConditionInput | null > | null,
  or?: Array< ModelDoFirstQuestionConditionInput | null > | null,
  not?: ModelDoFirstQuestionConditionInput | null,
};

export type UpdateDoFirstQuestionInput = {
  id: string,
  doFirstID?: string | null,
  questionID?: string | null,
};

export type DeleteDoFirstQuestionInput = {
  id?: string | null,
};

export type CreateWarmUpInput = {
  id?: string | null,
  title: string,
  label: string,
  stage: string,
  type: string,
  language: Language,
  SELTypes?: Array< string > | null,
  instructions: InstructionsInput,
  inputs: InputsInput,
  breakdown: BreakdownInput,
};

export type InstructionsInput = {
  video: boolean,
  link?: string | null,
  text: Array< string >,
};

export type InputsInput = {
  title: boolean,
  additionalInputs?: Array< WritingPromptsInput > | null,
};

export type WritingPromptsInput = {
  id?: number | null,
  name: string,
  prompt: string,
  example: string,
};

export type BreakdownInput = {
  included: boolean,
  reflectionQuestions?: Array< string | null > | null,
};

export type ModelWarmUpConditionInput = {
  title?: ModelStringInput | null,
  label?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  type?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  SELTypes?: ModelIDInput | null,
  and?: Array< ModelWarmUpConditionInput | null > | null,
  or?: Array< ModelWarmUpConditionInput | null > | null,
  not?: ModelWarmUpConditionInput | null,
};

export type UpdateWarmUpInput = {
  id: string,
  title?: string | null,
  label?: string | null,
  stage?: string | null,
  type?: string | null,
  language?: Language | null,
  SELTypes?: Array< string > | null,
  instructions?: InstructionsInput | null,
  inputs?: InputsInput | null,
  breakdown?: BreakdownInput | null,
};

export type DeleteWarmUpInput = {
  id?: string | null,
};

export type CreateCoreLessonInput = {
  id?: string | null,
  title: string,
  label: string,
  stage: string,
  type: string,
  language: Language,
  SELTypes?: Array< string > | null,
  instructions: InstructionsInput,
  content: ContentInput,
  tools: Array< ToolInput >,
  breakdown: BreakdownInput,
};

export type ContentInput = {
  video: boolean,
  link?: string | null,
  title: string,
  artist: string,
  text: Array< string >,
};

export type ToolInput = {
  name: string,
  color: string,
  icon: string,
};

export type ModelCoreLessonConditionInput = {
  title?: ModelStringInput | null,
  label?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  type?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  SELTypes?: ModelIDInput | null,
  and?: Array< ModelCoreLessonConditionInput | null > | null,
  or?: Array< ModelCoreLessonConditionInput | null > | null,
  not?: ModelCoreLessonConditionInput | null,
};

export type UpdateCoreLessonInput = {
  id: string,
  title?: string | null,
  label?: string | null,
  stage?: string | null,
  type?: string | null,
  language?: Language | null,
  SELTypes?: Array< string > | null,
  instructions?: InstructionsInput | null,
  content?: ContentInput | null,
  tools?: Array< ToolInput > | null,
  breakdown?: BreakdownInput | null,
};

export type DeleteCoreLessonInput = {
  id?: string | null,
};

export type CreateActivityInput = {
  id?: string | null,
  title: string,
  label: string,
  stage: string,
  type: string,
  language: Language,
  SELTypes?: Array< string > | null,
  instructions: InstructionsInput,
  lineNumber?: number | null,
  writingPrompts: Array< WritingPromptsInput >,
  breakdown: BreakdownInput,
};

export type ModelActivityConditionInput = {
  title?: ModelStringInput | null,
  label?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  type?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  SELTypes?: ModelIDInput | null,
  lineNumber?: ModelIntInput | null,
  and?: Array< ModelActivityConditionInput | null > | null,
  or?: Array< ModelActivityConditionInput | null > | null,
  not?: ModelActivityConditionInput | null,
};

export type UpdateActivityInput = {
  id: string,
  title?: string | null,
  label?: string | null,
  stage?: string | null,
  type?: string | null,
  language?: Language | null,
  SELTypes?: Array< string > | null,
  instructions?: InstructionsInput | null,
  lineNumber?: number | null,
  writingPrompts?: Array< WritingPromptsInput > | null,
  breakdown?: BreakdownInput | null,
};

export type DeleteActivityInput = {
  id?: string | null,
};

export type CreateCheckpointInput = {
  id?: string | null,
  label: string,
  type: string,
  instructions: string,
};

export type ModelCheckpointConditionInput = {
  label?: ModelStringInput | null,
  type?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  and?: Array< ModelCheckpointConditionInput | null > | null,
  or?: Array< ModelCheckpointConditionInput | null > | null,
  not?: ModelCheckpointConditionInput | null,
};

export type UpdateCheckpointInput = {
  id: string,
  label?: string | null,
  type?: string | null,
  instructions?: string | null,
};

export type DeleteCheckpointInput = {
  id?: string | null,
};

export type CreateCheckpointQuestionsInput = {
  id?: string | null,
  checkpointID: string,
  questionID: string,
  required: boolean,
};

export type ModelCheckpointQuestionsConditionInput = {
  checkpointID?: ModelIDInput | null,
  questionID?: ModelIDInput | null,
  required?: ModelBooleanInput | null,
  and?: Array< ModelCheckpointQuestionsConditionInput | null > | null,
  or?: Array< ModelCheckpointQuestionsConditionInput | null > | null,
  not?: ModelCheckpointQuestionsConditionInput | null,
};

export type UpdateCheckpointQuestionsInput = {
  id: string,
  checkpointID?: string | null,
  questionID?: string | null,
  required?: boolean | null,
};

export type DeleteCheckpointQuestionsInput = {
  id?: string | null,
};

export type CreateQuestionInput = {
  id?: string | null,
  label: string,
  type: string,
  question: string,
  options?: Array< OptionInput | null > | null,
};

export type OptionInput = {
  text: string,
  label?: string | null,
  icon?: string | null,
  color?: string | null,
};

export type ModelQuestionConditionInput = {
  label?: ModelStringInput | null,
  type?: ModelStringInput | null,
  question?: ModelStringInput | null,
  and?: Array< ModelQuestionConditionInput | null > | null,
  or?: Array< ModelQuestionConditionInput | null > | null,
  not?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionInput = {
  id: string,
  label?: string | null,
  type?: string | null,
  question?: string | null,
  options?: Array< OptionInput | null > | null,
};

export type DeleteQuestionInput = {
  id?: string | null,
};

export type CreateQuestionDataInput = {
  id?: string | null,
  questionID: string,
  email: string,
  authID: string,
  response?: string | null,
};

export type ModelQuestionDataConditionInput = {
  questionID?: ModelIDInput | null,
  email?: ModelStringInput | null,
  authID?: ModelStringInput | null,
  response?: ModelStringInput | null,
  and?: Array< ModelQuestionDataConditionInput | null > | null,
  or?: Array< ModelQuestionDataConditionInput | null > | null,
  not?: ModelQuestionDataConditionInput | null,
};

export type UpdateQuestionDataInput = {
  id: string,
  questionID?: string | null,
  email?: string | null,
  authID?: string | null,
  response?: string | null,
};

export type DeleteQuestionDataInput = {
  id?: string | null,
};

export type CreateQuestionDataStudentDataInput = {
  id?: string | null,
  studentDataID: string,
  questionDataID: string,
};

export type ModelQuestionDataStudentDataConditionInput = {
  studentDataID?: ModelIDInput | null,
  questionDataID?: ModelIDInput | null,
  and?: Array< ModelQuestionDataStudentDataConditionInput | null > | null,
  or?: Array< ModelQuestionDataStudentDataConditionInput | null > | null,
  not?: ModelQuestionDataStudentDataConditionInput | null,
};

export type UpdateQuestionDataStudentDataInput = {
  id: string,
  studentDataID?: string | null,
  questionDataID?: string | null,
};

export type DeleteQuestionDataStudentDataInput = {
  id?: string | null,
};

export type CreateWordInput = {
  id?: string | null,
  word: string,
  definition?: string | null,
};

export type ModelWordConditionInput = {
  word?: ModelStringInput | null,
  definition?: ModelStringInput | null,
  and?: Array< ModelWordConditionInput | null > | null,
  or?: Array< ModelWordConditionInput | null > | null,
  not?: ModelWordConditionInput | null,
};

export type UpdateWordInput = {
  id: string,
  word?: string | null,
  definition?: string | null,
};

export type DeleteWordInput = {
  id?: string | null,
};

export type CreateLessonKeyWordInput = {
  id?: string | null,
  wordID: string,
  lessonID: string,
};

export type ModelLessonKeyWordConditionInput = {
  wordID?: ModelIDInput | null,
  lessonID?: ModelIDInput | null,
  and?: Array< ModelLessonKeyWordConditionInput | null > | null,
  or?: Array< ModelLessonKeyWordConditionInput | null > | null,
  not?: ModelLessonKeyWordConditionInput | null,
};

export type UpdateLessonKeyWordInput = {
  id: string,
  wordID?: string | null,
  lessonID?: string | null,
};

export type DeleteLessonKeyWordInput = {
  id?: string | null,
};

export type CreateStudentWordInput = {
  id?: string | null,
  wordID: string,
  studentID: string,
  studentAuthID: string,
};

export type ModelStudentWordConditionInput = {
  wordID?: ModelIDInput | null,
  studentID?: ModelStringInput | null,
  studentAuthID?: ModelStringInput | null,
  and?: Array< ModelStudentWordConditionInput | null > | null,
  or?: Array< ModelStudentWordConditionInput | null > | null,
  not?: ModelStudentWordConditionInput | null,
};

export type UpdateStudentWordInput = {
  id: string,
  wordID?: string | null,
  studentID?: string | null,
  studentAuthID?: string | null,
};

export type DeleteStudentWordInput = {
  id?: string | null,
};

export type ModelInstitutionTypeFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelInstitutionTypeFilterInput | null > | null,
  or?: Array< ModelInstitutionTypeFilterInput | null > | null,
  not?: ModelInstitutionTypeFilterInput | null,
};

export type ModelInstitutionFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  institutionTypeId?: ModelIDInput | null,
  district?: ModelStringInput | null,
  address?: ModelStringInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  zip?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  website?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelInstitutionFilterInput | null > | null,
  or?: Array< ModelInstitutionFilterInput | null > | null,
  not?: ModelInstitutionFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelPersonFilterInput = {
  id?: ModelIDInput | null,
  authId?: ModelStringInput | null,
  status?: ModelPersonStatusInput | null,
  email?: ModelStringInput | null,
  role?: ModelRoleInput | null,
  firstName?: ModelStringInput | null,
  preferredName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  externalId?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  birthdate?: ModelStringInput | null,
  image?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  and?: Array< ModelPersonFilterInput | null > | null,
  or?: Array< ModelPersonFilterInput | null > | null,
  not?: ModelPersonFilterInput | null,
};

export type ModelCurriculumFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  grade?: ModelIntInput | null,
  languages?: ModelLanguageListInput | null,
  and?: Array< ModelCurriculumFilterInput | null > | null,
  or?: Array< ModelCurriculumFilterInput | null > | null,
  not?: ModelCurriculumFilterInput | null,
};

export type ModelCourseTypeFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelCourseTypeFilterInput | null > | null,
  or?: Array< ModelCourseTypeFilterInput | null > | null,
  not?: ModelCourseTypeFilterInput | null,
};

export type ModelCourseFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  courseTypeID?: ModelIDInput | null,
  classID?: ModelIDInput | null,
  curriculumID?: ModelIDInput | null,
  location?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  and?: Array< ModelCourseFilterInput | null > | null,
  or?: Array< ModelCourseFilterInput | null > | null,
  not?: ModelCourseFilterInput | null,
};

export type ModelClassFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelClassFilterInput | null > | null,
  or?: Array< ModelClassFilterInput | null > | null,
  not?: ModelClassFilterInput | null,
};

export type ModelStudentDataFilterInput = {
  id?: ModelIDInput | null,
  lessonProgress?: ModelStringInput | null,
  status?: ModelStringInput | null,
  live?: ModelBooleanInput | null,
  classroomID?: ModelIDInput | null,
  studentID?: ModelStringInput | null,
  studentAuthID?: ModelStringInput | null,
  and?: Array< ModelStudentDataFilterInput | null > | null,
  or?: Array< ModelStudentDataFilterInput | null > | null,
  not?: ModelStudentDataFilterInput | null,
};

export type ModelArtistFilterInput = {
  id?: ModelIDInput | null,
  images?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  and?: Array< ModelArtistFilterInput | null > | null,
  or?: Array< ModelArtistFilterInput | null > | null,
  not?: ModelArtistFilterInput | null,
};

export type ModelClassroomFilterInput = {
  id?: ModelIDInput | null,
  open?: ModelBooleanInput | null,
  openedAt?: ModelStringInput | null,
  closedAt?: ModelStringInput | null,
  roster?: ModelStringInput | null,
  courseID?: ModelIDInput | null,
  lessonID?: ModelIDInput | null,
  and?: Array< ModelClassroomFilterInput | null > | null,
  or?: Array< ModelClassroomFilterInput | null > | null,
  not?: ModelClassroomFilterInput | null,
};

export type ModelSELStructureFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelSELStructureFilterInput | null > | null,
  or?: Array< ModelSELStructureFilterInput | null > | null,
  not?: ModelSELStructureFilterInput | null,
};

export type ModelLessonFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  grades?: ModelIntInput | null,
  artistID?: ModelIDInput | null,
  language?: ModelLanguageInput | null,
  SELStructureID?: ModelIDInput | null,
  connection?: ModelStringInput | null,
  summary?: ModelStringInput | null,
  objectives?: ModelStringInput | null,
  doFirstID?: ModelIDInput | null,
  warmUpId?: ModelIDInput | null,
  coreLessonId?: ModelIDInput | null,
  activityId?: ModelIDInput | null,
  and?: Array< ModelLessonFilterInput | null > | null,
  or?: Array< ModelLessonFilterInput | null > | null,
  not?: ModelLessonFilterInput | null,
};

export type ModelDoFirstFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelStringInput | null,
  required?: ModelBooleanInput | null,
  and?: Array< ModelDoFirstFilterInput | null > | null,
  or?: Array< ModelDoFirstFilterInput | null > | null,
  not?: ModelDoFirstFilterInput | null,
};

export type ModelWarmUpFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  label?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  type?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  SELTypes?: ModelIDInput | null,
  and?: Array< ModelWarmUpFilterInput | null > | null,
  or?: Array< ModelWarmUpFilterInput | null > | null,
  not?: ModelWarmUpFilterInput | null,
};

export type ModelCoreLessonFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  label?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  type?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  SELTypes?: ModelIDInput | null,
  and?: Array< ModelCoreLessonFilterInput | null > | null,
  or?: Array< ModelCoreLessonFilterInput | null > | null,
  not?: ModelCoreLessonFilterInput | null,
};

export type ModelActivityFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  label?: ModelStringInput | null,
  stage?: ModelStringInput | null,
  type?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  SELTypes?: ModelIDInput | null,
  lineNumber?: ModelIntInput | null,
  and?: Array< ModelActivityFilterInput | null > | null,
  or?: Array< ModelActivityFilterInput | null > | null,
  not?: ModelActivityFilterInput | null,
};

export type ModelCheckpointFilterInput = {
  id?: ModelIDInput | null,
  label?: ModelStringInput | null,
  type?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  and?: Array< ModelCheckpointFilterInput | null > | null,
  or?: Array< ModelCheckpointFilterInput | null > | null,
  not?: ModelCheckpointFilterInput | null,
};

export type ModelQuestionFilterInput = {
  id?: ModelIDInput | null,
  label?: ModelStringInput | null,
  type?: ModelStringInput | null,
  question?: ModelStringInput | null,
  and?: Array< ModelQuestionFilterInput | null > | null,
  or?: Array< ModelQuestionFilterInput | null > | null,
  not?: ModelQuestionFilterInput | null,
};

export type ModelQuestionDataFilterInput = {
  id?: ModelIDInput | null,
  questionID?: ModelIDInput | null,
  email?: ModelStringInput | null,
  authID?: ModelStringInput | null,
  response?: ModelStringInput | null,
  and?: Array< ModelQuestionDataFilterInput | null > | null,
  or?: Array< ModelQuestionDataFilterInput | null > | null,
  not?: ModelQuestionDataFilterInput | null,
};

export type ModelWordFilterInput = {
  id?: ModelIDInput | null,
  word?: ModelStringInput | null,
  definition?: ModelStringInput | null,
  and?: Array< ModelWordFilterInput | null > | null,
  or?: Array< ModelWordFilterInput | null > | null,
  not?: ModelWordFilterInput | null,
};

export type SearchablePersonFilterInput = {
  id?: SearchableIDFilterInput | null,
  authId?: SearchableStringFilterInput | null,
  email?: SearchableStringFilterInput | null,
  firstName?: SearchableStringFilterInput | null,
  preferredName?: SearchableStringFilterInput | null,
  lastName?: SearchableStringFilterInput | null,
  externalId?: SearchableStringFilterInput | null,
  grade?: SearchableStringFilterInput | null,
  phone?: SearchableStringFilterInput | null,
  birthdate?: SearchableStringFilterInput | null,
  image?: SearchableStringFilterInput | null,
  and?: Array< SearchablePersonFilterInput | null > | null,
  or?: Array< SearchablePersonFilterInput | null > | null,
  not?: SearchablePersonFilterInput | null,
};

export type SearchableIDFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
};

export type SearchableStringFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
};

export type SearchablePersonSortInput = {
  field?: SearchablePersonSortableFields | null,
  direction?: SearchableSortDirection | null,
};

export enum SearchablePersonSortableFields {
  id = "id",
  authId = "authId",
  email = "email",
  firstName = "firstName",
  preferredName = "preferredName",
  lastName = "lastName",
  externalId = "externalId",
  grade = "grade",
  phone = "phone",
  birthdate = "birthdate",
  image = "image",
}


export enum SearchableSortDirection {
  asc = "asc",
  desc = "desc",
}


export type CreateInstitutionTypeMutationVariables = {
  input: CreateInstitutionTypeInput,
  condition?: ModelInstitutionTypeConditionInput | null,
};

export type CreateInstitutionTypeMutation = {
  createInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInstitutionTypeMutationVariables = {
  input: UpdateInstitutionTypeInput,
  condition?: ModelInstitutionTypeConditionInput | null,
};

export type UpdateInstitutionTypeMutation = {
  updateInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInstitutionTypeMutationVariables = {
  input: DeleteInstitutionTypeInput,
  condition?: ModelInstitutionTypeConditionInput | null,
};

export type DeleteInstitutionTypeMutation = {
  deleteInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInstitutionMutationVariables = {
  input: CreateInstitutionInput,
  condition?: ModelInstitutionConditionInput | null,
};

export type CreateInstitutionMutation = {
  createInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInstitutionMutationVariables = {
  input: UpdateInstitutionInput,
  condition?: ModelInstitutionConditionInput | null,
};

export type UpdateInstitutionMutation = {
  updateInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInstitutionMutationVariables = {
  input: DeleteInstitutionInput,
  condition?: ModelInstitutionConditionInput | null,
};

export type DeleteInstitutionMutation = {
  deleteInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePersonMutationVariables = {
  input: CreatePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type CreatePersonMutation = {
  createPerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePersonMutationVariables = {
  input: UpdatePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type UpdatePersonMutation = {
  updatePerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePersonMutationVariables = {
  input: DeletePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type DeletePersonMutation = {
  deletePerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCurriculumMutationVariables = {
  input: CreateCurriculumInput,
  condition?: ModelCurriculumConditionInput | null,
};

export type CreateCurriculumMutation = {
  createCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCurriculumMutationVariables = {
  input: UpdateCurriculumInput,
  condition?: ModelCurriculumConditionInput | null,
};

export type UpdateCurriculumMutation = {
  updateCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCurriculumMutationVariables = {
  input: DeleteCurriculumInput,
  condition?: ModelCurriculumConditionInput | null,
};

export type DeleteCurriculumMutation = {
  deleteCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCurriculumLessonsMutationVariables = {
  input: CreateCurriculumLessonsInput,
  condition?: ModelCurriculumLessonsConditionInput | null,
};

export type CreateCurriculumLessonsMutation = {
  createCurriculumLessons:  {
    __typename: "CurriculumLessons",
    id: string,
    curriculumID: string,
    lessonID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCurriculumLessonsMutationVariables = {
  input: UpdateCurriculumLessonsInput,
  condition?: ModelCurriculumLessonsConditionInput | null,
};

export type UpdateCurriculumLessonsMutation = {
  updateCurriculumLessons:  {
    __typename: "CurriculumLessons",
    id: string,
    curriculumID: string,
    lessonID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCurriculumLessonsMutationVariables = {
  input: DeleteCurriculumLessonsInput,
  condition?: ModelCurriculumLessonsConditionInput | null,
};

export type DeleteCurriculumLessonsMutation = {
  deleteCurriculumLessons:  {
    __typename: "CurriculumLessons",
    id: string,
    curriculumID: string,
    lessonID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCourseTypeMutationVariables = {
  input: CreateCourseTypeInput,
  condition?: ModelCourseTypeConditionInput | null,
};

export type CreateCourseTypeMutation = {
  createCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCourseTypeMutationVariables = {
  input: UpdateCourseTypeInput,
  condition?: ModelCourseTypeConditionInput | null,
};

export type UpdateCourseTypeMutation = {
  updateCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCourseTypeMutationVariables = {
  input: DeleteCourseTypeInput,
  condition?: ModelCourseTypeConditionInput | null,
};

export type DeleteCourseTypeMutation = {
  deleteCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCourseMutationVariables = {
  input: CreateCourseInput,
  condition?: ModelCourseConditionInput | null,
};

export type CreateCourseMutation = {
  createCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCourseMutationVariables = {
  input: UpdateCourseInput,
  condition?: ModelCourseConditionInput | null,
};

export type UpdateCourseMutation = {
  updateCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCourseMutationVariables = {
  input: DeleteCourseInput,
  condition?: ModelCourseConditionInput | null,
};

export type DeleteCourseMutation = {
  deleteCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateClassMutationVariables = {
  input: CreateClassInput,
  condition?: ModelClassConditionInput | null,
};

export type CreateClassMutation = {
  createClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateClassMutationVariables = {
  input: UpdateClassInput,
  condition?: ModelClassConditionInput | null,
};

export type UpdateClassMutation = {
  updateClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteClassMutationVariables = {
  input: DeleteClassInput,
  condition?: ModelClassConditionInput | null,
};

export type DeleteClassMutation = {
  deleteClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateClassStudentMutationVariables = {
  input: CreateClassStudentInput,
  condition?: ModelClassStudentConditionInput | null,
};

export type CreateClassStudentMutation = {
  createClassStudent:  {
    __typename: "ClassStudent",
    id: string,
    classID: string,
    studentID: string,
    studentEmail: string,
    studentAuth: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateClassStudentMutationVariables = {
  input: UpdateClassStudentInput,
  condition?: ModelClassStudentConditionInput | null,
};

export type UpdateClassStudentMutation = {
  updateClassStudent:  {
    __typename: "ClassStudent",
    id: string,
    classID: string,
    studentID: string,
    studentEmail: string,
    studentAuth: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteClassStudentMutationVariables = {
  input: DeleteClassStudentInput,
  condition?: ModelClassStudentConditionInput | null,
};

export type DeleteClassStudentMutation = {
  deleteClassStudent:  {
    __typename: "ClassStudent",
    id: string,
    classID: string,
    studentID: string,
    studentEmail: string,
    studentAuth: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateStudentDataMutationVariables = {
  input: CreateStudentDataInput,
  condition?: ModelStudentDataConditionInput | null,
};

export type CreateStudentDataMutation = {
  createStudentData:  {
    __typename: "StudentData",
    id: string,
    lessonProgress: string,
    status: string,
    live: boolean,
    classroomID: string,
    classroom:  {
      __typename: "Classroom",
      id: string,
      open: boolean,
      openedAt: string | null,
      closedAt: string | null,
      roster: Array< string >,
      displayData:  {
        __typename: "DisplayData",
        breakdownComponent: string | null,
      } | null,
      courseID: string,
      course:  {
        __typename: "Course",
        id: string,
        name: string,
        courseTypeID: string,
        classID: string,
        curriculumID: string,
        location: string | null,
        startDate: string | null,
        endDate: string | null,
        duration: number | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonID: string,
      lesson:  {
        __typename: "Lesson",
        id: string,
        title: string,
        grades: Array< number | null > | null,
        artistID: string,
        language: Language,
        SELStructureID: string,
        connection: string | null,
        summary: string,
        objectives: Array< string | null >,
        doFirstID: string,
        warmUpId: string,
        coreLessonId: string,
        activityId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonPlan:  Array< {
        __typename: "ComponentSummary",
        id: string | null,
        disabled: boolean,
        open: boolean,
        active: boolean,
        stage: string,
        type: string,
        displayMode: string | null,
      } >,
      data:  {
        __typename: "ModelStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    studentID: string,
    studentAuthID: string,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    },
    warmupData:  {
      __typename: "WarmUpData",
      story: string | null,
      title: string | null,
      additional:  Array< {
        __typename: "AdditionalInputs",
        name: string | null,
        input: string | null,
      } | null > | null,
    } | null,
    corelessonData:  {
      __typename: "CoreLessonData",
      selected:  Array< {
        __typename: "Selection",
        anchor: string | null,
        color: string | null,
        focus: string | null,
        id: number | null,
      } | null > | null,
    } | null,
    activityData:  {
      __typename: "ActivityData",
      editInput: string | null,
      editMode: boolean | null,
      lines:  Array< {
        __typename: "LineInput",
        example: string | null,
        id: number | null,
        menuOpen: boolean | null,
        text: string | null,
      } | null > | null,
      title: string | null,
    } | null,
    doFirstData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    checkpointData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStudentDataMutationVariables = {
  input: UpdateStudentDataInput,
  condition?: ModelStudentDataConditionInput | null,
};

export type UpdateStudentDataMutation = {
  updateStudentData:  {
    __typename: "StudentData",
    id: string,
    lessonProgress: string,
    status: string,
    live: boolean,
    classroomID: string,
    classroom:  {
      __typename: "Classroom",
      id: string,
      open: boolean,
      openedAt: string | null,
      closedAt: string | null,
      roster: Array< string >,
      displayData:  {
        __typename: "DisplayData",
        breakdownComponent: string | null,
      } | null,
      courseID: string,
      course:  {
        __typename: "Course",
        id: string,
        name: string,
        courseTypeID: string,
        classID: string,
        curriculumID: string,
        location: string | null,
        startDate: string | null,
        endDate: string | null,
        duration: number | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonID: string,
      lesson:  {
        __typename: "Lesson",
        id: string,
        title: string,
        grades: Array< number | null > | null,
        artistID: string,
        language: Language,
        SELStructureID: string,
        connection: string | null,
        summary: string,
        objectives: Array< string | null >,
        doFirstID: string,
        warmUpId: string,
        coreLessonId: string,
        activityId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonPlan:  Array< {
        __typename: "ComponentSummary",
        id: string | null,
        disabled: boolean,
        open: boolean,
        active: boolean,
        stage: string,
        type: string,
        displayMode: string | null,
      } >,
      data:  {
        __typename: "ModelStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    studentID: string,
    studentAuthID: string,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    },
    warmupData:  {
      __typename: "WarmUpData",
      story: string | null,
      title: string | null,
      additional:  Array< {
        __typename: "AdditionalInputs",
        name: string | null,
        input: string | null,
      } | null > | null,
    } | null,
    corelessonData:  {
      __typename: "CoreLessonData",
      selected:  Array< {
        __typename: "Selection",
        anchor: string | null,
        color: string | null,
        focus: string | null,
        id: number | null,
      } | null > | null,
    } | null,
    activityData:  {
      __typename: "ActivityData",
      editInput: string | null,
      editMode: boolean | null,
      lines:  Array< {
        __typename: "LineInput",
        example: string | null,
        id: number | null,
        menuOpen: boolean | null,
        text: string | null,
      } | null > | null,
      title: string | null,
    } | null,
    doFirstData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    checkpointData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStudentDataMutationVariables = {
  input: DeleteStudentDataInput,
  condition?: ModelStudentDataConditionInput | null,
};

export type DeleteStudentDataMutation = {
  deleteStudentData:  {
    __typename: "StudentData",
    id: string,
    lessonProgress: string,
    status: string,
    live: boolean,
    classroomID: string,
    classroom:  {
      __typename: "Classroom",
      id: string,
      open: boolean,
      openedAt: string | null,
      closedAt: string | null,
      roster: Array< string >,
      displayData:  {
        __typename: "DisplayData",
        breakdownComponent: string | null,
      } | null,
      courseID: string,
      course:  {
        __typename: "Course",
        id: string,
        name: string,
        courseTypeID: string,
        classID: string,
        curriculumID: string,
        location: string | null,
        startDate: string | null,
        endDate: string | null,
        duration: number | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonID: string,
      lesson:  {
        __typename: "Lesson",
        id: string,
        title: string,
        grades: Array< number | null > | null,
        artistID: string,
        language: Language,
        SELStructureID: string,
        connection: string | null,
        summary: string,
        objectives: Array< string | null >,
        doFirstID: string,
        warmUpId: string,
        coreLessonId: string,
        activityId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonPlan:  Array< {
        __typename: "ComponentSummary",
        id: string | null,
        disabled: boolean,
        open: boolean,
        active: boolean,
        stage: string,
        type: string,
        displayMode: string | null,
      } >,
      data:  {
        __typename: "ModelStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    studentID: string,
    studentAuthID: string,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    },
    warmupData:  {
      __typename: "WarmUpData",
      story: string | null,
      title: string | null,
      additional:  Array< {
        __typename: "AdditionalInputs",
        name: string | null,
        input: string | null,
      } | null > | null,
    } | null,
    corelessonData:  {
      __typename: "CoreLessonData",
      selected:  Array< {
        __typename: "Selection",
        anchor: string | null,
        color: string | null,
        focus: string | null,
        id: number | null,
      } | null > | null,
    } | null,
    activityData:  {
      __typename: "ActivityData",
      editInput: string | null,
      editMode: boolean | null,
      lines:  Array< {
        __typename: "LineInput",
        example: string | null,
        id: number | null,
        menuOpen: boolean | null,
        text: string | null,
      } | null > | null,
      title: string | null,
    } | null,
    doFirstData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    checkpointData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateArtistMutationVariables = {
  input: CreateArtistInput,
  condition?: ModelArtistConditionInput | null,
};

export type CreateArtistMutation = {
  createArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateArtistMutationVariables = {
  input: UpdateArtistInput,
  condition?: ModelArtistConditionInput | null,
};

export type UpdateArtistMutation = {
  updateArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteArtistMutationVariables = {
  input: DeleteArtistInput,
  condition?: ModelArtistConditionInput | null,
};

export type DeleteArtistMutation = {
  deleteArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateClassroomMutationVariables = {
  input: CreateClassroomInput,
  condition?: ModelClassroomConditionInput | null,
};

export type CreateClassroomMutation = {
  createClassroom:  {
    __typename: "Classroom",
    id: string,
    open: boolean,
    openedAt: string | null,
    closedAt: string | null,
    roster: Array< string >,
    displayData:  {
      __typename: "DisplayData",
      breakdownComponent: string | null,
      studentInfo:  {
        __typename: "StudentInfo",
        id: string | null,
        firstName: string | null,
        preferredName: string | null,
        lastName: string | null,
      } | null,
      warmUpData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
    } | null,
    courseID: string,
    course:  {
      __typename: "Course",
      id: string,
      name: string,
      courseTypeID: string,
      courseType:  {
        __typename: "CourseType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      institution:  {
        __typename: "Institution",
        id: string,
        name: string,
        institutionTypeId: string,
        district: string | null,
        address: string,
        city: string,
        state: string | null,
        zip: string,
        phone: string | null,
        website: string | null,
        image: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      classID: string,
      class:  {
        __typename: "Class",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      curriculumID: string,
      curriculum:  {
        __typename: "Curriculum",
        id: string,
        name: string | null,
        grade: Array< number | null > | null,
        languages: Array< Language | null > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      location: string | null,
      startDate: string | null,
      endDate: string | null,
      duration: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonID: string,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonPlan:  Array< {
      __typename: "ComponentSummary",
      id: string | null,
      disabled: boolean,
      open: boolean,
      active: boolean,
      stage: string,
      type: string,
      displayMode: string | null,
    } >,
    data:  {
      __typename: "ModelStudentDataConnection",
      items:  Array< {
        __typename: "StudentData",
        id: string,
        lessonProgress: string,
        status: string,
        live: boolean,
        classroomID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateClassroomMutationVariables = {
  input: UpdateClassroomInput,
  condition?: ModelClassroomConditionInput | null,
};

export type UpdateClassroomMutation = {
  updateClassroom:  {
    __typename: "Classroom",
    id: string,
    open: boolean,
    openedAt: string | null,
    closedAt: string | null,
    roster: Array< string >,
    displayData:  {
      __typename: "DisplayData",
      breakdownComponent: string | null,
      studentInfo:  {
        __typename: "StudentInfo",
        id: string | null,
        firstName: string | null,
        preferredName: string | null,
        lastName: string | null,
      } | null,
      warmUpData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
    } | null,
    courseID: string,
    course:  {
      __typename: "Course",
      id: string,
      name: string,
      courseTypeID: string,
      courseType:  {
        __typename: "CourseType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      institution:  {
        __typename: "Institution",
        id: string,
        name: string,
        institutionTypeId: string,
        district: string | null,
        address: string,
        city: string,
        state: string | null,
        zip: string,
        phone: string | null,
        website: string | null,
        image: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      classID: string,
      class:  {
        __typename: "Class",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      curriculumID: string,
      curriculum:  {
        __typename: "Curriculum",
        id: string,
        name: string | null,
        grade: Array< number | null > | null,
        languages: Array< Language | null > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      location: string | null,
      startDate: string | null,
      endDate: string | null,
      duration: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonID: string,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonPlan:  Array< {
      __typename: "ComponentSummary",
      id: string | null,
      disabled: boolean,
      open: boolean,
      active: boolean,
      stage: string,
      type: string,
      displayMode: string | null,
    } >,
    data:  {
      __typename: "ModelStudentDataConnection",
      items:  Array< {
        __typename: "StudentData",
        id: string,
        lessonProgress: string,
        status: string,
        live: boolean,
        classroomID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteClassroomMutationVariables = {
  input: DeleteClassroomInput,
  condition?: ModelClassroomConditionInput | null,
};

export type DeleteClassroomMutation = {
  deleteClassroom:  {
    __typename: "Classroom",
    id: string,
    open: boolean,
    openedAt: string | null,
    closedAt: string | null,
    roster: Array< string >,
    displayData:  {
      __typename: "DisplayData",
      breakdownComponent: string | null,
      studentInfo:  {
        __typename: "StudentInfo",
        id: string | null,
        firstName: string | null,
        preferredName: string | null,
        lastName: string | null,
      } | null,
      warmUpData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
    } | null,
    courseID: string,
    course:  {
      __typename: "Course",
      id: string,
      name: string,
      courseTypeID: string,
      courseType:  {
        __typename: "CourseType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      institution:  {
        __typename: "Institution",
        id: string,
        name: string,
        institutionTypeId: string,
        district: string | null,
        address: string,
        city: string,
        state: string | null,
        zip: string,
        phone: string | null,
        website: string | null,
        image: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      classID: string,
      class:  {
        __typename: "Class",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      curriculumID: string,
      curriculum:  {
        __typename: "Curriculum",
        id: string,
        name: string | null,
        grade: Array< number | null > | null,
        languages: Array< Language | null > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      location: string | null,
      startDate: string | null,
      endDate: string | null,
      duration: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonID: string,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonPlan:  Array< {
      __typename: "ComponentSummary",
      id: string | null,
      disabled: boolean,
      open: boolean,
      active: boolean,
      stage: string,
      type: string,
      displayMode: string | null,
    } >,
    data:  {
      __typename: "ModelStudentDataConnection",
      items:  Array< {
        __typename: "StudentData",
        id: string,
        lessonProgress: string,
        status: string,
        live: boolean,
        classroomID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateSelStructureMutationVariables = {
  input: CreateSELStructureInput,
  condition?: ModelSELStructureConditionInput | null,
};

export type CreateSelStructureMutation = {
  createSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSelStructureMutationVariables = {
  input: UpdateSELStructureInput,
  condition?: ModelSELStructureConditionInput | null,
};

export type UpdateSelStructureMutation = {
  updateSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSelStructureMutationVariables = {
  input: DeleteSELStructureInput,
  condition?: ModelSELStructureConditionInput | null,
};

export type DeleteSelStructureMutation = {
  deleteSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonMutationVariables = {
  input: CreateLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type CreateLessonMutation = {
  createLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLessonMutationVariables = {
  input: UpdateLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type UpdateLessonMutation = {
  updateLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLessonMutationVariables = {
  input: DeleteLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type DeleteLessonMutation = {
  deleteLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonCheckpointMutationVariables = {
  input: CreateLessonCheckpointInput,
  condition?: ModelLessonCheckpointConditionInput | null,
};

export type CreateLessonCheckpointMutation = {
  createLessonCheckpoint:  {
    __typename: "LessonCheckpoint",
    id: string,
    lessonID: string,
    checkpointID: string,
    position: number,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLessonCheckpointMutationVariables = {
  input: UpdateLessonCheckpointInput,
  condition?: ModelLessonCheckpointConditionInput | null,
};

export type UpdateLessonCheckpointMutation = {
  updateLessonCheckpoint:  {
    __typename: "LessonCheckpoint",
    id: string,
    lessonID: string,
    checkpointID: string,
    position: number,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLessonCheckpointMutationVariables = {
  input: DeleteLessonCheckpointInput,
  condition?: ModelLessonCheckpointConditionInput | null,
};

export type DeleteLessonCheckpointMutation = {
  deleteLessonCheckpoint:  {
    __typename: "LessonCheckpoint",
    id: string,
    lessonID: string,
    checkpointID: string,
    position: number,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateDoFirstMutationVariables = {
  input: CreateDoFirstInput,
  condition?: ModelDoFirstConditionInput | null,
};

export type CreateDoFirstMutation = {
  createDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateDoFirstMutationVariables = {
  input: UpdateDoFirstInput,
  condition?: ModelDoFirstConditionInput | null,
};

export type UpdateDoFirstMutation = {
  updateDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteDoFirstMutationVariables = {
  input: DeleteDoFirstInput,
  condition?: ModelDoFirstConditionInput | null,
};

export type DeleteDoFirstMutation = {
  deleteDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateDoFirstQuestionMutationVariables = {
  input: CreateDoFirstQuestionInput,
  condition?: ModelDoFirstQuestionConditionInput | null,
};

export type CreateDoFirstQuestionMutation = {
  createDoFirstQuestion:  {
    __typename: "DoFirstQuestion",
    id: string,
    doFirstID: string,
    questionID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateDoFirstQuestionMutationVariables = {
  input: UpdateDoFirstQuestionInput,
  condition?: ModelDoFirstQuestionConditionInput | null,
};

export type UpdateDoFirstQuestionMutation = {
  updateDoFirstQuestion:  {
    __typename: "DoFirstQuestion",
    id: string,
    doFirstID: string,
    questionID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteDoFirstQuestionMutationVariables = {
  input: DeleteDoFirstQuestionInput,
  condition?: ModelDoFirstQuestionConditionInput | null,
};

export type DeleteDoFirstQuestionMutation = {
  deleteDoFirstQuestion:  {
    __typename: "DoFirstQuestion",
    id: string,
    doFirstID: string,
    questionID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateWarmUpMutationVariables = {
  input: CreateWarmUpInput,
  condition?: ModelWarmUpConditionInput | null,
};

export type CreateWarmUpMutation = {
  createWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateWarmUpMutationVariables = {
  input: UpdateWarmUpInput,
  condition?: ModelWarmUpConditionInput | null,
};

export type UpdateWarmUpMutation = {
  updateWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteWarmUpMutationVariables = {
  input: DeleteWarmUpInput,
  condition?: ModelWarmUpConditionInput | null,
};

export type DeleteWarmUpMutation = {
  deleteWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCoreLessonMutationVariables = {
  input: CreateCoreLessonInput,
  condition?: ModelCoreLessonConditionInput | null,
};

export type CreateCoreLessonMutation = {
  createCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCoreLessonMutationVariables = {
  input: UpdateCoreLessonInput,
  condition?: ModelCoreLessonConditionInput | null,
};

export type UpdateCoreLessonMutation = {
  updateCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCoreLessonMutationVariables = {
  input: DeleteCoreLessonInput,
  condition?: ModelCoreLessonConditionInput | null,
};

export type DeleteCoreLessonMutation = {
  deleteCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateActivityMutationVariables = {
  input: CreateActivityInput,
  condition?: ModelActivityConditionInput | null,
};

export type CreateActivityMutation = {
  createActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateActivityMutationVariables = {
  input: UpdateActivityInput,
  condition?: ModelActivityConditionInput | null,
};

export type UpdateActivityMutation = {
  updateActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteActivityMutationVariables = {
  input: DeleteActivityInput,
  condition?: ModelActivityConditionInput | null,
};

export type DeleteActivityMutation = {
  deleteActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCheckpointMutationVariables = {
  input: CreateCheckpointInput,
  condition?: ModelCheckpointConditionInput | null,
};

export type CreateCheckpointMutation = {
  createCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCheckpointMutationVariables = {
  input: UpdateCheckpointInput,
  condition?: ModelCheckpointConditionInput | null,
};

export type UpdateCheckpointMutation = {
  updateCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCheckpointMutationVariables = {
  input: DeleteCheckpointInput,
  condition?: ModelCheckpointConditionInput | null,
};

export type DeleteCheckpointMutation = {
  deleteCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCheckpointQuestionsMutationVariables = {
  input: CreateCheckpointQuestionsInput,
  condition?: ModelCheckpointQuestionsConditionInput | null,
};

export type CreateCheckpointQuestionsMutation = {
  createCheckpointQuestions:  {
    __typename: "CheckpointQuestions",
    id: string,
    checkpointID: string,
    questionID: string,
    required: boolean,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCheckpointQuestionsMutationVariables = {
  input: UpdateCheckpointQuestionsInput,
  condition?: ModelCheckpointQuestionsConditionInput | null,
};

export type UpdateCheckpointQuestionsMutation = {
  updateCheckpointQuestions:  {
    __typename: "CheckpointQuestions",
    id: string,
    checkpointID: string,
    questionID: string,
    required: boolean,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCheckpointQuestionsMutationVariables = {
  input: DeleteCheckpointQuestionsInput,
  condition?: ModelCheckpointQuestionsConditionInput | null,
};

export type DeleteCheckpointQuestionsMutation = {
  deleteCheckpointQuestions:  {
    __typename: "CheckpointQuestions",
    id: string,
    checkpointID: string,
    questionID: string,
    required: boolean,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateQuestionMutationVariables = {
  input: CreateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type CreateQuestionMutation = {
  createQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateQuestionMutationVariables = {
  input: UpdateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionMutation = {
  updateQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  input: DeleteQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type DeleteQuestionMutation = {
  deleteQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateQuestionDataMutationVariables = {
  input: CreateQuestionDataInput,
  condition?: ModelQuestionDataConditionInput | null,
};

export type CreateQuestionDataMutation = {
  createQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateQuestionDataMutationVariables = {
  input: UpdateQuestionDataInput,
  condition?: ModelQuestionDataConditionInput | null,
};

export type UpdateQuestionDataMutation = {
  updateQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQuestionDataMutationVariables = {
  input: DeleteQuestionDataInput,
  condition?: ModelQuestionDataConditionInput | null,
};

export type DeleteQuestionDataMutation = {
  deleteQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateQuestionDataStudentDataMutationVariables = {
  input: CreateQuestionDataStudentDataInput,
  condition?: ModelQuestionDataStudentDataConditionInput | null,
};

export type CreateQuestionDataStudentDataMutation = {
  createQuestionDataStudentData:  {
    __typename: "QuestionDataStudentData",
    id: string,
    studentDataID: string,
    studentData:  {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    questionDataID: string,
    questionData:  {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateQuestionDataStudentDataMutationVariables = {
  input: UpdateQuestionDataStudentDataInput,
  condition?: ModelQuestionDataStudentDataConditionInput | null,
};

export type UpdateQuestionDataStudentDataMutation = {
  updateQuestionDataStudentData:  {
    __typename: "QuestionDataStudentData",
    id: string,
    studentDataID: string,
    studentData:  {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    questionDataID: string,
    questionData:  {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQuestionDataStudentDataMutationVariables = {
  input: DeleteQuestionDataStudentDataInput,
  condition?: ModelQuestionDataStudentDataConditionInput | null,
};

export type DeleteQuestionDataStudentDataMutation = {
  deleteQuestionDataStudentData:  {
    __typename: "QuestionDataStudentData",
    id: string,
    studentDataID: string,
    studentData:  {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    questionDataID: string,
    questionData:  {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateWordMutationVariables = {
  input: CreateWordInput,
  condition?: ModelWordConditionInput | null,
};

export type CreateWordMutation = {
  createWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateWordMutationVariables = {
  input: UpdateWordInput,
  condition?: ModelWordConditionInput | null,
};

export type UpdateWordMutation = {
  updateWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteWordMutationVariables = {
  input: DeleteWordInput,
  condition?: ModelWordConditionInput | null,
};

export type DeleteWordMutation = {
  deleteWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonKeyWordMutationVariables = {
  input: CreateLessonKeyWordInput,
  condition?: ModelLessonKeyWordConditionInput | null,
};

export type CreateLessonKeyWordMutation = {
  createLessonKeyWord:  {
    __typename: "LessonKeyWord",
    id: string,
    wordID: string,
    lessonID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLessonKeyWordMutationVariables = {
  input: UpdateLessonKeyWordInput,
  condition?: ModelLessonKeyWordConditionInput | null,
};

export type UpdateLessonKeyWordMutation = {
  updateLessonKeyWord:  {
    __typename: "LessonKeyWord",
    id: string,
    wordID: string,
    lessonID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLessonKeyWordMutationVariables = {
  input: DeleteLessonKeyWordInput,
  condition?: ModelLessonKeyWordConditionInput | null,
};

export type DeleteLessonKeyWordMutation = {
  deleteLessonKeyWord:  {
    __typename: "LessonKeyWord",
    id: string,
    wordID: string,
    lessonID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateStudentWordMutationVariables = {
  input: CreateStudentWordInput,
  condition?: ModelStudentWordConditionInput | null,
};

export type CreateStudentWordMutation = {
  createStudentWord:  {
    __typename: "StudentWord",
    id: string,
    wordID: string,
    studentID: string,
    studentAuthID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStudentWordMutationVariables = {
  input: UpdateStudentWordInput,
  condition?: ModelStudentWordConditionInput | null,
};

export type UpdateStudentWordMutation = {
  updateStudentWord:  {
    __typename: "StudentWord",
    id: string,
    wordID: string,
    studentID: string,
    studentAuthID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStudentWordMutationVariables = {
  input: DeleteStudentWordInput,
  condition?: ModelStudentWordConditionInput | null,
};

export type DeleteStudentWordMutation = {
  deleteStudentWord:  {
    __typename: "StudentWord",
    id: string,
    wordID: string,
    studentID: string,
    studentAuthID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetInstitutionTypeQueryVariables = {
  id: string,
};

export type GetInstitutionTypeQuery = {
  getInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInstitutionTypesQueryVariables = {
  filter?: ModelInstitutionTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInstitutionTypesQuery = {
  listInstitutionTypes:  {
    __typename: "ModelInstitutionTypeConnection",
    items:  Array< {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetInstitutionQueryVariables = {
  id: string,
};

export type GetInstitutionQuery = {
  getInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInstitutionsQueryVariables = {
  id?: string | null,
  filter?: ModelInstitutionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInstitutionsQuery = {
  listInstitutions:  {
    __typename: "ModelInstitutionConnection",
    items:  Array< {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetPersonQueryVariables = {
  email: string,
  authId: string,
};

export type GetPersonQuery = {
  getPerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPersonsQueryVariables = {
  email?: string | null,
  authId?: ModelStringKeyConditionInput | null,
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPersonsQuery = {
  listPersons:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCurriculumQueryVariables = {
  id: string,
};

export type GetCurriculumQuery = {
  getCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCurriculumsQueryVariables = {
  id?: string | null,
  filter?: ModelCurriculumFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCurriculumsQuery = {
  listCurriculums:  {
    __typename: "ModelCurriculumConnection",
    items:  Array< {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCourseTypeQueryVariables = {
  id: string,
};

export type GetCourseTypeQuery = {
  getCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCourseTypesQueryVariables = {
  filter?: ModelCourseTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCourseTypesQuery = {
  listCourseTypes:  {
    __typename: "ModelCourseTypeConnection",
    items:  Array< {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCourseQueryVariables = {
  id: string,
};

export type GetCourseQuery = {
  getCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCoursesQueryVariables = {
  filter?: ModelCourseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCoursesQuery = {
  listCourses:  {
    __typename: "ModelCourseConnection",
    items:  Array< {
      __typename: "Course",
      id: string,
      name: string,
      courseTypeID: string,
      courseType:  {
        __typename: "CourseType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      institution:  {
        __typename: "Institution",
        id: string,
        name: string,
        institutionTypeId: string,
        district: string | null,
        address: string,
        city: string,
        state: string | null,
        zip: string,
        phone: string | null,
        website: string | null,
        image: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      classID: string,
      class:  {
        __typename: "Class",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      curriculumID: string,
      curriculum:  {
        __typename: "Curriculum",
        id: string,
        name: string | null,
        grade: Array< number | null > | null,
        languages: Array< Language | null > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      location: string | null,
      startDate: string | null,
      endDate: string | null,
      duration: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetClassQueryVariables = {
  id: string,
};

export type GetClassQuery = {
  getClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListClasssQueryVariables = {
  filter?: ModelClassFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListClasssQuery = {
  listClasss:  {
    __typename: "ModelClassConnection",
    items:  Array< {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetStudentDataQueryVariables = {
  classroomID: string,
  studentID: string,
};

export type GetStudentDataQuery = {
  getStudentData:  {
    __typename: "StudentData",
    id: string,
    lessonProgress: string,
    status: string,
    live: boolean,
    classroomID: string,
    classroom:  {
      __typename: "Classroom",
      id: string,
      open: boolean,
      openedAt: string | null,
      closedAt: string | null,
      roster: Array< string >,
      displayData:  {
        __typename: "DisplayData",
        breakdownComponent: string | null,
      } | null,
      courseID: string,
      course:  {
        __typename: "Course",
        id: string,
        name: string,
        courseTypeID: string,
        classID: string,
        curriculumID: string,
        location: string | null,
        startDate: string | null,
        endDate: string | null,
        duration: number | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonID: string,
      lesson:  {
        __typename: "Lesson",
        id: string,
        title: string,
        grades: Array< number | null > | null,
        artistID: string,
        language: Language,
        SELStructureID: string,
        connection: string | null,
        summary: string,
        objectives: Array< string | null >,
        doFirstID: string,
        warmUpId: string,
        coreLessonId: string,
        activityId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonPlan:  Array< {
        __typename: "ComponentSummary",
        id: string | null,
        disabled: boolean,
        open: boolean,
        active: boolean,
        stage: string,
        type: string,
        displayMode: string | null,
      } >,
      data:  {
        __typename: "ModelStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    studentID: string,
    studentAuthID: string,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    },
    warmupData:  {
      __typename: "WarmUpData",
      story: string | null,
      title: string | null,
      additional:  Array< {
        __typename: "AdditionalInputs",
        name: string | null,
        input: string | null,
      } | null > | null,
    } | null,
    corelessonData:  {
      __typename: "CoreLessonData",
      selected:  Array< {
        __typename: "Selection",
        anchor: string | null,
        color: string | null,
        focus: string | null,
        id: number | null,
      } | null > | null,
    } | null,
    activityData:  {
      __typename: "ActivityData",
      editInput: string | null,
      editMode: boolean | null,
      lines:  Array< {
        __typename: "LineInput",
        example: string | null,
        id: number | null,
        menuOpen: boolean | null,
        text: string | null,
      } | null > | null,
      title: string | null,
    } | null,
    doFirstData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    checkpointData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListStudentDatasQueryVariables = {
  classroomID?: string | null,
  studentID?: ModelStringKeyConditionInput | null,
  filter?: ModelStudentDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListStudentDatasQuery = {
  listStudentDatas:  {
    __typename: "ModelStudentDataConnection",
    items:  Array< {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetArtistQueryVariables = {
  id: string,
};

export type GetArtistQuery = {
  getArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListArtistsQueryVariables = {
  filter?: ModelArtistFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListArtistsQuery = {
  listArtists:  {
    __typename: "ModelArtistConnection",
    items:  Array< {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetClassroomQueryVariables = {
  id: string,
};

export type GetClassroomQuery = {
  getClassroom:  {
    __typename: "Classroom",
    id: string,
    open: boolean,
    openedAt: string | null,
    closedAt: string | null,
    roster: Array< string >,
    displayData:  {
      __typename: "DisplayData",
      breakdownComponent: string | null,
      studentInfo:  {
        __typename: "StudentInfo",
        id: string | null,
        firstName: string | null,
        preferredName: string | null,
        lastName: string | null,
      } | null,
      warmUpData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
    } | null,
    courseID: string,
    course:  {
      __typename: "Course",
      id: string,
      name: string,
      courseTypeID: string,
      courseType:  {
        __typename: "CourseType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      institution:  {
        __typename: "Institution",
        id: string,
        name: string,
        institutionTypeId: string,
        district: string | null,
        address: string,
        city: string,
        state: string | null,
        zip: string,
        phone: string | null,
        website: string | null,
        image: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      classID: string,
      class:  {
        __typename: "Class",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      curriculumID: string,
      curriculum:  {
        __typename: "Curriculum",
        id: string,
        name: string | null,
        grade: Array< number | null > | null,
        languages: Array< Language | null > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      location: string | null,
      startDate: string | null,
      endDate: string | null,
      duration: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonID: string,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonPlan:  Array< {
      __typename: "ComponentSummary",
      id: string | null,
      disabled: boolean,
      open: boolean,
      active: boolean,
      stage: string,
      type: string,
      displayMode: string | null,
    } >,
    data:  {
      __typename: "ModelStudentDataConnection",
      items:  Array< {
        __typename: "StudentData",
        id: string,
        lessonProgress: string,
        status: string,
        live: boolean,
        classroomID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListClassroomsQueryVariables = {
  filter?: ModelClassroomFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListClassroomsQuery = {
  listClassrooms:  {
    __typename: "ModelClassroomConnection",
    items:  Array< {
      __typename: "Classroom",
      id: string,
      open: boolean,
      openedAt: string | null,
      closedAt: string | null,
      roster: Array< string >,
      displayData:  {
        __typename: "DisplayData",
        breakdownComponent: string | null,
      } | null,
      courseID: string,
      course:  {
        __typename: "Course",
        id: string,
        name: string,
        courseTypeID: string,
        classID: string,
        curriculumID: string,
        location: string | null,
        startDate: string | null,
        endDate: string | null,
        duration: number | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonID: string,
      lesson:  {
        __typename: "Lesson",
        id: string,
        title: string,
        grades: Array< number | null > | null,
        artistID: string,
        language: Language,
        SELStructureID: string,
        connection: string | null,
        summary: string,
        objectives: Array< string | null >,
        doFirstID: string,
        warmUpId: string,
        coreLessonId: string,
        activityId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonPlan:  Array< {
        __typename: "ComponentSummary",
        id: string | null,
        disabled: boolean,
        open: boolean,
        active: boolean,
        stage: string,
        type: string,
        displayMode: string | null,
      } >,
      data:  {
        __typename: "ModelStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetSelStructureQueryVariables = {
  id: string,
};

export type GetSelStructureQuery = {
  getSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSelStructuresQueryVariables = {
  filter?: ModelSELStructureFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSelStructuresQuery = {
  listSELStructures:  {
    __typename: "ModelSELStructureConnection",
    items:  Array< {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetLessonQueryVariables = {
  id: string,
};

export type GetLessonQuery = {
  getLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListLessonsQueryVariables = {
  id?: string | null,
  filter?: ModelLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListLessonsQuery = {
  listLessons:  {
    __typename: "ModelLessonConnection",
    items:  Array< {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetDoFirstQueryVariables = {
  id: string,
};

export type GetDoFirstQuery = {
  getDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListDoFirstsQueryVariables = {
  filter?: ModelDoFirstFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDoFirstsQuery = {
  listDoFirsts:  {
    __typename: "ModelDoFirstConnection",
    items:  Array< {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetWarmUpQueryVariables = {
  id: string,
};

export type GetWarmUpQuery = {
  getWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListWarmUpsQueryVariables = {
  filter?: ModelWarmUpFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWarmUpsQuery = {
  listWarmUps:  {
    __typename: "ModelWarmUpConnection",
    items:  Array< {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCoreLessonQueryVariables = {
  id: string,
};

export type GetCoreLessonQuery = {
  getCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCoreLessonsQueryVariables = {
  filter?: ModelCoreLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCoreLessonsQuery = {
  listCoreLessons:  {
    __typename: "ModelCoreLessonConnection",
    items:  Array< {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetActivityQueryVariables = {
  id: string,
};

export type GetActivityQuery = {
  getActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListActivitysQueryVariables = {
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActivitysQuery = {
  listActivitys:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCheckpointQueryVariables = {
  id: string,
};

export type GetCheckpointQuery = {
  getCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCheckpointsQueryVariables = {
  filter?: ModelCheckpointFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCheckpointsQuery = {
  listCheckpoints:  {
    __typename: "ModelCheckpointConnection",
    items:  Array< {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetQuestionQueryVariables = {
  id: string,
};

export type GetQuestionQuery = {
  getQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListQuestionsQueryVariables = {
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuestionsQuery = {
  listQuestions:  {
    __typename: "ModelQuestionConnection",
    items:  Array< {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetQuestionDataQueryVariables = {
  id: string,
};

export type GetQuestionDataQuery = {
  getQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListQuestionDatasQueryVariables = {
  filter?: ModelQuestionDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuestionDatasQuery = {
  listQuestionDatas:  {
    __typename: "ModelQuestionDataConnection",
    items:  Array< {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetWordQueryVariables = {
  id: string,
};

export type GetWordQuery = {
  getWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListWordsQueryVariables = {
  filter?: ModelWordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWordsQuery = {
  listWords:  {
    __typename: "ModelWordConnection",
    items:  Array< {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type UserByIdQueryVariables = {
  id?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserByIdQuery = {
  userById:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type UsersByRoleQueryVariables = {
  role?: Role | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByRoleQuery = {
  usersByRole:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type SearchByWordQueryVariables = {
  word?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelWordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SearchByWordQuery = {
  searchByWord:  {
    __typename: "ModelWordConnection",
    items:  Array< {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type SearchPersonsQueryVariables = {
  filter?: SearchablePersonFilterInput | null,
  sort?: SearchablePersonSortInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SearchPersonsQuery = {
  searchPersons:  {
    __typename: "SearchablePersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
    total: number | null,
  } | null,
};

export type OnUpdateClassroomSubscriptionVariables = {
  id: string,
};

export type OnUpdateClassroomSubscription = {
  onUpdateClassroom:  {
    __typename: "Classroom",
    id: string,
    open: boolean,
    openedAt: string | null,
    closedAt: string | null,
    roster: Array< string >,
    displayData:  {
      __typename: "DisplayData",
      breakdownComponent: string | null,
      studentInfo:  {
        __typename: "StudentInfo",
        id: string | null,
        firstName: string | null,
        preferredName: string | null,
        lastName: string | null,
      } | null,
      warmUpData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
    } | null,
    courseID: string,
    course:  {
      __typename: "Course",
      id: string,
      name: string,
      courseTypeID: string,
      courseType:  {
        __typename: "CourseType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      institution:  {
        __typename: "Institution",
        id: string,
        name: string,
        institutionTypeId: string,
        district: string | null,
        address: string,
        city: string,
        state: string | null,
        zip: string,
        phone: string | null,
        website: string | null,
        image: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      classID: string,
      class:  {
        __typename: "Class",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      curriculumID: string,
      curriculum:  {
        __typename: "Curriculum",
        id: string,
        name: string | null,
        grade: Array< number | null > | null,
        languages: Array< Language | null > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      location: string | null,
      startDate: string | null,
      endDate: string | null,
      duration: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonID: string,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    lessonPlan:  Array< {
      __typename: "ComponentSummary",
      id: string | null,
      disabled: boolean,
      open: boolean,
      active: boolean,
      stage: string,
      type: string,
      displayMode: string | null,
    } >,
    data:  {
      __typename: "ModelStudentDataConnection",
      items:  Array< {
        __typename: "StudentData",
        id: string,
        lessonProgress: string,
        status: string,
        live: boolean,
        classroomID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnChangeStudentDataSubscriptionVariables = {
  classroomID: string,
};

export type OnChangeStudentDataSubscription = {
  onChangeStudentData:  {
    __typename: "StudentData",
    id: string,
    lessonProgress: string,
    status: string,
    live: boolean,
    classroomID: string,
    classroom:  {
      __typename: "Classroom",
      id: string,
      open: boolean,
      openedAt: string | null,
      closedAt: string | null,
      roster: Array< string >,
      displayData:  {
        __typename: "DisplayData",
        breakdownComponent: string | null,
      } | null,
      courseID: string,
      course:  {
        __typename: "Course",
        id: string,
        name: string,
        courseTypeID: string,
        classID: string,
        curriculumID: string,
        location: string | null,
        startDate: string | null,
        endDate: string | null,
        duration: number | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonID: string,
      lesson:  {
        __typename: "Lesson",
        id: string,
        title: string,
        grades: Array< number | null > | null,
        artistID: string,
        language: Language,
        SELStructureID: string,
        connection: string | null,
        summary: string,
        objectives: Array< string | null >,
        doFirstID: string,
        warmUpId: string,
        coreLessonId: string,
        activityId: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      lessonPlan:  Array< {
        __typename: "ComponentSummary",
        id: string | null,
        disabled: boolean,
        open: boolean,
        active: boolean,
        stage: string,
        type: string,
        displayMode: string | null,
      } >,
      data:  {
        __typename: "ModelStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    studentID: string,
    studentAuthID: string,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    },
    warmupData:  {
      __typename: "WarmUpData",
      story: string | null,
      title: string | null,
      additional:  Array< {
        __typename: "AdditionalInputs",
        name: string | null,
        input: string | null,
      } | null > | null,
    } | null,
    corelessonData:  {
      __typename: "CoreLessonData",
      selected:  Array< {
        __typename: "Selection",
        anchor: string | null,
        color: string | null,
        focus: string | null,
        id: number | null,
      } | null > | null,
    } | null,
    activityData:  {
      __typename: "ActivityData",
      editInput: string | null,
      editMode: boolean | null,
      lines:  Array< {
        __typename: "LineInput",
        example: string | null,
        id: number | null,
        menuOpen: boolean | null,
        text: string | null,
      } | null > | null,
      title: string | null,
    } | null,
    doFirstData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    checkpointData:  {
      __typename: "ModelQuestionDataStudentDataConnection",
      items:  Array< {
        __typename: "QuestionDataStudentData",
        id: string,
        studentDataID: string,
        questionDataID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInstitutionTypeSubscription = {
  onCreateInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInstitutionTypeSubscription = {
  onUpdateInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInstitutionTypeSubscription = {
  onDeleteInstitutionType:  {
    __typename: "InstitutionType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInstitutionSubscription = {
  onCreateInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInstitutionSubscription = {
  onUpdateInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInstitutionSubscription = {
  onDeleteInstitution:  {
    __typename: "Institution",
    id: string,
    name: string,
    institutionTypeId: string,
    institutionType:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    district: string | null,
    address: string,
    city: string,
    state: string | null,
    zip: string,
    phone: string | null,
    contact:  {
      __typename: "Contact",
      name: string | null,
      phone: string | null,
      email: string | null,
    },
    website: string | null,
    type:  {
      __typename: "InstitutionType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonSubscription = {
  onCreatePerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonSubscription = {
  onUpdatePerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonSubscription = {
  onDeletePerson:  {
    __typename: "Person",
    id: string,
    authId: string,
    status: PersonStatus,
    email: string,
    role: Role,
    firstName: string,
    preferredName: string | null,
    lastName: string,
    externalId: string | null,
    grade: string | null,
    wordbank:  {
      __typename: "ModelStudentWordConnection",
      items:  Array< {
        __typename: "StudentWord",
        id: string,
        wordID: string,
        studentID: string,
        studentAuthID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    phone: string | null,
    birthdate: string | null,
    image: string | null,
    language: Language,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCurriculumSubscription = {
  onCreateCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCurriculumSubscription = {
  onUpdateCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCurriculumSubscription = {
  onDeleteCurriculum:  {
    __typename: "Curriculum",
    id: string,
    name: string | null,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grade: Array< number | null > | null,
    languages: Array< Language | null > | null,
    lessons:  {
      __typename: "ModelCurriculumLessonsConnection",
      items:  Array< {
        __typename: "CurriculumLessons",
        id: string,
        curriculumID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCurriculumLessonsSubscription = {
  onCreateCurriculumLessons:  {
    __typename: "CurriculumLessons",
    id: string,
    curriculumID: string,
    lessonID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCurriculumLessonsSubscription = {
  onUpdateCurriculumLessons:  {
    __typename: "CurriculumLessons",
    id: string,
    curriculumID: string,
    lessonID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCurriculumLessonsSubscription = {
  onDeleteCurriculumLessons:  {
    __typename: "CurriculumLessons",
    id: string,
    curriculumID: string,
    lessonID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCourseTypeSubscription = {
  onCreateCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCourseTypeSubscription = {
  onUpdateCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCourseTypeSubscription = {
  onDeleteCourseType:  {
    __typename: "CourseType",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCourseSubscription = {
  onCreateCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCourseSubscription = {
  onUpdateCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCourseSubscription = {
  onDeleteCourse:  {
    __typename: "Course",
    id: string,
    name: string,
    courseTypeID: string,
    courseType:  {
      __typename: "CourseType",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    institution:  {
      __typename: "Institution",
      id: string,
      name: string,
      institutionTypeId: string,
      institutionType:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      district: string | null,
      address: string,
      city: string,
      state: string | null,
      zip: string,
      phone: string | null,
      contact:  {
        __typename: "Contact",
        name: string | null,
        phone: string | null,
        email: string | null,
      },
      website: string | null,
      type:  {
        __typename: "InstitutionType",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classID: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    curriculumID: string,
    curriculum:  {
      __typename: "Curriculum",
      id: string,
      name: string | null,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grade: Array< number | null > | null,
      languages: Array< Language | null > | null,
      lessons:  {
        __typename: "ModelCurriculumLessonsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    location: string | null,
    startDate: string | null,
    endDate: string | null,
    duration: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateClassSubscription = {
  onCreateClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateClassSubscription = {
  onUpdateClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteClassSubscription = {
  onDeleteClass:  {
    __typename: "Class",
    id: string,
    name: string,
    students:  {
      __typename: "ModelClassStudentConnection",
      items:  Array< {
        __typename: "ClassStudent",
        id: string,
        classID: string,
        studentID: string,
        studentEmail: string,
        studentAuth: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateClassStudentSubscription = {
  onCreateClassStudent:  {
    __typename: "ClassStudent",
    id: string,
    classID: string,
    studentID: string,
    studentEmail: string,
    studentAuth: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateClassStudentSubscription = {
  onUpdateClassStudent:  {
    __typename: "ClassStudent",
    id: string,
    classID: string,
    studentID: string,
    studentEmail: string,
    studentAuth: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteClassStudentSubscription = {
  onDeleteClassStudent:  {
    __typename: "ClassStudent",
    id: string,
    classID: string,
    studentID: string,
    studentEmail: string,
    studentAuth: string,
    class:  {
      __typename: "Class",
      id: string,
      name: string,
      students:  {
        __typename: "ModelClassStudentConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateArtistSubscription = {
  onCreateArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateArtistSubscription = {
  onUpdateArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteArtistSubscription = {
  onDeleteArtist:  {
    __typename: "Artist",
    id: string,
    images: Array< string > | null,
    name: string,
    type: string,
    bio: Array< string >,
    quotes:  Array< {
      __typename: "Quote",
      source: string,
      text: string,
    } >,
    additionalContent:  {
      __typename: "AdditionalContent",
      video: string | null,
      links:  Array< {
        __typename: "Link",
        type: string | null,
        text: string | null,
        link: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSelStructureSubscription = {
  onCreateSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSelStructureSubscription = {
  onUpdateSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSelStructureSubscription = {
  onDeleteSELStructure:  {
    __typename: "SELStructure",
    id: string,
    name: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonSubscription = {
  onCreateLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLessonSubscription = {
  onUpdateLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLessonSubscription = {
  onDeleteLesson:  {
    __typename: "Lesson",
    id: string,
    title: string,
    contributors:  {
      __typename: "ModelPersonConnection",
      items:  Array< {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    grades: Array< number | null > | null,
    artistID: string,
    artist:  {
      __typename: "Artist",
      id: string,
      images: Array< string > | null,
      name: string,
      type: string,
      bio: Array< string >,
      quotes:  Array< {
        __typename: "Quote",
        source: string,
        text: string,
      } >,
      additionalContent:  {
        __typename: "AdditionalContent",
        video: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    language: Language,
    SELStructureID: string,
    SELStructure:  {
      __typename: "SELStructure",
      id: string,
      name: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    keywords:  {
      __typename: "ModelLessonKeyWordConnection",
      items:  Array< {
        __typename: "LessonKeyWord",
        id: string,
        wordID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    connection: string | null,
    summary: string,
    objectives: Array< string | null >,
    checkpoints:  {
      __typename: "ModelLessonCheckpointConnection",
      items:  Array< {
        __typename: "LessonCheckpoint",
        id: string,
        lessonID: string,
        checkpointID: string,
        position: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    doFirstID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    warmUpId: string,
    warmUp:  {
      __typename: "WarmUp",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      inputs:  {
        __typename: "Inputs",
        title: boolean,
      },
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    coreLessonId: string,
    coreLesson:  {
      __typename: "CoreLesson",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      content:  {
        __typename: "Content",
        video: boolean,
        link: string | null,
        title: string,
        artist: string,
        text: Array< string >,
      },
      tools:  Array< {
        __typename: "Tool",
        name: string,
        color: string,
        icon: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    activityId: string,
    activity:  {
      __typename: "Activity",
      id: string,
      title: string,
      label: string,
      stage: string,
      type: string,
      language: Language,
      SELTypes: Array< string > | null,
      instructions:  {
        __typename: "Instructions",
        video: boolean,
        link: string | null,
        text: Array< string >,
      },
      lineNumber: number | null,
      writingPrompts:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } >,
      breakdown:  {
        __typename: "Breakdown",
        included: boolean,
        reflectionQuestions: Array< string | null > | null,
      },
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonCheckpointSubscription = {
  onCreateLessonCheckpoint:  {
    __typename: "LessonCheckpoint",
    id: string,
    lessonID: string,
    checkpointID: string,
    position: number,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLessonCheckpointSubscription = {
  onUpdateLessonCheckpoint:  {
    __typename: "LessonCheckpoint",
    id: string,
    lessonID: string,
    checkpointID: string,
    position: number,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLessonCheckpointSubscription = {
  onDeleteLessonCheckpoint:  {
    __typename: "LessonCheckpoint",
    id: string,
    lessonID: string,
    checkpointID: string,
    position: number,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDoFirstSubscription = {
  onCreateDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDoFirstSubscription = {
  onUpdateDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDoFirstSubscription = {
  onDeleteDoFirst:  {
    __typename: "DoFirst",
    id: string,
    type: string,
    required: boolean,
    questions:  {
      __typename: "ModelDoFirstQuestionConnection",
      items:  Array< {
        __typename: "DoFirstQuestion",
        id: string,
        doFirstID: string,
        questionID: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDoFirstQuestionSubscription = {
  onCreateDoFirstQuestion:  {
    __typename: "DoFirstQuestion",
    id: string,
    doFirstID: string,
    questionID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDoFirstQuestionSubscription = {
  onUpdateDoFirstQuestion:  {
    __typename: "DoFirstQuestion",
    id: string,
    doFirstID: string,
    questionID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDoFirstQuestionSubscription = {
  onDeleteDoFirstQuestion:  {
    __typename: "DoFirstQuestion",
    id: string,
    doFirstID: string,
    questionID: string,
    doFirst:  {
      __typename: "DoFirst",
      id: string,
      type: string,
      required: boolean,
      questions:  {
        __typename: "ModelDoFirstQuestionConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateWarmUpSubscription = {
  onCreateWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateWarmUpSubscription = {
  onUpdateWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteWarmUpSubscription = {
  onDeleteWarmUp:  {
    __typename: "WarmUp",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    inputs:  {
      __typename: "Inputs",
      title: boolean,
      additionalInputs:  Array< {
        __typename: "WritingPrompts",
        id: number | null,
        name: string,
        prompt: string,
        example: string,
      } > | null,
    },
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCoreLessonSubscription = {
  onCreateCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCoreLessonSubscription = {
  onUpdateCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCoreLessonSubscription = {
  onDeleteCoreLesson:  {
    __typename: "CoreLesson",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    content:  {
      __typename: "Content",
      video: boolean,
      link: string | null,
      title: string,
      artist: string,
      text: Array< string >,
    },
    tools:  Array< {
      __typename: "Tool",
      name: string,
      color: string,
      icon: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateActivitySubscription = {
  onCreateActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateActivitySubscription = {
  onUpdateActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteActivitySubscription = {
  onDeleteActivity:  {
    __typename: "Activity",
    id: string,
    title: string,
    label: string,
    stage: string,
    type: string,
    language: Language,
    SELTypes: Array< string > | null,
    instructions:  {
      __typename: "Instructions",
      video: boolean,
      link: string | null,
      text: Array< string >,
    },
    lineNumber: number | null,
    writingPrompts:  Array< {
      __typename: "WritingPrompts",
      id: number | null,
      name: string,
      prompt: string,
      example: string,
    } >,
    breakdown:  {
      __typename: "Breakdown",
      included: boolean,
      reflectionQuestions: Array< string | null > | null,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCheckpointSubscription = {
  onCreateCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCheckpointSubscription = {
  onUpdateCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCheckpointSubscription = {
  onDeleteCheckpoint:  {
    __typename: "Checkpoint",
    id: string,
    label: string,
    type: string,
    instructions: string,
    questions:  {
      __typename: "ModelCheckpointQuestionsConnection",
      items:  Array< {
        __typename: "CheckpointQuestions",
        id: string,
        checkpointID: string,
        questionID: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCheckpointQuestionsSubscription = {
  onCreateCheckpointQuestions:  {
    __typename: "CheckpointQuestions",
    id: string,
    checkpointID: string,
    questionID: string,
    required: boolean,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCheckpointQuestionsSubscription = {
  onUpdateCheckpointQuestions:  {
    __typename: "CheckpointQuestions",
    id: string,
    checkpointID: string,
    questionID: string,
    required: boolean,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCheckpointQuestionsSubscription = {
  onDeleteCheckpointQuestions:  {
    __typename: "CheckpointQuestions",
    id: string,
    checkpointID: string,
    questionID: string,
    required: boolean,
    checkpoint:  {
      __typename: "Checkpoint",
      id: string,
      label: string,
      type: string,
      instructions: string,
      questions:  {
        __typename: "ModelCheckpointQuestionsConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateQuestionSubscription = {
  onCreateQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateQuestionSubscription = {
  onUpdateQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteQuestionSubscription = {
  onDeleteQuestion:  {
    __typename: "Question",
    id: string,
    label: string,
    type: string,
    question: string,
    options:  Array< {
      __typename: "Option",
      text: string,
      label: string | null,
      icon: string | null,
      color: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateQuestionDataSubscription = {
  onCreateQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateQuestionDataSubscription = {
  onUpdateQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteQuestionDataSubscription = {
  onDeleteQuestionData:  {
    __typename: "QuestionData",
    id: string,
    questionID: string,
    email: string,
    authID: string,
    question:  {
      __typename: "Question",
      id: string,
      label: string,
      type: string,
      question: string,
      options:  Array< {
        __typename: "Option",
        text: string,
        label: string | null,
        icon: string | null,
        color: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    person:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    response: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateQuestionDataStudentDataSubscription = {
  onCreateQuestionDataStudentData:  {
    __typename: "QuestionDataStudentData",
    id: string,
    studentDataID: string,
    studentData:  {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    questionDataID: string,
    questionData:  {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateQuestionDataStudentDataSubscription = {
  onUpdateQuestionDataStudentData:  {
    __typename: "QuestionDataStudentData",
    id: string,
    studentDataID: string,
    studentData:  {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    questionDataID: string,
    questionData:  {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteQuestionDataStudentDataSubscription = {
  onDeleteQuestionDataStudentData:  {
    __typename: "QuestionDataStudentData",
    id: string,
    studentDataID: string,
    studentData:  {
      __typename: "StudentData",
      id: string,
      lessonProgress: string,
      status: string,
      live: boolean,
      classroomID: string,
      classroom:  {
        __typename: "Classroom",
        id: string,
        open: boolean,
        openedAt: string | null,
        closedAt: string | null,
        roster: Array< string >,
        courseID: string,
        lessonID: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      studentID: string,
      studentAuthID: string,
      student:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      },
      warmupData:  {
        __typename: "WarmUpData",
        story: string | null,
        title: string | null,
      } | null,
      activityData:  {
        __typename: "ActivityData",
        editInput: string | null,
        editMode: boolean | null,
        title: string | null,
      } | null,
      doFirstData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      checkpointData:  {
        __typename: "ModelQuestionDataStudentDataConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    questionDataID: string,
    questionData:  {
      __typename: "QuestionData",
      id: string,
      questionID: string,
      email: string,
      authID: string,
      question:  {
        __typename: "Question",
        id: string,
        label: string,
        type: string,
        question: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      person:  {
        __typename: "Person",
        id: string,
        authId: string,
        status: PersonStatus,
        email: string,
        role: Role,
        firstName: string,
        preferredName: string | null,
        lastName: string,
        externalId: string | null,
        grade: string | null,
        phone: string | null,
        birthdate: string | null,
        image: string | null,
        language: Language,
        createdAt: string,
        updatedAt: string,
      } | null,
      response: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateWordSubscription = {
  onCreateWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateWordSubscription = {
  onUpdateWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteWordSubscription = {
  onDeleteWord:  {
    __typename: "Word",
    id: string,
    word: string,
    definition: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonKeyWordSubscription = {
  onCreateLessonKeyWord:  {
    __typename: "LessonKeyWord",
    id: string,
    wordID: string,
    lessonID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLessonKeyWordSubscription = {
  onUpdateLessonKeyWord:  {
    __typename: "LessonKeyWord",
    id: string,
    wordID: string,
    lessonID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLessonKeyWordSubscription = {
  onDeleteLessonKeyWord:  {
    __typename: "LessonKeyWord",
    id: string,
    wordID: string,
    lessonID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    lesson:  {
      __typename: "Lesson",
      id: string,
      title: string,
      contributors:  {
        __typename: "ModelPersonConnection",
        nextToken: string | null,
      } | null,
      grades: Array< number | null > | null,
      artistID: string,
      artist:  {
        __typename: "Artist",
        id: string,
        images: Array< string > | null,
        name: string,
        type: string,
        bio: Array< string >,
        createdAt: string,
        updatedAt: string,
      },
      language: Language,
      SELStructureID: string,
      SELStructure:  {
        __typename: "SELStructure",
        id: string,
        name: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      keywords:  {
        __typename: "ModelLessonKeyWordConnection",
        nextToken: string | null,
      } | null,
      connection: string | null,
      summary: string,
      objectives: Array< string | null >,
      checkpoints:  {
        __typename: "ModelLessonCheckpointConnection",
        nextToken: string | null,
      } | null,
      doFirstID: string,
      doFirst:  {
        __typename: "DoFirst",
        id: string,
        type: string,
        required: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      warmUpId: string,
      warmUp:  {
        __typename: "WarmUp",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      coreLessonId: string,
      coreLesson:  {
        __typename: "CoreLesson",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        createdAt: string,
        updatedAt: string,
      },
      activityId: string,
      activity:  {
        __typename: "Activity",
        id: string,
        title: string,
        label: string,
        stage: string,
        type: string,
        language: Language,
        SELTypes: Array< string > | null,
        lineNumber: number | null,
        createdAt: string,
        updatedAt: string,
      },
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateStudentWordSubscription = {
  onCreateStudentWord:  {
    __typename: "StudentWord",
    id: string,
    wordID: string,
    studentID: string,
    studentAuthID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateStudentWordSubscription = {
  onUpdateStudentWord:  {
    __typename: "StudentWord",
    id: string,
    wordID: string,
    studentID: string,
    studentAuthID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteStudentWordSubscription = {
  onDeleteStudentWord:  {
    __typename: "StudentWord",
    id: string,
    wordID: string,
    studentID: string,
    studentAuthID: string,
    word:  {
      __typename: "Word",
      id: string,
      word: string,
      definition: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    student:  {
      __typename: "Person",
      id: string,
      authId: string,
      status: PersonStatus,
      email: string,
      role: Role,
      firstName: string,
      preferredName: string | null,
      lastName: string,
      externalId: string | null,
      grade: string | null,
      wordbank:  {
        __typename: "ModelStudentWordConnection",
        nextToken: string | null,
      } | null,
      phone: string | null,
      birthdate: string | null,
      image: string | null,
      language: Language,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
