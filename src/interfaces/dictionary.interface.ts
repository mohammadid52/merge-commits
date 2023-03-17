interface ButtonInterfaceCommon {
  ADD: string;
  ADD_NEW: string;
  DELETE: string;
  EDIT: string;
  SAVE: string;
  SAVING: string;
  CANCEL: string;
  PUBLISH: string;
  YES: string;
  CREATE: string;
  CREATING: string;
}
export interface ButtonInterface {
  EN: ButtonInterfaceCommon;
  ES: ButtonInterfaceCommon;
}

interface BreadcrumbsTitlesInterfaceCommon {
  HOME: string;
  PROFILE: string;
  TEST_CASES: string;
  PEOPLE: string;
  INSTITUTION_MANAGEMENT: string;
  ADD_INSTITUTION: string;
  INSTITUTION_INFO: string;
  INSTITUTION_GENERAL_INFO: string;
  Class_Creation: string;
  CURRICULARBUILDER: string;
  CURRICULUM: string;
  COURSES: string;
  UNITS: string;
  CLASSROOM_CREATION: string;
  CLASSROOMS: string;
  CLASSROOM: string;
  CLASSES: string;
  EDITCLASS: string;
  EDITCURRICULUM: string;
  EDITCLASSROOM: string;
  CURRICULUMBUILDER: string;
  LEARINGOBJECTIVE: string;
  AddMeasurement: string;
  AddCheckpint: string;
  UnitBuilder: string;
  COURSE_BUILDER: string;
  AddTopic: string;
  EditLearningObj: string;
  EditMeasurement: string;
  AddChekpoint: string;
  EditTopic: string;
  AddExistingCheckpoint: string;
  STAFF: string;
  PeopleManagment: string;
  AddNewUser: string;
  USERS: string;
  UserInfo: string;
  LESSONS: string;
  LESSONPLANBUILDER: string;
  LESSON_BUILDER: string;
  LESSON_EDITOR: string;
  STUDENTS: string;
  STUDENTS_NOTEBOOK: string;
  ADD_NEW_LESSON_PLAN: string;
  LOADING: string;
  COMMUNTIY: string;
}
export interface BreadcrumbsTitlesInterface {
  EN: BreadcrumbsTitlesInterfaceCommon;
  ES: BreadcrumbsTitlesInterfaceCommon;
}

interface PersonalInfo {
  TITLE: string;
  FULL_NAME: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  NICKNAME: string;
  BIRTHDAY: string;
  LANGUAGE: string;
  EMAIL: string;
  CONTACT: string;
  ROLE: string;
  PASSWORD: string;
  PASSCODE: string;
  SUPER_ADMIN: string;
}

interface InstitutionInfo {
  TITLE: string;
  INSTITUTION: string;
  GRADE: string;
}

interface EditProfile {
  TITLE: string;
  FIRST_NAME: string;
  BIRTHDAY: string;
  LAST_NAME: string;
  NICKNAME: string;
  LANGUAGE: string;
  CONTACT: string;
  SAVE: string;
  CANCEL: string;
}

interface ChangePasscode {
  TITLE: string;
  INFO: string;
  OLD_PASS: string;
  NEW_PASS: string;
  SAVE: string;
  CANCEL: string;
  SUCCESS_MSG: string;
  WARN_MSG: string;
  CONTINUE_BTN: string;
  ERRORS: {
    NO_OLD_PASS: string;
    NO_NEW_PASS: string;
    NO_CONFIRM_PASS: string;
    NOT_MATCH: string;
  };
}

interface ChangePassword {
  TITLE: string;
  INFO: string;
  OLD_PASS: string;
  NEW_PASS: string;
  CONFIRM_PASS: string;
  FORGOT_PASS_LINK: string;
  SAVE: string;
  CANCEL: string;
  SUCCESS_MSG: string;
  WARN_MSG: string;
  CONTINUE_BTN: string;
  ERRORS: {
    NO_OLD_PASS: string;
    NO_NEW_PASS: string;
    NO_CONFIRM_PASS: string;
    NOT_MATCH: string;
  };
}

interface DashboardProfileDictCommon {
  PROFILE: string;
  TITLE: string;
  PROFILE_INSTRUCTON: string;
  SUBTITLE: string;
  PERSONAL_INFO: PersonalInfo;
  INSTITUTION_INFO: InstitutionInfo;
  EDIT_PROFILE: EditProfile;
  CHANGE_PASSCODE: ChangePasscode;
  CHANGE_PASSWORD: ChangePassword;
}
export interface DashboardProfileDict {
  EN: DashboardProfileDictCommon;
  ES: DashboardProfileDictCommon;
}

interface InstitutionAddDictCommon {
  INFOA: string;
  INFO: string;
  TITLE: string;
  SUBTITLE: string;
  FORM: {
    TITLE: string;
    INSTITUTION_TYPE: string;
    NAME_INPUT_LABEL: string;
    NAME_INPUT_PLACEHOLDER: string;
    WEBSITE_INPUT_LABEL: string;
    WEBSITE_INPUT_PLACEHOLDER: string;
    ADDRESS_INPUT_LABEL: string;
    ADDRESS2_INPUT_LABEL: string;
    CITY_LABEL: string;
    STATE_LABEL: string;
    ZIP_LABEL: string;
    PHONE_LABEL: string;
    state: string;
    SERVICEPROVIDER_LABEL_WITH_NAME: string;
    SERVICEPROVIDER_LABEL_WITHOUT_NAME: string;
  };
  SERVICE_VENDORS: string;

  INSTITUTION_TYPE: {
    SCHOOL: string;
    AFTERSCHOOL: string;
    DAYCAMP: string;
    SUMMERCAMP: string;
    C3: string;
  };
  BUTTON: {
    CANCEL: string;
    SAVE: string;
  };
  messages: {
    namerequired: string;
    saveMsg: string;
    adderr: string;
    uploaderr: string;
  };
}

export interface InstitutionAddDictInterface {
  EN: InstitutionAddDictCommon;
  ES: InstitutionAddDictCommon;
}

interface AuthDictInterfaceCommon {
  VERIFY_EMAIL: string;
  LOGIN: string;
}

export interface AuthDictInterface {
  EN: AuthDictInterfaceCommon;
  ES: AuthDictInterfaceCommon;
}

interface AnthologyDictCommon {
  TITLE_CONTAINER: string;
  TITLE: string;
  NO_SELECTED: string;
  TABS: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  ACTIONS: {
    ADD: string;
    EDIT: string;
    CREATE: string;
    DELETE: string;
    SAVE: string;
    CANCEL: string;
    CONFIRM: string;
    UPLOAD: string;
  };
}

export interface AnthologyDictInterface {
  EN: AnthologyDictCommon;
  ES: AnthologyDictCommon;
}

interface DashboardTestCasesDictCommon {
  PROFILE: string;
  TITLE: string;
  SUBTITLE: string;
  EDIT_TEST_CASES: {
    TEST_ID: string;
    TEST_NAME: string;
    TEST_TYPE: string;
    TEST_STEPS: string;
    TEST_DATA: string;
    TEST_EXP_RESULTS: string;
    TEST_EDGE_CASES: string;
    SAVE: string;
    CANCEL: string;
  };
}

export interface DashboardTestCasesDictInterface {
  EN: DashboardTestCasesDictCommon;
  ES: DashboardTestCasesDictCommon;
}

interface ManageUsersDictInterfaceCommon {
  TITLE: string;
  SUBTITLE: string;
  TABLE: {
    NAME: string;
    ROLE: string;
    INST: string;
    STATUS: string;
    ACTIONS: string;
  };
  ADD_NEW: string;
}

export interface ManageUsersDictInterface {
  EN: ManageUsersDictInterfaceCommon;
  ES: ManageUsersDictInterfaceCommon;
}

interface SideBarLinksDictCommon {
  REGISTRATION: string;
  INSTITUTIONS: string;
  PEOPLE: string;
  LESSON_PLANNER: string;
  CLASSROOM: string;
  LESSON_BUILDER: string;
  UNIVERSAL_LESSON_BUILDER: string;
  ANTHOLOGY: string;
  NOTICEBOARD: string;
  NOTEBOOK: string;
  DASHBOARD: string;
  RESEARCHANALYTICS: string;
}

export interface SideBarLinksDictInterface {
  EN: SideBarLinksDictCommon;
  ES: SideBarLinksDictCommon;
}

interface AppDictCommon {
  LOG_OUT: string;
  LOADING: string;
}

export interface AppDictInterface {
  EN: AppDictCommon;
  ES: AppDictCommon;
}

interface StaffBuilderDictCommon {
  TITLE: string;
  ADD_PLACEHOLDER: string;
  ADD_SUPER_ADMIN_PLACEHOLDER: string;
  ADD_SUPER_ADMIN: string;
  ADD_BUTTON: string;
  NO: string;
  NAME: string;
  ROLE: string;
  INSTITUTION_NAME: string;
  STATUS: string;
  ACTION: string;
  UPDATING: string;
  CANCEL: string;
  INFO: string;
  LOADING: string;
  STATUS_PLACEHOLDER: string;
  EDIT: string;
}

export interface StaffBuilderDictInterface {
  EN: StaffBuilderDictCommon;
  ES: StaffBuilderDictCommon;
}

interface SpBuilderDictCommon {
  TITLE: string;
  ADD_PLACEHOLDER: string;
  ADD_BUTTON: string;
  NO: string;
  SERVICE: string;
  STATUS: string;
  ACTION: string;
  UPDATING: string;
  CANCEL: string;
  INFO: string;
}

export interface SpBuilderDictInterface {
  EN: SpBuilderDictCommon;
  ES: SpBuilderDictCommon;
}

interface EditClassDictCommon {
  TITLE: string;
  SUBTITLE: string;
  NAME_INPUT_LABEL: string;
  STUDENTS: string;
  ADD_STUDENT_PLACEHOLDER: string;
  ADD_STUDENT_LABEL: string;
  ADD_STUDENT_FROM_REGSITER: string;
  ADD_STUDENT_BUTTON: string;
  GROUP: string;
  GROUP_PLACEHOLDER: string;
  UPDATING: string;
  CANCEL: string;
  NOSTUDENT: string;
  LOADING: string;
  EDIT: string;
  heading: string;
  heading2: string;
  messages: {
    errorfetch: string;
    errorstudentadd: string;
    processerror: string;
    classrequired: string;
    selectinstitute: string;
    classexist: string;
    classupdate: string;
    unableupdate: string;
  };
  TABLE: {
    SNO: string;
    NAME: string;
    GROUP: string;
    STATUS: string;
    LOCATION: string;
    TYPE: string;
    DATE: string;
    ACTIONS: string;
  };
}

export interface EditClassDictInterface {
  EN: EditClassDictCommon;
  ES: EditClassDictCommon;
}

interface LessonDictCommon {
  CLASS: string;
  TOPIC_CONNECTION: string;
  KEYWORDS: string;
  REFLECTION_QUESTIONS: string;
}

export interface LessonDictInterface {
  EN: LessonDictCommon;
  ES: LessonDictCommon;
}

interface NoticeboardDictCommon {
  JOIN_CALL: {
    DEFAULT: string;
    ZOOM: string;
    MEET: string;
    TEAMS: string;
  };
  DOWNLOAD: string;
  SECTION_TITLE: {
    ROOM_SELECTOR: string;
    WIDGET_MANAGER: string;
  };
  ROOMS: {
    NONE: string;
  };
  FORM: {
    WIDGET_STATUS: string;
    ACTIVE: string;
    INACTIVE: string;
    PLACEMENT: string;
    CONTENT: string;
    IN_SIDEBAR: string;
    ABOVE_LESSONS: string;
    PLEASE_ADD_TITLE: string;
    TITLE: string;
    TYPE: string;
    PLEASE_ADD: string;
  };
  WIDGET_DESCRIPTION: {
    TEXT: string;
    QUOTES: string;
    CALL: string;
    FILE: string;
  };
}

export interface NoticeboardDictInterface {
  EN: NoticeboardDictCommon;
  ES: NoticeboardDictCommon;
}

interface ClassroomDictCommon {
  TITLE: string;
  LIST_TITLE: string;
  LESSON: string;
  LIST_LESSON: string;
  ASSESSMENT: string;
  SURVEY: string;
  LESSON_PLANNER: string;
  ASSESSMENT_TITLE: string;
  STEP: string;
  UNIT_TITLE: string;
  UNIT_SUB_TITLE: string;
  LESSON_TITLE: string;
  LESSON_SUB_TITLE: string;
  LESSON_SUB_TITLE_ASYNC: string;
  BOTTOM_BAR: {
    START: string;
    DISABLE: string;
    ENABLE: string;
    TEACH: string;
    ACTIVE: string;
    COMPLETED: string;
    OPENED: string;
    CLOSED: string;
    SURVEY: string;
    UPCOMING: string;
    GO_TO_NOTEBOOK: string;
  };

  LESSON_TABS: {
    TAB_ONE: string;
    TAB_TWO: string;
  };
  MESSAGES: {
    SELECT_SYLLABUS: string;
    NO_SYLLABUS: string;
    SELECT_CLASSROOM: string;
    NO_LESSONS: string;
    SELECT_CLASSROOM_WIDGETS: string;
    PLEASE_WAIT: string;
  };
}

export interface ClassroomDictInterface {
  EN: ClassroomDictCommon;
  ES: ClassroomDictCommon;
}

interface LessonPlannerDictCommon {
  INTRO: string;
  WARM_UP: string;
  CORE_LESSON: string;
  ACTIVITY: string;
  CHECKPOINT: string;
  OUTRO: string;
  BREAKDOWN: string;
  NA: string;
  WARMUP_BREAKDOWN: string;
  CORELESSON_BREAKDOWN: string;
  ACTIVITY_BREAKDOWN: string;
  OTHER_LABELS: {
    ROOM_NAME: string;
    STUDDENT_ONLINE: string;
    TOPIC: string;
    START_DATE: string;
    EST_TIME: string;
    LESSON_CONTROL: string;
    COLUMN: {
      ONE: string;
      TWO: string;
      THREE: string;
    };
    STUDENT_SECTION: {
      IN_CLASS: string;
      NOT_IN_CLASS: string;
      ON_DEMAND: string;
    };
  };
  ACCESS_BUTTONS: {
    START: string;
    COMPLETE: string;
  };
}

export interface LessonPlannerDictInterface {
  EN: LessonPlannerDictCommon;
  ES: LessonPlannerDictCommon;
}

interface PreviewFormDictCommon {
  FETCHING: string;
  PURPOSE: string;
  OBJECTIVE: string;
  CHECKPOINT: string;
  NOCHECKPOINT: string;
  MESSAGES: {
    UPDATESUCCESS: string;
    UPDATEERR: string;
    CONNECTERR: string;
    FETCHERR: string;
  };
  PREVIEW_DETAILS: {
    WARN_MESSAGE: string;
    TITLE: string;
  };
}

export interface PreviewFormDictInterface {
  EN: PreviewFormDictCommon;
  ES: PreviewFormDictCommon;
}
