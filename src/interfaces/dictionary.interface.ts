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
export interface DashboardProfileDictInterface {
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

interface InstitutionDictCommon {
  TITLE: string;
  SUBTITLE: string;
  TABLE: {
    NAME: string;
    TYPE: string;
    WEBSITE: string;
    CONTACT: string;
    ACTION: string;
    NORESULT: string;
  };
  SHOWPAGE: string;
  OF: string;
  PAGES: string;
  SORTBY: string;
  BUTTON: {
    Add: string;
  };
}

export interface InstitutionDictInterface {
  EN: InstitutionDictCommon;
  ES: InstitutionDictCommon;
}

interface InstitutionInfoCommon {
  TITLE: string;
  ADDRESS: string;
  CONTACT: string;
  INSTITUTION_TYPE: string;
  WEBSITE: string;
  SERVICE_PROVIDER: string;
  TABS: {
    DASHBOARD: string;
    SERVICE_PROVIDER: string;
    STAFF: string;
    USER_REGISTRY: string;
    CLASS_MANAGER: string;
    REGISTER_NEW_USER: string;
    LIVE_CLASS_ROOM: string;
    COURSE_MANAGER: string;
    COURSES: string;
    UNITS: string;
    COMMUNITY_MANAGER: string;
    INSTITUTION_MANAGER: string;
    CLASSES: string;
    STUDENT_ROASTER: string;
    CURRICULAR: string;
    CLASSROOMS: string;
    GENERAL_INFORMATION: string;
    LESSONS: string;
    RESEARCH_AND_ANALYTICS: string;
    DOWNLOAD_SURVEYS: string;
    UPLOAD_SURVEY: string;
    DOWNLOAD_CSV: string;
    UPLOAD_CSV: string;
    UPLOAD_TO_ATHENA: string;
    HOME: string;
    NOTEBOOK: string;
    COMMUNITY: string;
    GAME_CHANGERS: string;
    EDIT_PROFILE: string;
    DICTIONARY: string;
    TEST_CASES: string;
    ERRORS: string;
    UPLOAD_LOGS: string;
    ADD_NEW_COURSE: string;
    ADD_NEW_UNIT: string;
    ADD_NEW_LESSON: string;
    ADD_NEW_ROOM: string;
  };
}

export interface InstitutionInfoInterface {
  EN: InstitutionInfoCommon;
  ES: InstitutionInfoCommon;
}

interface InstitutionEditDictCommon {
  INFO: string;
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
    SERVICEPROVIDER_LABEL_WITH_NAME: string;
    SERVICEPROVIDER_LABEL_WITHOUT_NAME: string;
  };
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
    typerequired: string;
    unabletoupdate: string;
    saveMsg: string;
    uploaderr: string;
    deleterr: string;
    imgeerr: string;
  };
}

export interface InstitutionEditDictInterface {
  EN: InstitutionEditDictCommon;
  ES: InstitutionEditDictCommon;
}

interface InstitutionBuilderDictCommon {
  GENERAL_INFORMATION: string;
  INFOA: string;
  INFO: string;
  TITLE: string;
  EDIT_TITLE: string;
  SUBTITLE: string;
  FORM: {
    TITLE: string;
    INSTITUTION_TYPE: string;
    NAME_INPUT_LABEL: string;
    NAME_INPUT_PLACEHOLDER: string;
    WEBSITE_INPUT_LABEL: string;
    WEBSITE_INPUT_PLACEHOLDER: string;
    STATUS: string;
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
    uploaderr: string;
    adderr: string;
  };
}

export interface InstitutionBuilderDictInterface {
  EN: InstitutionBuilderDictCommon;
  ES: InstitutionBuilderDictCommon;
}

interface InstituteClassCommon {
  TITLE: string;
  NO: string;
  CLASSNAME: string;
  ACTION: string;
  EDIT: string;
  INFO: string;
  BUTTON: {
    ADD: string;
  };
}

export interface InstituteClassInterface {
  EN: InstituteClassCommon;
  ES: InstituteClassCommon;
}

interface InstituteCurriculumCommon {
  TITLE: string;
  BUTTON: {
    ADD: string;
  };
  NO: string;
  NAME: string;
  INSTITUTION_NAME: string;
  ROOMS: string;
  COURSE_TYPE: string;
  UNITS: string;
  ACTION: string;
  VIEW: string;
  INFO: string;
  NO_DELETE: string;
  LOADING: string;
  SELECT_INSTITUTION: string;
}

export interface InstituteCurriculumInterface {
  EN: InstituteCurriculumCommon;
  ES: InstituteCurriculumCommon;
}

interface InstitueRommsCommon {
  TITLE: string;
  NO: string;
  CLASSROOMS_NAME: string;
  CLASS_NAME: string;
  INSTITUTION_NAME: string;
  TEACHER: string;
  CO_TEACHER: string;
  CURRICULUM: string;
  STATUS: string;
  MXSTUDENTS: string;
  ACTION: string;
  EDIT: string;
  messages: {
    nothaveclass: string;
    fetcherr: string;
  };
  BUTTON: {
    ADD: string;
  };
  LOADING: string;
  SELECT_STAFF: string;
  SELECT_INSTITUTION: string;
}

export interface InstitueRommsInterface {
  EN: InstitueRommsCommon;
  ES: InstitueRommsCommon;
}

interface ClassBuilderdictCommon {
  TITLE: string;
  SUBTITLE: string;
  NAME_LABEL: string;
  HEADING: string;
  HEADING2: string;
  MEMBER_PLACEHOLDER: string;

  BUTTON: {
    ADD: string;
    SAVE: string;
    SAVING: string;
  };

  MESSAGES: {
    ERROR: {
      FETCHSTUDENT: string;
      FETCHINSTITUTION: string;
      STUDENTADDERROR: string;
      SAVECLASSERROR: string;
      PROCESSINGERROR: string;
      INVALIDPATH: string;
    };
    VALIDATION: {
      NAME: string;
      INSTITUTE: string;
      CLASSNAME: string;
    };
    SUCCESS: {
      CLASSSAVE: string;
    };
  };
}

export interface ClassBuilderdictInterface {
  EN: ClassBuilderdictCommon;
  ES: ClassBuilderdictCommon;
}

interface CourseBuilderDictCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME: string;
  LANGUAGE: string;
  DESIGNER: string;
  TYPE: string;
  SUMMARY: string;
  DESCRIPTION: string;
  OBJECT: string;
  ADD_NEW_UNIT: string;
  SELECT_UNIT: string;
  NO_UNIT: string;
  TABLE_HEADS: {
    NUMBER: string;
    LESSONS: string;
    OBJECTIVES: string;
    UNIT_NAME: string;
    ACTION: string;
  };
  MESSAGES: {
    ERROR: {
      save: string;
      fetch: string;

      designerlist: string;
      process: string;
      UPDATE_ERROR: string;
      fetchlist: string;
      invalid: string;
      FETCH_COURSE_ERR: string;
      FETCH_UNIT_ERR: string;
    };
    validation: {
      name: string;
      institute: string;
      curricular: string;
    };
    success: {
      save: string;
    };
  };
  BUTTON: {
    SAVE: string;
    SAVING: string;
  };
}

export interface CourseBuilderDictInterface {
  EN: CourseBuilderDictCommon;
  ES: CourseBuilderDictCommon;
}

interface CurricularBuilderdictCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME: string;
  LANGUAGE: string;
  DESIGNER: string;
  TYPE: string;
  SUMMARY: string;
  DESCRIPTION: string;
  OBJECT: string;
  messages: {
    error: {
      save: string;
      fetch: string;
      designerlist: string;
      process: string;
      invalid: string;
    };
    validation: {
      name: string;
      institute: string;
      curricular: string;
    };
    success: {
      save: string;
    };
  };
  BUTTON: {
    SAVE: string;
    SAVING: string;
  };
}

export interface CurricularBuilderdictInterface {
  EN: CurricularBuilderdictCommon;
  ES: CurricularBuilderdictCommon;
}

interface RoomBuilderdictCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME_LABEL: string;
  NAME_PLACEHOLDER: string;
  TEACHER_LABEL: string;
  CO_TEACHER_LABEL: string;
  TEACHER_PLACEHOLDER: string;
  CO_TEACHER_PLACEHOLDER: string;
  CLASS_NAME_LABEL: string;
  CLASS_NAME_PLACEHOLDER: string;
  CURRICULUM_LABEL: string;
  CURRICULUM_PLACEHOLDER: string;
  INSTITUTION_LABEL: string;
  INSTITUTION_PLACEHOLDER: string;
  STATUS_LABEL: string;
  STATUS_PLACEHOLDER: string;
  MAXSTUDENT_LABEL: string;
  MAXSTUDENT_PLACHOLDER: string;

  BUTTON: {
    SAVE: string;
    SAVING: string;
  };
  messages: {
    errupdatingclass: string;
    error: {
      institutebefor: string;
      institutelist: string;
      staffmember: string;
      teacherlist: string;
      createclass: string;
      classlist: string;
      curricular: string;
      process: string;
      classroomadd: string;
      ecreateclass: string;
      invalid: string;
    };
    validation: {
      classroomname: string;
      institute: string;
      teacher: string;
      class: string;
      maxstudent: string;
      allowstudent: string;
      classroomexist: string;
    };
    success: {
      classroomdetail: string;
      newclassroom: string;
    };
  };
}

export interface RoomBuilderdictInterface {
  EN: RoomBuilderdictCommon;
  ES: RoomBuilderdictCommon;
}

interface EditCurriculardictCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME: string;
  LANGUAGE: string;
  DESIGNER: string;
  TYPE: string;
  SUMMARY: string;
  DESCRIPTION: string;
  OBJECTIVE: string;
  messages: {
    fetcherr: string;
    curricularchange: string;
    updateerror: string;
    unablefetch: string;
    processerr: string;
    namerequired: string;
    selectinstitute: string;
    nameexist: string;
    fetchinger: string;
  };
  BUTTON: {
    SAVE: string;
    CANCEL: string;
  };
}

export interface EditCurriculardictInterface {
  EN: EditCurriculardictCommon;
  ES: EditCurriculardictCommon;
}

interface RoomEDITdictCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME_LABEL: string;
  NAME_PLACEHOLDER: string;
  TEACHER_LABEL: string;
  TEACHER_PLACEHOLDER: string;
  CO_TEACHER_LABEL: string;
  CO_TEACHER_PLACEHOLDER: string;
  CLASS_NAME_LABEL: string;
  CLASS_NAME_PLACEHOLDER: string;
  CURRICULUM_LABEL: string;
  ACTIVE_UNIT_LABEL: string;
  ACTIVE_UNIT_PLACEHOLDER: string;
  CURRICULUM_PLACEHOLDER: string;
  STATUS_LABEL: string;
  STATUS_PLACEHOLDER: string;
  INSTITUTION_LABEL: string;
  INSTITUTION_PLACEHOLDER: string;
  MAXSTUDENT_LABEL: string;
  MAXSTUDENT_PLACHOLDER: string;
  CONFERENCE_CALL_LINK_LABEL: string;
  CONFERENCE_CALL_LINK_PLACEHOLDER: string;
  LOCATION_LABEL: string;
  METHOD: string;
  LOCATION_PLACEHOLDER: string;
  CLASS_DETAILS_TAB_HEADING: string;
  CLASS_DETAILS_TAB_DESCRIPTION: string;
  CLASS_STUDENT_TAB_HEADING: string;
  CLASS_STUDENT_TAB_DESCRIPTION: string;
  CLASS_DYNAMICS_TAB_HEADING: string;
  CLASS_DYNAMICS_TAB_DESCRIPTION: string;
  CLASS_UNIT_PLANNER_TAB_HEADING: string;
  CLASS_UNIT_PLANNER_TAB_DESCRIPTION: string;
  TAB_DISABLED_TOOLTIP_TEXT: string;
  messages: {
    institutebefor: string;
    unabletofetch: string;
    addstaffirst: string;
    unableteacher: string;
    addclassfirst: string;
    unableclass: string;
    unablecurricular: string;
    errorprocess: string;
    classroomrequired: string;
    selectinstitute: string;
    selectteacher: string;
    selectCurriculum: string;
    selectclass: string;
    mxstudent: string;
    oneclass: string;
    alreadyexist: string;
    classupdate: string;
    errupdating: string;
    errprocess: string;
    errupdatingclass: string;
    errfetch: string;
  };
  BUTTON: {
    SAVE: string;
    SAVING: string;
    CANCEL: string;
  };
}

export interface RoomEDITdictInterface {
  EN: RoomEDITdictCommon;
  ES: RoomEDITdictCommon;
}

interface RoomDetailsDictCommon {
  COURSE_DETAILS: string;
  COURSE_FREQUENCY: string;
  COURSE_PARTNERS: string;
  SUBJECT_PROFICIENCY: string;
}

export interface RoomDetailsDictInterface {
  EN: RoomDetailsDictCommon;
  ES: RoomDetailsDictCommon;
}

interface GroupFormDictCommon {
  HEADING: string;
  LABELS: {
    GROUP_NAME: string;
    ADVISOR: string;
    LOCATION: string;
    STUDENTS: string;
  };
  PLACEHOLDERS: {
    GROUP_NAME: string;
    ADVISOR: string;
    LOCATION: string;
  };
  MESSAGES: {
    GROUP_NAME: string;
    GROUP_ADVISOR: string;
  };
}

export interface GroupFormDictInterface {
  EN: GroupFormDictCommon;
  ES: GroupFormDictCommon;
}

interface CourseScheduleDictCommon {
  HEADING: string;
  PLACEHOLDERS: {
    START_DATE: string;
    END_DATE: string;
    START_TIME: string;
    END_TIME: string;
    WEEK_DAY: string;
    FREQUENCY: string;
    CONFERENCE_CALL_LINK: string;
    LOCATION: string;
    ADDITIONAL_NOTES: string;
  };
  MESSAGES: {
    START_DATE: string;
    END_DATE: string;
    START_TIME: string;
    END_TIME: string;
    SUCCESS_MESSAGE: string;
  };
}

export interface CourseScheduleDictInterface {
  EN: CourseScheduleDictCommon;
  ES: CourseScheduleDictCommon;
}

interface CurricularViewCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME: string;
  OWNER: string;
  DESCRIPTION: string;
  DESIGNER: string;
  LANGUAGE: string;
  OBJECTIVE: string;
  TAB: {
    UNIT: string;
    LEARINGOBJECTIVE: string;
    INFORMATION: string;
  };
}

export interface CurricularViewInterface {
  EN: CurricularViewCommon;
  ES: CurricularViewCommon;
}

interface CHECKPOINTSDICTCommon {
  TITLE: string;
  INFO: string;
  FETCH: string;
  BUTTON: {
    ADDEXISTING: string;
    ADDNEW: string;
  };
}

export interface CHECKPOINTSDICTInterface {
  EN: CHECKPOINTSDICTCommon;
  ES: CHECKPOINTSDICTCommon;
}

interface LEARINGOBJECTIVEDICTCommon {
  TITLE: string;
  INFO: string;
  FETCH: string;
  BUTTON: {
    ADD: string;
    EDIT: string;
  };
}

export interface LEARINGOBJECTIVEDICTInterface {
  EN: LEARINGOBJECTIVEDICTCommon;
  ES: LEARINGOBJECTIVEDICTCommon;
}

interface SYLLABUSCommon {
  TITLE: string; // should be 'COURSE UNITS'
  NO: string; // should be 'No.'
  NAME: string; // should be 'Unit Name'
  ACTION: string; // should be 'Actions'
  EDIT: string; // should be 'Edit'
  INFO: string; // should be 'This course does not have any units yet. Please create a new one.'
  FETCH: string; // should be 'Fetching details...'
  ADDNEW: string;
}

export interface SYLLABUSInterface {
  EN: SYLLABUSCommon;
  ES: SYLLABUSCommon;
}

interface addQuestionDictCommon {
  heading: string;
  q: string;
  qlabel: string;
  selecttype: string;
  selectpl: string;
  selectlang: string;
  selectlanpl: string;
  addOption: string;
  otheropt: string;
  nonefabove: string;
  messages: {
    qrequired: string;
    qtyperequired: string;
    qlabelrequired: string;
    qdetailsave: string;
    unabletosave: string;
  };
  Button: {
    save: string;
    cancel: string;
  };
}

export interface addQuestionDictInterface {
  EN: addQuestionDictCommon;
  ES: addQuestionDictCommon;
}

interface MeasurementDictCommon {
  NO: string;
  MEASUREMENT: string;
  ACTION: string;
  EDIT: string;
  INFO: string;
  ADDNEW: string;
  FETCH: string;
}

export interface MeasurementDictInterface {
  EN: MeasurementDictCommon;
  ES: MeasurementDictCommon;
}

interface TOPICLISTDICTCommon {
  TOPIC: string;
  EDIT: string;
  INFO: string;
  ADD: string;
  ADDNEW: string;
  FETCH: string;
}

export interface TOPICLISTDICTInterface {
  EN: TOPICLISTDICTCommon;
  ES: TOPICLISTDICTCommon;
}

interface ADDLEARINGOBJDICTCommon {
  TITLE: string;
  SUBTITLE: string;
  HEADING: string;
  NAME: string;
  DESC: string;
  SAVE: string;
  VALIDATION: string;
}

export interface ADDLEARINGOBJDICTInterface {
  EN: ADDLEARINGOBJDICTCommon;
  ES: ADDLEARINGOBJDICTCommon;
}

interface SelectPreviousQuestionDictCommon {
  heading: string;
  qselectd: string;
  selection: string;
  question: string;
  type: string;
  language: string;
  qempty: string;
  error: string;
  wait: string;
  button: {
    save: string;
    cancel: string;
  };
}

export interface SelectPreviousQuestionDictInterface {
  EN: SelectPreviousQuestionDictCommon;
  ES: SelectPreviousQuestionDictCommon;
}

interface AddMeasurementDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  mlabel: string;
  selecttopic: string;
  topic: string;
  criterialabel: string;
  distinlabel: string;
  excell: string;
  adequate: string;
  basic: string;
  button: {
    save: string;
    cancel: string;
  };
  messages: {
    namerequired: string;
    topicrequired: string;
  };
}

export interface AddMeasurementDictInterface {
  EN: AddMeasurementDictCommon;
  ES: AddMeasurementDictCommon;
}

interface AddProfileCheckpointDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  label: string;
  checkpointlabel: string;
  selectdesigner: string;
  placeholder: string;
  languageselect: string;
  typeSelect: string;
  typePlaceholder: string;
  placeholderlanguage: string;
  checkpointq: string;
  addquestion: string;
  no: string;
  question: string;
  type: string;
  option: string;
  button: {
    existing: string;
    newq: string;
    cancel: string;
    save: string;
    saving: string;
  };
  messages: {
    unsave: string;
    titlerequired: string;
    labelrequired: string;
    minone: string;
    noquestion: string;
  };
}

export interface AddProfileCheckpointDictInterface {
  EN: AddProfileCheckpointDictCommon;
  ES: AddProfileCheckpointDictCommon;
}

interface SyllabusDictCommon {
  TITLE: string;
  LESSON_PLAN: string;
  ADD_NEW_LESSON: string;
  ADD_UNIT: string;
  SELECT_LESSON: string;
  HEADING: string;
  LESSON_PLAN_HEADING: string;
  TABLE_HEADS: {
    NUMBER: string;
    LESSON_NAME: string;
    MEASUREMENTS: string;
    TYPE: string;
    ACTION: string;
  };
  MESSAGES: {
    fetcher: string;
    wantsave: string;
    fetchlist: string;
    fetchdesign: string;
    UPDATE_ERROR: string;
  };
}

export interface SyllabusDictInterface {
  EN: SyllabusDictCommon;
  ES: SyllabusDictCommon;
}

interface AddSyllabusDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  unitname: string;
  designer: string;
  placeholder: string;
  language: string;
  placeholderlanguage: string;
  description: string;
  purpose: string;
  priority: string;
  secondary: string;
  objective: string;
  methodology: string;
  policy: string;
  save: string;
  saving: string;
  messages: {
    fetcherr: string;
    unitupdate: string;
    unablesave: string;
    namerequired: string;
  };
}

export interface AddSyllabusDictInterface {
  EN: AddSyllabusDictCommon;
  ES: AddSyllabusDictCommon;
}

interface AddTopicDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  topicname: string;
  learningobj: string;
  learningobjpl: string;
  description: string;
  button: {
    cancel: string;
    save: string;
  };
  messages: {
    namerequired: string;
    objectiverequired: string;
  };
}
export interface AddTopicDictInterface {
  EN: AddTopicDictCommon;
  ES: AddTopicDictCommon;
}

interface EditLearningObjectiveDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  learningname: string;
  description: string;
  fetching: string;
  button: {
    cancel: string;
    save: string;
  };
  messages: {
    namerequired: string;
  };
}

export interface EditLearningObjectiveDictInterface {
  EN: EditLearningObjectiveDictCommon;
  ES: EditLearningObjectiveDictCommon;
}

interface EditMeasurementDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  labelmeasur: string;
  seltopic: string;
  topic: string;
  criteria: string;
  distinguished: string;
  excell: string;
  adequite: string;
  basic: string;
  fetching: string;
  button: {
    cancel: string;
    save: string;
  };
  messages: {
    namerequierd: string;
    topicrequired: string;
  };
}

export interface EditMeasurementDictInterface {
  EN: EditMeasurementDictCommon;
  ES: EditMeasurementDictCommon;
}

interface EditProfileCheckpointDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  ltitle: string;
  checklabel: string;
  designer: string;
  language: string;
  planguage: string;
  checkpoint: string;
  addquestion: string;
  addexist: string;
  addnew: string;
  no: string;
  question: string;
  type: string;
  option: string;
  noquestion: string;
  save: string;
  saving: string;
  messages: {
    saveerr: string;
    title: string;
    label: string;
    onequetion: string;
    fetcherr: string;
  };
}

export interface EditProfileCheckpointDictInterface {
  EN: EditProfileCheckpointDictCommon;
  ES: EditProfileCheckpointDictCommon;
}

interface EditSyllabusDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  unitname: string;
  designer: string;
  pdesigner: string;
  selectlang: string;
  language: string;
  desc: string;
  purpose: string;
  objective: string;
  methodology: string;
  policy: string;
  lessonplan: string;
  selectlesson: string;
  no: string;
  name: string;
  measurement: string;
  type: string;
  status: string;
  action: string;
  edit: string;
  nolesson: string;
  createnew: string;
  messages: {
    wantsave: string;
    unitupdate: string;
    unableupdate: string;
    namerequired: string;
    updateerr: string;
    fetcher: string;
    fetchlist: string;
    fetchdesign: string;
  };
}

export interface EditSyllabusDictInterface {
  EN: EditSyllabusDictCommon;
  ES: EditSyllabusDictCommon;
}

interface EditTopicDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  topicname: string;
  selectlearning: string;
  learningobjective: string;
  desc: string;
  fetching: string;
  Distinguished: string;
  Excelled: string;
  Adequate: string;
  Basic: string;
  button: {
    cancel: string;
    save: string;
  };
  messages: {
    namerequired: string;
    learningobj: string;
  };
}

export interface EditTopicDictInterface {
  EN: EditTopicDictCommon;
  ES: EditTopicDictCommon;
}

interface ProfileCheckpointlookupDictCommon {
  title: string;
  subtitle: string;
  heading: string;
  selectcheckpoint: string;
  selection: string;
  checkpoint: string;
  language: string;
  listempty: string;
  errfetch: string;
  updating: string;
  fetching: string;
  button: {
    cancel: string;
    save: string;
    saving: string;
  };
}

export interface ProfileCheckpointlookupDictInterface {
  EN: ProfileCheckpointlookupDictCommon;
  ES: ProfileCheckpointlookupDictCommon;
}

interface RegistrationDictCommon {
  title: string;
  subtitle: string;
  requiredfield: string;
  firstname: string;
  firstplaceholder: string;
  lastname: string;
  lastplaceholder: string;
  email: string;
  emailplaceholder: string;
  GROUP_PLACEHOLDER: string;
  role: string;
  roles: {
    sup: string;
    adm: string;
    bld: string;
    flw: string;
    crd: string;
    tr: string;
    st: string;
  };
  class: string;
  status: string;
  statusPlaceholder: string;
  paceLabel: string;
  paceCheckBox: string;
  button: {
    submit: string;
  };
  messages: {
    emailerr: string;
    existemail: string;
    firstname: string;
    lastname: string;
    email: string;
    emailaddress: string;
    userrol: string;
    loading: string;
    institution: string;
    GROUP_NO_OPTION: string;
    GROUP_NO_OPTION_AFTER_FETCH: string;
    ROLE_NO_OPTION: string;
  };
}

export interface RegistrationDictInterface {
  EN: RegistrationDictCommon;
  ES: RegistrationDictCommon;
}

interface UserDictCommon {
  title: string;
}

export interface UserDictInterface {
  EN: UserDictCommon;
  ES: UserDictCommon;
}

interface UserEditDictCommon {
  heading: string;
  firstname: string;
  lastname: string;
  nickname: string;
  status: string;
  inactive_date: string;
  status_reason: string;
  role: string;
  button: {
    save: string;
    cancel: string;
  };
  ondemand: string;
  SUPER_ADMIN: string;
}

export interface UserEditDictInterface {
  EN: UserEditDictCommon;
  ES: UserEditDictCommon;
}

interface UserInformationDictCommon {
  heading: string;
  demographics: string;
  private: string;
  details: string;
  fullname: string;
  nickname: string;
  role: string;
  status: string;
  email: string;
  account: string;
  ondemand: string;
  LOCATION: string;
  SUPER_ADMIN: string;
  RESET_PASSWORD: string;
  DELETE_USER: string;
  CLASSROOM_LOCATION: string;
  RESETTING_PASSWORD: string;
  MESSAGE: {
    RESET_PASSWORD_SUCCESS: string;
    RESET_PASSWORD_FAILURE: string;
  };
}

export interface UserInformationDictInterface {
  EN: UserInformationDictCommon;
  ES: UserInformationDictCommon;
}

interface UserLookupDictCommon {
  title: string;
  subtitle: string;
  sortby: string;
  name: string;
  institution?: string;
  role: string;
  location?: string;
  flow?: string;
  status: string;
  action: string;
  noresult: string;
  button: {
    add: string;
  };
}

export interface UserLookupDictInterface {
  EN: UserLookupDictCommon;
  ES: UserLookupDictCommon;
}

interface AddQuestionModalDictCommon {
  TITLE: string;
  HEADING: string;
  QUESTION: string;
  NOTELABEL: string;
  QUESTIONLABEL: string;
  LANGUAGE: string;
  TYPE: string;
  MAKEQUESTIONREQUIRED: string;
  ADDOPTION: string;
  ADDOTHEROPTION: string;
  ADDNOTEABOVE: string;
  BUTTON: {
    NEXT: string;
    CANCEL: string;
    SAVE: string;
  };
}

export interface AddQuestionModalDictInterface {
  EN: AddQuestionModalDictCommon;
  ES: AddQuestionModalDictCommon;
}

interface EditQuestionModalDictCommon {
  TITLE: string;
  HEADING: string;
  QUESTION: string;
  NOTELABEL: string;
  QUESTIONLABEL: string;
  LANGUAGE: string;
  TYPE: string;
  MAKEQUESTIONREQUIRED: string;
  ADDOPTION: string;
  ADDOTHEROPTION: string;
  ADDNOTEABOVE: string;
  BUTTON: {
    NEXT: string;
    CANCEL: string;
    SAVE: string;
    SAVING: string;
  };
  VALIDATION: {
    TITLE: string;
    LABEL: string;
    ESTIMATE: string;
    ENTERVALIDNUMBER: string;
    MINIMUMONE: string;
  };
  MESSAGES: {
    UNABLESAVE: string;
  };
}

export interface EditQuestionModalDictInterface {
  EN: EditQuestionModalDictCommon;
  ES: EditQuestionModalDictCommon;
}

interface AddNewCheckPointDictCommon {
  BUILDER: string;
  CREATENEW: string;
  TITLE: string;
  CHECKPOINTLABEL: string;
  SUBTITLE: string;
  LANGUAGE: string;
  DESIGNER: string;
  ESTIMATE: string;
  CHECKPOINTQUESTION: string;
  ADDQUESTION: string;
  NO: string;
  QUESTION: string;
  TYPE: string;
  REQUIRED: string;
  OPTION: string;
  NOQUESTION: string;
  BUTTON: {
    ADDEXIST: string;
    CREATE: string;
    CANCEL: string;
    SAVE: string;
    SAVING: string;
  };
  MESSAGES: {
    UNABLESAVE: string;
  };
  VALIDATION: {
    TITLE: string;
    LABEL: string;
    ESTIMATETIME: string;
    VALIDNUMBER: string;
    ONEQUESTION: string;
  };
}

export interface AddNewCheckPointDictInterface {
  EN: AddNewCheckPointDictCommon;
  ES: AddNewCheckPointDictCommon;
}

interface AddNewQuestionDictCommon {
  BUILDER: string;
  CHECKPOINT: string;
  ADDNEWQUESTION: string;
  QUESTION: string;
  QUESTIONLABEL: string;
  SELECTTYPE: string;
  SELECTLANGUAGE: string;
  LANGUAGE: string;
  MAKEQUESTION: string;
  ADDOPTION: string;
  ADDOTHEROPTION: string;
  ADDNONOFABOVE: string;
  BUTTON: {
    CANCEL: string;
    SAVE: string;
    SAVING: string;
  };
  VALIDATION: {
    QUESTION: string;
    TYPE: string;
    LABEL: string;
  };
  MESSAGES: {
    QUESTIONSAVE: string;
    UNABLESAVE: string;
  };
}

export interface AddNewQuestionDictInterface {
  EN: AddNewQuestionDictCommon;
  ES: AddNewQuestionDictCommon;
}

interface CheckpointLookupDictCommon {
  BUILDER: string;
  PREVIOUSCHECKPOINT: string;
  CHEKPOINTSELECTED: string;
  SELECTION: string;
  CHECKPOINTTITLE: string;
  LANGUAGE: string;
  BUTTON: {
    SAVE: string;
    CANCEL: string;
  };
}

export interface CheckpointLookupDictInterface {
  EN: CheckpointLookupDictCommon;
  ES: CheckpointLookupDictCommon;
}

interface CheckpointQueTableDictCommon {
  NO: string;
  QUESTION: string;
  TYPE: string;
  NOQUESTIONCHECKPOINT: string;
  FETCHERR: string;
  FETCHING: string;

  BUTTON: {
    EDIT: string;
    REMOVE: string;
  };
}

export interface CheckpointQueTableDictInterface {
  EN: CheckpointQueTableDictCommon;
  ES: CheckpointQueTableDictCommon;
}

interface EditCheckPointDictCommon {
  BUILDER: string;
  EDITCHECKPOINT: string;
  TITLE: string;
  CHECKPOINTLABEL: string;
  SUBTITLE: string;
  SELECTLANGUAGE: string;
  SELECTDESIGNER: string;
  ESTIMATE: string;
  CHECKPOINTQUE: string;
  ADDQUESTION: string;
  NO: string;
  QUESTION: string;
  TYPE: string;
  REQUIRED: string;
  OPTION: string;
  NOQUESTION: string;
  BUTTON: {
    ADDEXIST: string;
    CREATE: string;
    CANCEL: string;
    SAVE: string;
    SAVING: string;
  };
  VALIDATION: {
    TITLE: string;
    LABEL: string;
    ESTIMATE: string;
    ENTERVALIDNUMBER: string;
    MINIMUMONE: string;
  };
  MESSAGES: {
    UNABLESAVE: string;
  };
}

export interface EditCheckPointDictInterface {
  EN: EditCheckPointDictCommon;
  ES: EditCheckPointDictCommon;
}

interface EditQuestionDictCommon {
  ASSESSMENTBUILDER: string;
  CHECKPOINT: string;
  EDITQUE: string;
  QUESTION: string;
  QUESTIONLABEL: string;
  SELECTTYPE: string;
  SELECTLANGUAGE: string;
  LANGUAGE: string;
  QUEREQUIRED: string;
  ADDOPTION: string;
  OTHEROPT: string;
  NONEOFABOVE: string;
  BUTTON: {
    CANCEL: string;
    SAVING: string;
    SAVE: string;
  };
  VALIDATION: {
    INPUT: string;
    TYPE: string;
    LABEL: string;
  };
  MESSAGES: {
    UNABLESAVE: string;
  };
}

export interface EditQuestionDictInterface {
  EN: EditQuestionDictCommon;
  ES: EditQuestionDictCommon;
}

interface SelectedCheckPointsListDictCommon {
  BUILDER: string;
  ADDCHECKPOINT: string;
  BUTTON: {
    ADDEXIST: string;
    CREATE: string;
  };
}

export interface SelectedCheckPointsListDictInterface {
  EN: SelectedCheckPointsListDictCommon;
  ES: SelectedCheckPointsListDictCommon;
}

interface AddNewLessonFormDictCommon {
  TITLE: string;
  NAME: string;
  SELECTTYPE: string;
  TYPE: string;
  INSTITUTION: string;
  SELECTINSTITUTION: string;
  SELECT_TARGET_AUDIENCE: string;
  SELECTLANG: string;
  TARGET_AUDIENCE: string;
  LANGUAGE: string;
  SELECTDESIGNER: string;
  DESIGNER: string;
  DURATION: string;
  MATERIALS: string;
  PURPOSE: string;
  OBJECTIVE: string;
  REMINDERANDNOTES: string;
  RESOURCES: string;
  NOTES: string;
  SUMMARY: string;
  IMAGE_CAPTION: string;
  MEASUREMENTLESSON: string;
  SELECTMEASURE: string;
  NO: string;
  MEASUREMENT: string;
  TOPIC: string;
  ACTION: string;
  VALIDATION: {
    NAME: string;
    TYPE: string;
    INSTITUTE: string;
    LANGUAGE: string;
    STUDENT_SUMMARY: string;
    IMAGE_CAPTION: string;
  };
  MESSAGES: {
    REMOVE: string;
    ADDERR: string;
    SAVE: string;
    SAVEERR: string;
    UPDATE: string;
    UPDATEERR: string;
    LESSONNOTHAVE: string;
    MEASUREMENTALREADYADDED: string;
    MEASUREMENTADDSUCCESS: string;
    NODESIGNEROPTION: string;
    LOADING: string;
  };
  NEXT: string;
  SAVE: string;
  SAVING: string;
}

export interface AddNewLessonFormDictInterface {
  EN: AddNewLessonFormDictCommon;
  ES: AddNewLessonFormDictCommon;
}

interface AssessmentInstuctionsDictCommon {
  INSTRUCTION: string;
  HEADING: string;
  SAVE: string;
  SAVING: string;
  MESSAGES: {
    INSTRUCTIONSAVE: string;
    UPDATEERR: string;
  };
}

export interface AssessmentInstuctionsDictInterface {
  EN: AssessmentInstuctionsDictCommon;
  ES: AssessmentInstuctionsDictCommon;
}

interface GeneralInformationDict {
  HEADING: string;
  NAME: string;
  SELECTDESIGNER: string;
  DESIGNER: string;
  LANGUAGE: string;
  PURPOSE: string;
  OBJECTIVE: string;
  SELECTTYPE: string;
  TYPE: string;
  INSTITUTION: string;
  SELECTINSTITUTION: string;
  SELECTLANG: string;
  LESSONMEASUREMENT: string;
  SELECTMEASUREMENT: string;
  NO: string;
  MEASUREMENT: string;
  TOPIC: string;
  ACTION: string;
  BUTTON: {
    ADD: string;
    SAVE: string;
    SAVING: string;
  };
  MESSAGES: {
    REMOVE: string;
    DELETEERR: string;
    ADDERR: string;
    NAME: string;
    FETCHERR: string;
    UPDATESUCCESS: string;
    UPDATEERR: string;
    LESSONNOTHAVE: string;
  };
}

export interface GeneralInformationDictInterface {
  EN: GeneralInformationDict;
  ES: GeneralInformationDict;
}

interface PreviousQuestionsDictCommon {
  HEADING: string;
  NO: string;
  QUESTION: string;
  LABEL: string;
  TYPE: string;
  ACTION: string;
  WHERARE: string;
  WHERYOU: string;
  TEXTINPUT: string;
  ADD: string;
}

export interface PreviousQuestionsDictInterface {
  EN: PreviousQuestionsDictCommon;
  ES: PreviousQuestionsDictCommon;
}

interface QuestionBuilderDictCommon {
  HEADING: string;
  NOTE: string;
  NO: string;
  QUESTION: string;
  LABEL: string;
  TYPE: string;
  ACTION: string;
  WHERARE: string;
  WHERYOU: string;
  TEXTINPUT: string;
}

export interface QuestionBuilderDictInterface {
  EN: QuestionBuilderDictCommon;
  ES: QuestionBuilderDictCommon;
}

interface UnitLookupDictCommon {
  HEADING: string;
  NOTE: string;
  NO: string;
  CURRICULUMNAME: string;
  NAME: string;
  INSTITUTION_NAME: string;
  UNITNAME: string;
  LESSONS: string;
  STATUS: string;
  ACTION: string;
  NOTADDED: string;
  NO_UNIT_ADDED: string;
  NEW_UNIT: string;
  UNIT_DETAILS: string;
  VIEW: string;
  INFO: string;
  MESSAGES: {
    ADDED: string;
    ADDERR: string;
    FETCHERR: string;
  };
  NO_DELETE: string;
  SELECT_INSTITUTION: string;
}

export interface UnitLookupDictInterface {
  EN: UnitLookupDictCommon;
  ES: UnitLookupDictCommon;
}

interface LessonBuilderCommon {
  TITLE: string;
  SUBTITLE: string;
  OVEVIEW_TITLE: string;
  OVERVIEW_DESCRIPTION: string;
  ACTIVITY_TITLE: string;
  ACTIVITY_DESCRIPTION: string;
  ACTIVITY_TOOLTIP: string;
  UNIT_MANAGER_TITLE: string;
  UNIT_MANAGER_DESCRIPTION: string;
  UNIT_MANAGER_TOOLTIP: string;
  LEARNING_EVIDENCE_TITLE: string;
  LEARNING_EVIDENCE_DESCRIPTION: string;
  LEARNING_EVIDENCE_TOOLTIP: string;
  BUTTON: {
    ADD_PLAN: string;
    EDIT: string;
    VIEW: string;
    PREVIEW: string;
    SAVE: string;
    ADD_ROW: string;
    DELETE: string;
    ADD_EVIDENCE: string;
  };
  LESSON_PLAN_COLUMN: {
    ID: string;
    PAGE_TITLE: string;
    PLAN_LABEL: string;
    DESCRIPTION: string;
    TAGS: string;
    ESTIMATED_TIME: string;
    ACTIVITY_TYPE: string;
    INTERACTION_TYPE: string;
    ACTIVITY_INSTRUCTIONS: string;
    ACTION: string;
    BUTTON: string;
  };
  LESSON_CLASSROOM_ACTIVITY_TABLE: {
    ACTIVITY_LABEL: string;
    ACTIVITY_NAME: string;
    INTERACTION_TYPE: string;
    INSTRUCTION: string;
    ESTIMATED_TIME: string;
    ACTION: string;
    ADD_NEW_ACTIVITY: string;
    HEADING: string;
  };
  LESSON_HOMEWORK_ACTIVITY_TABLE: {
    ACTIVITY_LABEL: string;
    ACTIVITY_NAME: string;
    INSTRUCTION: string;
    ESTIMATED_TIME: string;
    ACTION: string;
    ADD_NEW_ACTIVITY: string;
    HEADING: string;
  };
  LESSON_COURSES_UNIT_DETAIL_VIEW: {
    INSTITUTION: string;
    CLASSROOM: string;
    LEAD_INSTRUCTOR: string;
  };
  LEARNING_EVIDENCE_COLUMNS: {
    LEARNING_OBJECTIVE: string;
    TOPICS: string;
    MEASUREMENTS: string;
    EVIDENCE_ACTIVITY: string;
    EVIDENCE_PLACE: string;
    ACTION: string;
    MEASURED: string;
    ADD_EVIDENCE: {
      OBJECTIVE: string;
      TOPICS: string;
      MEASUREMENTS: string;
      ACTIVITY: string;
    };
  };
  LESSON_PLAN_FORM: {
    DESCRIPTION: string;
    ESTIMATED_TIME: string;
    HEADING: string;
    ID: string;
    LABEL: string;
    TITLE: string;
  };
  MESSAGES: {
    UNSAVE: string;
    PUBLISH_DISABLED_INFO: string;
  };
  INFORMATION_HEADING: string;
  NAME: string;
  OWNER: string;
  DESCRIPTION: string;
  DESIGNER: string;
  DURATION: string;
  LANGUAGE: string;
  LESSON_PLAN_LABEL: string;
  OBJECTIVE: string;
  PURPOSE: string;
  RESOURCES: string;
  NOTES: string;
  SUMMARY: string;
}

export interface LessonBuilderDictInterface {
  EN: LessonBuilderCommon;
  ES: LessonBuilderCommon;
}

interface LessonEditDictCommon {
  TITLE: string;
  SUBTITLE: string;
  MESSAGES: {
    UNSAVE: string;
  };
}

export interface LessonEditDictInterface {
  EN: LessonEditDictCommon;
  ES: LessonEditDictCommon;
}

interface LessonsListDictCommon {
  TITLE: string;
  HEADING: string;
  SUBTITLE: string;
  SORTBY: string;
  NO: string;
  LESSONTITLE: string;
  INSTITUTION_NAME: string;
  SELECT_INSTITUTION: string;
  TARGET_AUDIENCE: string;
  TYPE: string;
  LANGUAGE: string;
  ACTION: string;
  NORESULT: string;
  BUTTON: {
    ADD: string;
    START_CLONING: string;
    CLONING: string;
  };
  NO_DELETE: string;
}

export interface LessonsListDictInterface {
  EN: LessonsListDictCommon;
  ES: LessonsListDictCommon;
}
interface UniversalBuilderDictCommon {
  FETCHING: string;
  GALLERY: {
    LESSON_PAGES: string;
  };
  TEMPLATES: {
    TITLE: string;
  };
  FORMS: {
    FILE_UPLOAD_TEXT: string;
    VIDEO_URL_LABEL: string;
    VIDEO_SIZE_LABEL: string;
    VIDEO_SIZE_PLACEHOLDER: string;
  };
  FORMS_ERROR_MSG: {
    IMAGE_REQUIRED: string;
    IMAGE_WIDTH: string;
    IMAGE_HEIGHT: string;
    VIDEO_REQUIRED: string;
    VIDEO_INVALID: string;
  };
}

export interface UniversalBuilderDictInterface {
  EN: UniversalBuilderDictCommon;
  ES: UniversalBuilderDictCommon;
}

interface CsvDictCommon {
  TITLE: string;
  SELECT_INST: string;
  SELECT_CLASSROOM: string;
  SELECT_FILTERS: string;
  SELECT_REASON: string;
  REASON: string;
  UPLOAD_MULTIPLE_SURVEY_IMAGES: string;
  DESCRIBE_REASON: string;
}

export interface CsvDictInterface {
  EN: CsvDictCommon;
  ES: CsvDictCommon;
}

interface DashboardDictCommon {
  YOUR_TEACHERS: string;
  YOUR_CLASSROOMS: string;
  YOUR_STUDENTS: string;
  YOUR_CLASSMATES: string;
  GREETINGS_TEACHER: string;
  GREETINGS_STUDENT: string;
}

export interface DashboardDictInterface {
  EN: DashboardDictCommon;
  ES: DashboardDictCommon;
}

interface LearningEvidenceDictCommon {
  TITLE: string;
}

export interface LearningEvidenceDictInterface {
  EN: LearningEvidenceDictCommon;
  ES: LearningEvidenceDictCommon;
}

interface CommonlyUsedDictCommon {
  BACK: string;
  BACK_TO_LIST: string;
  NO_SEARCH_RESULT: string;
}

export interface CommonlyUsedDictInterface {
  EN: CommonlyUsedDictCommon;
  ES: CommonlyUsedDictCommon;
}

interface GeneralCommon {
  SENTIMENT: {
    TITLE: string;
    MODAL_TITLE: string;
    NO_DATA: string;
    EMOJIS: {
      AWFUL: string;
      BAD: string;
      OKAY: string;
      GOOD: string;
      GREAT: string;
    };
  };
}

export interface GeneralInterface {
  EN: GeneralCommon;
  ES: GeneralCommon;
}

interface StudentDictCommon {
  NO_STUDENT: string;
}

export interface StudentDictInterface {
  EN: StudentDictCommon;
  ES: StudentDictCommon;
}

interface CommunityDictCommon {
  TITLE: string;
  HEADER: string;
  TABS: {
    FRONT_PAGE: string;
    COMMUNITY_BUILDER: string;
  };
}

export interface CommunityDictInterface {
  EN: CommunityDictCommon;
  ES: CommunityDictCommon;
}

interface QuestionLookupDictCommon {
  BUILDER: string;
  CHECKPOINT: string;
  PREVQUE: string;
  QUESELECT: string;
  SELECTION: string;
  QUESTION: string;
  TYPE: string;
  LANGUAGE: string;
  QUEEMPTY: string;
  FETCHERR: string;
  FETCHING: string;
  BUTTON: {
    CANCEL: string;
    SAVE: string;
  };
}

export interface QuestionLookupDictInterface {
  EN: QuestionLookupDictCommon;
  ES: QuestionLookupDictCommon;
}
