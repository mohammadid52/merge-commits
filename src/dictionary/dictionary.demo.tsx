const BUTTONS: any = {
  EN: {
    ADD: 'Add',
    ADD_NEW: 'Add New',
    EDIT: 'Edit',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    PUBLISH: 'Publish',
    YES: 'Yes',
  },
  ES: {
    ADD: 'Añadir',
    ADD_NEW: 'Añadir nuevo',
    EDIT: 'Edit',
    SAVE: 'Salvar',
    CANCEL: 'Cancelar',
    PUBLISH: 'TBD',
    YES: 'TBD',
  },
};

const EditQuestionModalDict: any = {
  EN: {
    TITLE: 'Edit QUESTION',
    HEADING: '*Click here to add Question, directly from previously created questions.',
    QUESTION: 'Question',
    NOTELABEL: 'Notes',
    QUESTIONLABEL: 'Question Label',
    LANGUAGE: 'Language',
    TYPE: 'Type',
    MAKEQUESTIONREQUIRED: 'Make this question required',
    ADDOPTION: 'Add Options:',
    ADDOTHEROPTION: 'Add an "Other" Answer Option or Comment Field',
    ADDNOTEABOVE: 'Add a "None of the above" Answer Option',
    BUTTON: {
      NEXT: 'Next Question',
      CANCEL: 'Cancel',
      SAVE: 'Save',
      SAVING: 'Saving',
    },
    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATE: 'Checkpoint estimated time is required',
      ENTERVALIDNUMBER: 'Please enter valid number i.e. 30.',
      MINIMUMONE: 'You need to add minimum one question to create a checkpoint.',
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.',
    },
  },
  ES: {
    TITLE: 'TBD',
    HEADING: 'TBD',
    QUESTION: 'TBD',
    NOTELABEL: 'TBD',
    QUESTIONLABEL: 'TBD',
    LANGUAGE: 'TBD',
    TYPE: 'TBD',
    MAKEQUESTIONREQUIRED: 'TBD',
    ADDOPTION: 'TBD',
    ADDOTHEROPTION: 'TBD',
    ADDNOTEABOVE: 'TBD',
    BUTTON: {
      NEXT: 'TBD',
      CANCEL: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD',
    },
    VALIDATION: {
      TITLE: 'TBD',
      LABEL: 'TBD',
      ESTIMATE: 'TBD',
      ENTERVALIDNUMBER: 'TBD',
      MINIMUMONE: 'TBD',
    },
    MESSAGES: {
      UNABLESAVE: 'TBD',
    },
  },
};

// Breadcrumbs
const BreadcrumsTitles: any = {
  EN: {
    HOME: 'HOME',
    PROFILE: 'PROFILE',
    PEOPLE: 'PEOPLE',
    INSTITUTION_MANAGEMENT: 'Institution Management',
    ADD_INSTITUTION: 'Add New Institute',
    INSTITUTION_INFO: 'Institute Info',
    Class_Creation: 'Class Creation',
    CURRICULARBUILDER: 'New Curriculum',
    CLASSROOM_CREATION: 'Classroom Creation',
    EDITCLASS: 'Edit Class',
    EDITCURRICULUM: 'Edit Curriculm',
    EDITCLASSROOM: 'Edit Classroom',
    CURRICULUMBUILDER: 'Curriculum Builder',
    LEARINGOBJECTIVE: 'Add Learning objective',
    AddMesurement: 'Add Measurement',
    AddCheckpint: 'Add Checkpoint',
    UnitBuilder: 'Unit Builder',
    AddTopic: 'Add Topic',
    EditLearningObj: 'Edit Learning objective',
    EditMeasurement: 'Edit Measurement',
    AddChekpoint: 'Add Checkpoint',
    EditTopic: 'Edit Topic',
    AddExistingCheckpoint: 'Add Existing Checkpoint',
    PeopleManagment: 'People Management',
    AddNewUser: 'Add New User',
    UserInfo: 'User Information',
    LESSONS: 'Lessons',
    LESSONPLANBUILDER: 'Lesson Plan Builder',
    STUDENTS: 'Students',
    STUDENTS_NOTEBOOK: 'Students Notebook',
  },
  ES: {
    HOME: 'CASA',
    PROFILE: 'PERFIL',
    PEOPLE: 'PERSONAS',
    INSTITUTION_MANAGEMENT: 'TBD',
    ADD_INSTITUTION: 'TBD',
    INSTITUTION_INFO: 'TBD',
    Class_Creation: 'TBD',
    CURRICULARBUILDER: 'TBD',
    CLASSROOM_CREATION: 'TBD',
    EDITCLASS: 'TBD',
    EDITCURRICULUM: 'TBD',
    EDITCLASSROOM: 'TBD',
    CURRICULUMBUILDER: 'TBD',
    LEARINGOBJECTIVE: 'TBD',
    AddMesurement: 'TBD',
    AddCheckpint: 'TBD',
    UnitBuilder: 'TBD',
    AddTopic: 'TBD',
    EditLearningObj: 'TBD',
    EditMeasurement: 'TBD',
    AddChekpoint: 'TBD',
    EditTopic: 'TBD',
    AddExistingCheckpoint: 'TBD',
    PeopleManagment: 'TBD',
    AddNewUser: 'TBD',
    UserInfo: 'TBD',
    LESSONS: 'TBD',
    LESSONPLANBUILDER: 'TBD',
    STUDENTS: 'Students',
    STUDENTS_NOTEBOOK: 'Students Notebook',
  },
};
// Profile Display and edit section
const dashboardProfileDict: any = {
  EN: {
    PROFILE: 'Profile',
    TITLE: 'USER PROFILE',
    PROFILE_INSTRUCTON: 'Click the circle above to update profile picture.',
    SUBTITLE: 'This contains your profile information.',
    PERSONAL_INFO: {
      TITLE: 'Personal Information',
      FULL_NAME: 'Full Name',
      FIRST_NAME: 'First Name',
      LAST_NAME: 'Last Name',
      NICKNAME: 'Nickname',
      BIRTHDAY: 'Birthday',
      LANGUAGE: 'Language',
      EMAIL: 'Email address',
      CONTACT: 'Contact Number',
      ROLE: 'Role',
    },
    INSTITUTION_INFO: {
      TITLE: 'Institution Information',
      INSTITUTION: 'Institution',
      GRADE: 'Grade',
    },
    EDIT_PROFILE: {
      TITLE: 'Edit Personal Information',
      FIRST_NAME: 'First Name',
      BIRTHDAY: 'Birthday',
      LAST_NAME: 'Last Name',
      NICKNAME: 'Nickname',
      LANGUAGE: 'Language Preference',
      CONTACT: 'Contact Number',
      SAVE: 'Save',
      CANCEL: 'Cancel',
    },
    CHANGE_PASSWORD: {
      TITLE: 'Change your Password',
      INFO: 'Password must be at least 8 characters and include uppercase and lowercase',
      OLD_PASS: 'Old Password',
      NEW_PASS: 'New Password',
      CONFIRM_PASS: 'Confirm Password',
      FORGOT_PASS_LINK: `Can't remember your old password?`,
      SAVE: 'Save New Password',
      CANCEL: 'Cancel',
      SUCCESS_MSG: 'Success',
      WARN_MSG:
        'This will log you out and take you to the reset password page, do you want to continue?',
      CONTINUE_BTN: 'Continue',
      ERRORS: {
        NO_OLD_PASS: 'Please enter your old password',
        NO_NEW_PASS: 'Please enter your new password',
        NO_CONFIRM_PASS: 'Please enter your confirmation password',
        NOT_MATCH: 'Your new password and confirm password do not match',
      },
    },
  },
  ES: {
    PROFILE: 'Perfil',
    TITLE: 'PERFIL DEL USUARIO',
    PROFILE_INSTRUCTON:
      'Haga clic en el círculo de arriba para actualizar la imagen de perfil.',
    SUBTITLE: 'Esto contiene la información de su perfil.',
    PERSONAL_INFO: {
      TITLE: 'Informacion personal',
      FULL_NAME: 'nombre completo',
      FIRST_NAME: 'Nombre de pila',
      LAST_NAME: 'Apellido',
      NICKNAME: 'apodo',
      BIRTHDAY: 'Cumpleaños',
      LANGUAGE: 'Idioma',
      EMAIL: 'dirección de correo electrónico',
      CONTACT: 'número de contacto',
      ROLE: 'Papel',
    },
    INSTITUTION_INFO: {
      TITLE: 'Información institucional',
      INSTITUTION: 'Institución',
      GRADE: 'Grado',
    },
    EDIT_PROFILE: {
      TITLE: 'Editar información personal',
      FIRST_NAME: 'Primer nombre',
      LAST_NAME: 'Apellido',
      BIRTHDAY: 'Cumpleaños',
      NICKNAME: 'apodo',
      LANGUAGE: 'preferencia de idioma',
      CONTACT: 'número de contacto',
      SAVE: 'Salvar',
      CANCEL: 'Cancelar',
    },
    CHANGE_PASSWORD: {
      TITLE: 'Cambia tu contraseña',
      INFO:
        'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas y minúsculas',
      OLD_PASS: 'Contraseña anterior',
      NEW_PASS: 'Nueva contraseña',
      CONFIRM_PASS: 'Confirmar contraseña',
      FORGOT_PASS_LINK: `No recuerdo su contraseña anterior?`,
      SAVE: 'Guardar nueva contraseña',
      CANCEL: 'Cancelar',
      SUCCESS_MSG: 'Éxito',
      WARN_MSG: 'TBD',
      CONTINUE_BTN: 'TBD',
      ERRORS: {
        NO_OLD_PASS: 'Ingrese su contraseña anterior',
        NO_NEW_PASS: 'Ingrese su nueva contraseña',
        NO_CONFIRM_PASS: 'Ingrese su contraseña de confirmación',
        NOT_MATCH: 'Su nueva contraseña y la contraseña de confirmación no coinciden',
      },
    },
  },
};

const anthologyDict: any = {
  EN: {
    TITLE: 'Notebook',
    TABS: {
      A: 'Journal',
      B: 'Class Work',
      C: 'Class Notes',
    },
    ACTIONS: {
      EDIT: 'Edit',
      SAVE: 'Save',
      CREATE: 'New Entry',
      ADD: 'Add More',
      CANCEL: 'Cancel',
      DELETE: 'Delete',
    },
  },
  ES: {
    TITLE: 'Cuaderno',
    TABS: {
      A: 'Diario',
      B: 'Class Work',
      C: 'Class Notes',
    },
    ACTIONS: {
      EDIT: 'Editar',
      SAVE: 'Salvar',
      CREATE: 'Crear',
      ADD: 'Añadir más',
      CANCEL: 'Cancelar',
      DELETE: 'Deletar',
    },
  },
};

// People - User management list
const manageusersDict: any = {
  EN: {
    TITLE: 'USER MANAGEMENT',
    SUBTITLE: "People's List",
    TABLE: {
      NAME: 'Name',
      ROLE: 'Role',
      INST: 'Institution',
      STATUS: 'Status',
      ACTIONS: 'Actions',
    },
    ADD_NEW: 'Add New Person',
  },
  ES: {
    TITLE: 'GESTIÓN DE USUARIOS',
    SUBTITLE: 'Lista de personas',
    TABLE: {
      NAME: 'Nombre',
      ROLE: 'Papel',
      INST: 'Institución',
      STATUS: 'Estado',
      ACTIONS: 'Comportamiento',
    },
    ADD_NEW: 'Agregar persona',
  },
};

// sidebar links
const sideBarLinksDict: any = {
  EN: {
    REGISTRATION: 'Registration',
    INSTITUTIONS: 'Institutions',
    PEOPLE: 'People',
    LESSON_PLANNER: 'Homeroom',
    CLASSROOM: 'Classroom',
    LESSON_BUILDER: 'Lesson Builder',
    ANTHOLOGY: 'Notebook',
    NOTICEBOARD: 'Noticeboard',
    DASHBOARD: 'Dashboard',
    RESEARCHANALYTICS: 'Research & Analytics',
  },
  ES: {
    REGISTRATION: 'Registro',
    INSTITUTIONS: 'Institución',
    PEOPLE: 'Personas',
    LESSON_PLANNER: 'Pasillo',
    CLASSROOM: 'Aula',
    LESSON_BUILDER: 'Constructor de lecciones',
    ANTHOLOGY: 'Cuaderno',
    NOTICEBOARD: 'Tablón de anuncios',
    RESEARCHANALYTICS: 'TBD',
  },
};

const appDict: any = {
  EN: {
    LOG_OUT: 'Log Out',
    LOADING: 'Give us one second, this section is loading...',
  },
  ES: {
    LOG_OUT: 'Cerrar sesión',
    LOADING: 'esta sección se está cargando...',
  },
};

const staffBuilderDict: any = {
  EN: {
    TITLE: 'STAFF MEMBERS',
    ADD_PLACEHOLDER: 'Add new',
    ADD_BUTTON: 'ADD',
    NO: 'No.',
    NAME: 'Name',
    ROLE: 'Role',
    STATUS: 'Status',
    ACTION: 'Action',
    UPDATING: 'updating...',
    CANCEL: 'Cancel',
    INFO: 'This institute does not have any staff member. Please add new member.',
    LOADING: 'Loading...',
    STATUS_PLACEHOLDER: 'Select Status',
    EDIT: 'Edit',
  },
  ES: {
    TITLE: 'MIEMBROS DEL PERSONAL',
    ADD_PLACEHOLDER: 'Añadir nuevo',
    ADD_BUTTON: 'Añadir',
    NO: 'TBD',
    NAME: 'TBD',
    ROLE: 'TBD',
    STATUS: 'TBD',
    ACTION: 'TBD',
    UPDATING: 'TBD',
    CANCEL: 'TBD',
    INFO: 'TBD',
    LOADING: 'TBD',
    STATUS_PLACEHOLDER: 'TBD',
    EDIT: 'TBD',
  },
};

const spBuilderDict: any = {
  EN: {
    TITLE: 'SERVICE PROVIDERS',
    ADD_PLACEHOLDER: 'Add a new service provider',
    ADD_BUTTON: 'ADD',
    NO: 'NO.',
    SERVICE: 'Service Providers',
    STATUS: 'Status',
    ACTION: 'Actions',
    UPDATING: 'updating...',
    CANCEL: 'Cancel',
    INFO:
      'This institute does not have any service provider. Please add new service provider.',
  },
  ES: {
    TITLE: 'PROVEEDORES DE SERVICIO',
    ADD_PLACEHOLDER: 'Agregar un nuevo proveedor de servicios',
    ADD_BUTTON: 'Añadir',
    NO: 'TBD',
    SERVICE: 'TBD',
    STATUS: 'TBD',
    ACTION: 'TBD',
    UPDATING: 'TBD',
    CANCEL: 'TBD',
    INFO: 'TBD',
  },
};

const editClassDict: any = {
  EN: {
    TITLE: 'EDIT CLASS',
    SUBTITLE: 'Edit class information',
    NAME_INPUT_LABEL: 'Class Name',
    STUDENTS: 'STUDENTS',
    ADD_STUDENT_PLACEHOLDER: 'Select student',
    ADD_STUDENT_BUTTON: 'Add',
    UPDATING: 'updating...',
    CANCEL: 'Cancel',
    NOSTUDENT: 'No students added in the class.',
    LOADING: 'Loading class students list...',
    EDIT: 'Edit',
    heading: 'CLASS INFORMATION',
    heading2: 'STUDENTS',
    messages: {
      errorfetch: 'Error while fetching class data,please try again later.',
      errorstudentadd: 'Error while adding stuent, please try again later',
      processerror: 'Error while processing please Try again later.',
      classrequired: 'Class name is required please enter.',
      selectinstitute: 'Please select an institute to add class.',
      classexist: 'This class name is already exist, please add another name.',
      classupdate: 'Class details has been updated.',
      unableupdate: 'Unable to update class details. Please try again later.',
    },
    TABLE: {
      SNO: 'No.',
      NAME: 'Participant Name',
      STATUS: 'Status',
      ACTIONS: 'Actions',
    },
  },
  ES: {
    TITLE: 'EDITAR CLASE',
    SUBTITLE: 'Editar la información de la clase',
    NAME_INPUT_LABEL: 'Nombre de la clase',
    STUDENTS: 'ALUMNAS',
    ADD_STUDENT_PLACEHOLDER: 'Agregar nuevo alumno',
    ADD_STUDENT_BUTTON: 'Añadir',
    UPDATING: 'TBD',
    CANCEL: 'TBD',
    NOSTUDENT: 'TBD',
    LOADING: 'TBD',
    EDIT: 'TBD',
    heading: 'TBD',
    heading2: 'TBD',
    messages: {
      errorfetch: 'TBD',
      errorstudentadd: 'TBD',
      processerror: 'TBD',
      classrequired: 'TBD',
      selectinstitute: 'TBD',
      classexist: 'TBD',
      classupdate: 'TBD',
      unableupdate: 'TBD',
    },
    TABLE: {
      SNO: 'No.',
      NAME: 'nombre del estudiante',
      STATUS: 'estado',
      ACTIONS: 'comportamiento',
    },
  },
};
const lessonDict: any = {
  EN: {
    CLASS: 'Class',
    TOPIC_CONNECTION: 'SEL Connection',
    KEYWORDS: 'Keywords',
    REFLECTION_QUESTIONS: 'Class Discussion',
  },
  ES: {
    CLASS: 'Class',
    TOPIC_CONNECTION: 'SEL Connection',
    KEYWORDS: 'Keywords',
    REFLECTION_QUESTIONS: 'Class Discussion',
  },
};

const noticeboardDict: any = {
  EN: {
    JOIN_CALL: {
      DEFAULT: 'Join Call',
      ZOOM: 'Join Zoom Call',
      MEET: 'Join Meet Call',
      TEAMS: 'Join Teams Call',
    },
    DOWNLOAD: 'Download',
    SECTION_TITLE: {
      ROOM_SELECTOR: 'Room Selector',
      WIDGET_MANAGER: 'Widget Manager',
    },
    ROOMS: {
      NONE: 'No rooms found',
    },
    FORM: {
      WIDGET_STATUS: 'Widget Status',
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
      PLACEMENT: 'Placement',
      CONTENT: 'Content',
      IN_SIDEBAR: 'In the sidebar',
      ABOVE_LESSONS: 'Above the lessons',
      PLEASE_ADD_TITLE: 'Please add title',
      TITLE: 'Title',
      TYPE: 'Type',
      PLEASE_ADD: 'Please add',
    },
    WIDGET_DESCRIPTION: {
      TEXT:
        'This is the default text widget. Use this if you want to show a text message/notice to students in your room.',
      QUOTES:
        'Add multiple quotes above the lessons or to the side widget bar to inspire your students.',
      CALL:
        "This is a basic widget to post the zoom/meet/teams links you'll use to communicate with your students.",
      FILE:
        'This is a basic widget to share your drive/onedrive/dropbox files for student assignments etc.',
    },
  },
  ES: {
    JOIN_CALL: {
      DEFAULT: 'Unirse a la llamada',
      ZOOM: 'Unirse a la llamada Zoom',
      MEET: 'Unirse a la llamada Meet',
      TEAMS: 'Unirse a la llamada Teams',
    },
    DOWNLOAD: 'Descargar',
    SECTION_TITLE: {
      ROOM_SELECTOR: 'Selector de Habitación',
      WIDGET_MANAGER: 'Administrador de Widgets',
    },
    ROOMS: {
      NONE: 'No se encontraron habitaciones',
    },
    FORM: {
      WIDGET_STATUS: 'Estado del Widgeto',
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      PLACEMENT: 'Colocación',
      CONTENT: 'El Contenido',
      IN_SIDEBAR: 'En el sidebar',
      ABOVE_LESSONS: 'Sobre el Lessons',
      PLEASE_ADD_TITLE: 'Por favor agregue un título',
      TITLE: 'Título',
      TYPE: 'Type',
      PLEASE_ADD: 'Por favor añadir',
    },
    WIDGET_DESCRIPTION: {
      TEXT:
        'Este es el widget de texto predeterminado. Use esto si desea mostrar un mensaje de texto / aviso a los estudiantes en su habitación.',
      QUOTES:
        'Agregue varias citas sobre las lecciones o en la barra de widgets lateral para inspirar a sus estudiantes.',
      CALL:
        'Este es un widget básico para publicar los enlaces zoom / meet / teams que usará para comunicarse con sus estudiantes.',
      FILE:
        'Este es un widget básico para compartir sus archivos de drive / onedrive / dropbox para tareas de estudiantes, etc..',
    },
  },
};

const classRoomDict: any = {
  EN: {
    TITLE: 'Classroom',
    LIST_TITLE: 'Classrooms',
    LESSON: 'Lesson',
    LIST_LESSON: 'Lessons',
    ASSESSMENT: 'Assessment',
    SURVEY: 'Survey',
    LESSON_PLANNER: 'Lesson Planner',
    ASSESSMENT_TITLE: 'Surveys & Assessments',
    UNIT_TITLE: 'Unit Manager',
    BOTTOM_BAR: {
      START: 'START',
      DISABLE: 'DISABLE',
      ENABLE: 'ENABLE',
      TEACH: 'TEACH',
    },
    LESSON_TABS: {
      TAB_ONE: `Today's Lesson`,
      TAB_TWO: 'Teach Lessons',
    },
    MESSAGES: {
      SELECT_SYLLABUS: 'Select a cohort to see applicable units...',
      NO_SYLLABUS: 'No units...',
      SELECT_CLASSROOM: 'Select a classroom to see applicable lessons...',
      NO_LESSONS: 'No lessons...',
      SELECT_CLASSROOM_WIDGETS: 'Select a room to see editable widgets...',
    },
  },
  ES: {
    TITLE: 'TBD',
    LIST_TITLE: 'TBD',
    LESSON: 'TBD',
    LIST_LESSON: 'TBD',
    ASSESSMENT: 'TBD',
    SURVEY: 'TBD',
    LESSON_PLANNER: 'TBD',
    ASSESSMENT_TITLE: 'TBD',
    UNIT_TITLE: 'TBD',
    BOTTOM_BAR: {
      START: 'TBD',
      DISABLE: 'TBD',
      ENABLE: 'TBD',
      TEACH: 'TBD',
    },
    LESSON_TABS: {
      TAB_ONE: `TBD`,
      TAB_TWO: 'TBD',
    },
    MESSAGES: {
      SELECT_SYLLABUS: 'Select a cohort to see applicable units...',
      NO_SYLLABUS: 'No units...',
      SELECT_CLASSROOM: 'Select a classroom to see applicable lessons...',
      NO_LESSONS: 'No lessons...',
      SELECT_CLASSROOM_WIDGETS: 'Select a room to see editable widgets...',
    },
  },
};

const lessonPlannerDict: any = {
  EN: {
    INTRO: 'Intro',
    WARM_UP: 'Warm Up',
    CORE_LESSON: 'Core Lesson',
    ACTIVITY: 'Activity',
    CHECKPOINT: 'Checkpoint',
    OUTRO: 'Outro',
    BREAKDOWN: 'Breakdown',
    NA: 'n/a',
    WARMUP_BREAKDOWN: 'WarmUp/Breakdown',
    CORELESSON_BREAKDOWN: 'CoreLesson/Breakdown',
    ACTIVITY_BREAKDOWN: 'Activity/Breakdown',
    OTHER_LABELS: {
      STUDDENT_ONLINE: 'Students Online',
      TOPIC: 'Topic',
      START_DATE: 'Start Date',
      EST_TIME: 'Estimated Time',
      LESSON_CONTROL: 'Lesson Control',
      COLUMN: {
        ONE: 'Student Name',
        TWO: 'Current Page',
        THREE: 'Action',
      },
      STUDENT_SECTION: {
        IN_CLASS: 'In Class',
        NOT_IN_CLASS: 'Not In Class',
      },
    },
    ACCESS_BUTTONS: {
      START: 'Start',
      COMPLETE: 'Complete',
    },
  },
  ES: {
    INTRO: 'TBD ',
    WARM_UP: 'TBD',
    CORE_LESSON: 'TBD',
    ACTIVITY: 'TBD',
    CHECKPOINT: 'TBD',
    OUTRO: 'TBD ',
    BREAKDOWN: 'TBD',
    NA: 'TBD',
    WARMUP_BREAKDOWN: 'TBD',
    CORELESSON_BREAKDOWN: 'TBD',
    ACTIVITY_BREAKDOWN: 'TBD',
    OTHER_LABELS: {
      STUDDENT_ONLINE: 'TBD',
      TOPIC: 'TBD',
      START_DATE: 'TBD',
      EST_TIME: 'TBD',
      LESSON_CONTROL: 'TBD',
      COLUMN: {
        ONE: 'TBD',
        TWO: 'TBD',
        THREE: 'TBD',
      },
      STUDENT_SECTION: {
        IN_CLASS: 'TBD',
        NOT_IN_CLASS: 'TBD',
      },
    },
    ACCESS_BUTTONS: {
      START: 'TBD',
      COMPLETE: 'TBD',
    },
  },
};

const PreviewFormDict: any = {
  EN: {
    FETCHING: 'Fetching Lesson checkpoints please wait...',
    PURPOSE: 'Purpose',
    OBJECTIVE: 'Objective',
    CHECKPOINT: 'Checkpoints',
    NOCHECKPOINT: 'No Checkpoint added.',

    MESSAGES: {
      UPDATESUCCESS: 'Successfully updated lesson plans in all units.',
      UPDATEERR:
        'Error while updating lesson plans for units, please try again after some time.',
      CONNECTERR: 'This lesson is not connected to any units.',
      FETCHERR: 'Error while fetching units for this lesson.Please try after some time.',
    },
    PREVIEW_DETAILS: {
      WARN_MESSAGE:
        'Changes will applay to all assigned lesson plans. Do you want to continue?',
      TITLE: 'Preview Details',
    },
  },
  ES: {
    FETCHING: 'TBD',
    PURPOSE: 'TBD',
    OBJECTIVE: 'TBD',
    CHECKPOINT: 'TBD',
    NOCHECKPOINT: 'TBD',

    MESSAGES: {
      UPDATESUCCESS: 'TBD',
      UPDATEERR: 'TBD',
      CONNECTERR: 'TBD',
      FETCHERR: 'TBD',
    },
    PREVIEW_DETAILS: {
      WARN_MESSAGE: 'TBD',
      TITLE: 'TBD',
    },
  },
};

const InstitutionDict: any = {
  EN: {
    TITLE: 'INSTITUTIONS MANAGEMENT',
    SUBTITLE: 'Institutions List',
    TABLE: {
      NAME: 'Institute Name',
      TYPE: 'Type',
      WEBSITE: 'Website',
      CONTACT: 'Contact No.',
      ACTION: 'Actions',
      NORESULT: 'No Results',
    },
    SHOWPAGE: 'Showing Page',
    OF: 'of',
    PAGES: 'pages',
    SORTBY: 'Sort By',

    BUTTON: {
      Add: 'Add New Institution',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    TABLE: {
      NAME: 'TBD',
      TYPE: 'TBD',
      WEBSITE: 'TBD',
      CONTACT: 'TBD',
      ACTION: 'TBD',
      NORESULT: 'TBD',
    },
    SHOWPAGE: 'TBD',
    OF: 'TBD',
    PAGES: 'TBD',
    SORTBY: 'TBD',
    BUTTON: {
      Add: 'TBD',
    },
  },
};
const Institute_info: any = {
  EN: {
    TITLE: 'General Information',
    ADDRESS: 'Address',
    CONTACT: 'Contact No',
    INSTITUTION_TYPE: 'Institution Type',
    WEBSITE: 'Website',
    SERVICE_PROVIDER: 'Service Provider',
    TABS: {
      SERVICE_PROVIDER: 'Service Providers',
      STAFF: 'Staff',
      CLASSES: 'Classes',
      CURRICULAR: 'Curricular',
      CLASSROOMS: 'Classrooms',
    },
  },
  ES: {
    TITLE: 'TBD',
    ADDRESS: 'TBD',
    CONTACT: 'TBD',
    INSTITUTION_TYPE: 'TBD',
    WEBSITE: 'TBD',
    SERVICE_PROVIDER: 'TBD',
    TABS: {
      SERVICE_PROVIDER: 'TBD',
      STAFF: 'TBD',
      CLASSES: 'TBD',
      CURRICULAR: 'TBD',
      CLASSROOMS: 'TBD',
    },
  },
};

const InstitutionEditDict: any = {
  EN: {
    INFO: 'Click the circle above to update institution image.',

    FORM: {
      TITLE: 'Edit Information',
      INSTITUTION_TYPE: 'Institution Type',
      NAME_INPUT_LABEL: 'Institution Name',
      NAME_INPUT_PLACEHOLDER: 'i.e. Iconoclast Artist',
      WEBSITE_INPUT_LABEL: 'Website(*please enter complete url.) ',
      WEBSITE_INPUT_PLACEHOLDER: 'i.e. https://iconoclastartists.org/',
      ADDRESS_INPUT_LABEL: 'Address line 1',
      ADDRESS2_INPUT_LABEL: 'Address line 2',
      CITY_LABEL: 'City',
      STATE_LABEL: 'State',
      ZIP_LABEL: 'Zip',
      PHONE_LABEL: 'Phone',
      SERVICEPROVIDER_LABEL: 'Service Provider',
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'School',
      AFTERSCHOOL: 'After School',
      DAYCAMP: 'Day Camp',
      SUMMERCAMP: 'Summer Camp',
      C3: '501C3',
    },
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save',
    },
    messages: {
      namerequired: 'Institute name is required.',
      unabletoupdate: 'Unable to update institute details. Please try again later.',
      uploaderr: 'Unable to upload image. Please try again later. ',
      deleterr: 'Error in deleting institute image.',
      imgeerr: 'Unable to update image changes. Please try again later.',
    },
  },
  ES: {
    INFO: 'TBD',
    FORM: {
      TITLE: 'TBD',
      INSTITUTION_TYPE: 'TBD',
      NAME_INPUT_LABEL: 'TBD',
      NAME_INPUT_PLACEHOLDER: 'TBD',
      WEBSITE_INPUT_LABEL: 'TBD',
      WEBSITE_INPUT_PLACEHOLDER: 'TBD',
      ADDRESS_INPUT_LABEL: 'TBD',
      ADDRESS2_INPUT_LABEL: 'TBD',
      CITY_LABEL: 'TBD',
      STATE_LABEL: 'TBD',
      ZIP_LABEL: 'TBD',
      PHONE_LABEL: 'TBD',
      SERVICEPROVIDER_LABEL: 'TBD',
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'TBD',
      AFTERSCHOOL: 'TBD',
      DAYCAMP: 'TBD',
      SUMMERCAMP: 'TBD',
      C3: 'TBD',
    },
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD',
    },
    messages: {
      namerequired: 'TBD',
      unabletoupdate: 'TBD',
      uploaderr: 'TBD',
      deleterr: 'TBD',
      imgeerr: 'TBD',
    },
  },
};

const InstitutionAddDict: any = {
  EN: {
    INFOA: 'Click circle to manage your avatar.',
    INFO: 'Click the circle above to update institution image.',
    TITLE: 'Add Institution',
    SUBTITLE: 'Add new institution to the list',
    FORM: {
      TITLE: 'Institute Information',
      INSTITUTION_TYPE: 'Institution Type',
      NAME_INPUT_LABEL: 'Institution Name',
      NAME_INPUT_PLACEHOLDER: 'i.e. Iconoclast Artist',
      WEBSITE_INPUT_LABEL: 'Website(*please enter complete url.) ',
      WEBSITE_INPUT_PLACEHOLDER: 'i.e. https://iconoclastartists.org/',
      ADDRESS_INPUT_LABEL: 'Address line 1',
      ADDRESS2_INPUT_LABEL: 'Address line 2',
      CITY_LABEL: 'City',
      STATE_LABEL: 'State',
      ZIP_LABEL: 'Zip',
      PHONE_LABEL: 'Phone',
      state: 'Select state',
      SERVICEPROVIDER_LABEL: 'Service Provider',
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'School',
      AFTERSCHOOL: 'After School',
      DAYCAMP: 'Day Camp',
      SUMMERCAMP: 'Summer Camp',
      C3: '501C3',
    },
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save',
    },
    messages: {
      namerequired: 'Institute name is required.',
      uploaderr: 'Unable to upload image. Please try again later. ',
      adderr: 'Unable to add new institute. Please try again later.',
    },
  },
  ES: {
    INFOA: 'TBD',
    INFO: 'TBD',
    TITLE: 'TBD',
    SUBTITLE: 'TBD',

    FORM: {
      TITLE: 'TBD',
      INSTITUTION_TYPE: 'TBD',
      NAME_INPUT_LABEL: 'TBD',
      NAME_INPUT_PLACEHOLDER: 'TBD',
      WEBSITE_INPUT_LABEL: 'TBD',
      WEBSITE_INPUT_PLACEHOLDER: 'TBD',
      ADDRESS_INPUT_LABEL: 'TBD',
      ADDRESS2_INPUT_LABEL: 'TBD',
      CITY_LABEL: 'TBD',
      STATE_LABEL: 'TBD',
      ZIP_LABEL: 'TBD',
      PHONE_LABEL: 'TBD',
      state: 'TBD',
      SERVICEPROVIDER_LABEL: 'TBD',
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'TBD',
      AFTERSCHOOL: 'TBD',
      DAYCAMP: 'TBD',
      SUMMERCAMP: 'TBD',
      C3: 'TBD',
    },
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD',
    },
    messages: {
      namerequired: 'TBD',
      uploaderr: 'TBD',
      adderr: 'TBD',
    },
  },
};

const Institute_class: any = {
  EN: {
    TITLE: 'INSTITUTE CLASSES',
    NO: 'No.',
    CLASSNAME: 'Class Name',
    ACTION: 'Actions',
    EDIT: 'edit',
    INFO: 'This institute does not have any class. Please create a new class.',
    BUTTON: {
      CREATE: 'Create new class',
    },
  },
  ES: {
    TITLE: 'TBD',
    NO: 'TBD',
    CLASSNAME: 'TBD',
    ACTION: 'TBD',
    EDIT: 'TBD',
    INFO: 'TBD',
    BUTTON: {
      CREATE: 'TBD',
    },
  },
};
const InstitueCurriculam: any = {
  EN: {
    TITLE: 'INSTITUTE CURRICULAR',
    BUTTON: {
      ADD: 'Add new Curricular',
    },
    NO: 'No.',
    NAME: 'Curricular Name',
    ACTION: 'Actions',
    VIEW: 'View',
    INFO: 'This institute does not have any curriculum. Please create a new curriculum.',
  },
  ES: {
    TITLE: 'TBD',
    BUTTON: {
      ADD: 'TBD',
    },
    NO: 'TBD',
    NAME: 'TBD',
    ACTION: 'TBD',
    VIEW: 'TBD',
    INFO: 'TBD',
  },
};

const InstitueRomms: any = {
  EN: {
    TITLE: 'CLASSROOMS',
    NO: 'No.',
    CLASSROOMS_NAME: 'Classroom Name',
    CLASS_NAME: 'Class Name',
    CURRICULAM: 'Curriculam',
    TEACHER: 'Teacher',
    MXSTUDENTS: 'Max. Students',
    ACTION: 'Actions',
    EDIT: 'edit',
    messages: {
      nothaveclass:
        'This institute does not have any classroom. Please create a new classroom.',
      fetcherr: 'Error while fetching classroom data please Try again later.',
    },
    BUTTON: {
      CREATE: 'Create new Classroom',
    },
  },
  ES: {
    TITLE: 'TBD',
    NO: 'TBD',
    CLASSROOMS_NAME: 'TBD',
    CLASS_NAME: 'TBD',
    TEACHER: 'TBD',
    MXSTUDENTS: 'TBD',
    ACTION: 'TBD',
    EDIT: 'TBD',
    messages: {
      nothaveclass: 'TBD',
      fetcherr: 'TBD',
    },
    BUTTON: {
      CREATE: 'TBD',
    },
  },
};
const classBuilderdict: any = {
  EN: {
    TITLE: 'Create New Class',
    SUBTITLE: 'Add new class to the list',
    NAME_LABEL: 'Class Name',
    HEADING: 'CLASS INFORMATION',
    HEADING2: 'STUDENTS',
    MEMBER_PLACEHOLDER: 'Add new student',

    BUTTON: {
      ADD: 'Add',
      SAVE: 'Save',
      SAVING: 'Saving...',
    },
    MESSAGES: {
      ERROR: {
        FETCHSTUDENT:
          'Error while fetching student list, Please try again or you can add them later.',
        FETCHINSTITUTION:
          'Error while fetching institution list, Please try again later.',
        STUDENTADDERROR:
          'Error while adding students data, you can add them saperately from class.',
        SAVECLASSERROR: 'Unable to save new class. Please try again later.',
        PROCESSINGERROR: 'Error while processing please Try again later.',
        INVALIDPATH:
          'Invalid path please go back to institution selection page to select your institute.',
      },
      VALIDATION: {
        NAME: 'Class name is required please enter.',
        INSTITUTE: 'Please select an institute to add class.',
        CLASSNAME: 'This class name is already exist, please add another name.',
      },
      SUCCESS: {
        CLASSSAVE: 'New class details has been saved.',
      },
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    NAME_LABEL: 'TBD',
    HEADING: 'TBD',
    MEMBER_PLACEHOLDER: 'TBD',
    HEADING2: 'TBD',
    MESSAGES: {
      ERROR: {
        FETCHSTUDENT: 'TBD',
        FETCHINSTITUTION: 'TBD',
        STUDENTADDERROR: 'TBD',
        SAVECLASSERROR: 'TBD',
        PROCESSINGERROR: 'TBD',
        INVALIDPATH: 'TBD',
      },
      VALIDATION: {
        NAME: 'TBD',
        INSTITUTE: 'TBD',
        CLASSNAME: 'TBD',
      },
      SUCCESS: {
        CLASSSAVE: 'TBD',
      },
    },

    BUTTON: {
      ADD: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD',
    },
  },
};

const CurricularBuilderdict: any = {
  EN: {
    TITLE: 'Create New Curriculum',
    SUBTITLE: 'Add new curriculum to the list',
    HEADING: 'CURRICULUM INFORMATION',
    NAME: 'Curriculum Name',
    LANGUAGE: 'Select Language',
    DESIGNER: 'Select Designers',

    DESCRIPTION: 'Description',
    OBJECT: 'Objective',
    messages: {
      error: {
        save: 'Unable to save new curriculum please try again later.',
        fetch: 'Unable to fetch institution list pleas try later.',
        designerlist: 'Error while fetching Designers list Please try again later.',
        process: 'Error while processing please Try again later.',
        invalid:
          'Invalid path please go back to institution selection page to select your institute.',
      },
      validation: {
        name: 'Curricular name is required please enter name.',
        institute: 'Please select an institute to add curricular.',
        curricular: 'This curricular name is already exist, please add another name.',
      },
      success: {
        save: 'New curriculum has been saved.',
      },
    },
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    LANGUAGE: 'TBD',
    DESIGNER: 'TBD',
    DESCRIPTION: 'TBD',
    OBJECT: 'TBD',
    messages: {
      error: {
        save: 'TBD',
        fetch: 'TBD',
        designerlist: 'TBD',
        process: 'TBD',
        invalid: 'TBD',
      },
      validation: {
        name: 'TBD',
        institute: 'TBD',
        curricular: 'TBD',
      },
      success: {
        save: 'TBD',
      },
    },
    BUTTON: {
      SAVE: 'TBD',
      SAVING: 'TBD',
    },
  },
};
const RoomBuilderdict: any = {
  EN: {
    TITLE: 'Create New Classroom',
    SUBTITLE: 'Add new Classroom to the list',
    HEADING: 'CLASSROOM INFORMATION',
    NAME_LABEL: 'Classroom Name',
    NAME_PLACEHOLDER: 'Add Classroom name',
    TEACHER_LABEL: 'Teacher',
    TEACHER_PLACEHOLDER: 'Select teacher',
    CLASS_NAME_LABEL: 'Class Name',
    CLASS_NAME_PLACEHOLDER: 'Select Class',
    CURRICULUM_LABEL: 'Curriculum',
    CURRICULUM_PLACEHOLDER: 'Select Curriculum',
    MAXSTUDENT_LABEL: 'Max.Students (Add number between 1 to 30)',
    MAXSTUDENT_PLACHOLDER: 'Max students',
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...',
    },
    messages: {
      error: {
        institutebefor: 'Please create an institute before creating Classroom.',
        institutelist: 'Unable to fetch institution list. Please try again later.',
        staffmember: 'Please create staff member first for your institute.',
        teacherlist: 'Unable to fetch teachers list. Please try again later.',
        createclass: 'Please create class first for your institute.',
        classlist: 'Unable to fetch class list. Please try again later.',
        curricular: 'Unable to fetch curricular list. Please try again later.',
        process: 'Error while processing please Try again later.',
        classroomadd: 'Error while adding Classroom curricular. Please try again later.',
        ecreateclass: 'Error while creating Classroom. Please try again later.',
        invalid:
          'Invalid path please go back to institution selection page to select your institute.',
      },
      validation: {
        classroomname: 'Classroom name is required please enter name.',
        institute: 'Please select an institute to add Classroom.',
        teacher: 'Please select a teacher for the Classroom.',
        class: 'Please select a class for the Classroom.',
        maxstudent: 'Please set Max students limit for the Classroom.',
        allowstudent: 'One Classroom can allow max. 30 students.',
        classroomexist: 'This Classroom name is already exist, please add another name.',
      },
      success: {
        classroomdetail: 'New Classroom details has been saved.',
        newclassroom: 'New Classroom details has been saved.',
      },
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME_LABEL: 'TBD',
    NAME_PLACEHOLDER: 'TBD',
    TEACHER_LABEL: 'TBD',
    TEACHER_PLACEHOLDER: 'TBD',
    CLASS_NAME_LABEL: 'TBD',
    CLASS_NAME_PLACEHOLDER: 'TBD',
    CURRICULUM_LABEL: 'TBD',
    CURRICULUM_PLACEHOLDER: 'TBD',
    MAXSTUDENT_LABEL: 'TBD',
    MAXSTUDENT_PLACHOLDER: 'TBD',
    BUTTON: {
      SAVE: 'TBD',
      SAVING: 'TBD',
    },
    messages: {
      error: {
        institutebefor: 'TBD',
        institutelist: 'TBD',
        staffmember: 'TBD',
        teacherlist: 'TBD',
        createclass: 'TBD',
        classlist: 'TBD',
        curricular: 'TBD',
        process: 'TBD',
        classroomadd: 'TBD',
        ecreateclass: 'TBD',
        invalid: 'TBD',
      },
      validation: {
        classroomname: 'TBD',
        institute: 'TBD',
        teacher: 'TBD',
        class: 'TBD',
        maxstudent: 'TBD',
        allowstudent: 'TBD',
        classroomexist: 'TBD',
      },
      success: {
        classroomdetail: 'TBD',
        newclassroom: 'TBD',
      },
    },
  },
};

const EditCurriculardict: any = {
  EN: {
    TITLE: 'Edit Curriculum',
    SUBTITLE: 'Update curriculum information',
    HEADING: 'CURRICULAR INFORMATION',
    NAME: 'Curriculum Name',
    LANGUAGE: 'Select Language',
    DESIGNER: 'Select Designers',
    DESCRIPTION: 'Description',
    OBJECTIVE: 'Objective',
    messages: {
      fetcherr: 'Error while fetching Designers list Please try again later.',
      curricularchange: 'Curricular changes has been saved.',
      updateerror: 'Error while updating curricular data please try later.',
      unablefetch: 'Unable to fetch institution list pleas try later.',
      processerr: 'Error while processing please Try again later.',
      namerequired: 'Curricular name is required please enter name.',
      selectinstitute: 'Please select an institute to add curricular.',
      nameexist: 'This curricular name is already exist, please add another name.',
      fetchinger: 'Error while fetching curricular data,please try again later.',
    },
    BUTTON: {
      SAVE: 'Save',
      CANCEL: 'Cancel',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    LANGUAGE: 'TBD',
    DESIGNER: 'TBD',
    DESCRIPTION: 'TBD',
    OBJECTIVE: 'TBD',
    messages: {
      fetcherr: 'TBD',
      curricularchange: 'TBD',
      updateerror: 'TBD',
      unablefetch: 'TBD',
      processerr: 'TBD',
      namerequired: 'TBD',
      selectinstitute: 'TBD',
      nameexist: 'TBD',
      fetchinger: 'TBD',
    },
    BUTTON: {
      SAVE: 'TBD',
      CANCEL: 'TBD',
    },
  },
};

const RoomEDITdict: any = {
  EN: {
    TITLE: 'Edit Classroom',
    SUBTITLE: 'Edit Classroom information',
    HEADING: 'CLASSROOM INFORMATION',
    NAME_LABEL: 'Classroom Name',
    NAME_PLACEHOLDER: 'Add Classroom name',
    TEACHER_LABEL: 'Teacher',
    TEACHER_PLACEHOLDER: 'Select teacher',
    CLASS_NAME_LABEL: 'Class Name',
    CLASS_NAME_PLACEHOLDER: 'Select Class',
    CURRICULUM_LABEL: 'Curriculum',
    CURRICULUM_PLACEHOLDER: 'Select Curriculum',
    MAXSTUDENT_LABEL: 'Max.Students (Add number between 1 to 30)',
    MAXSTUDENT_PLACHOLDER: 'Max students',
    messages: {
      institutebefor: 'Please create an institute before creating Classroom.',
      unabletofetch: 'Unable to fetch institution list. Please try again later.',
      addstaffirst:
        'Please add staff member first for the selected institute or select another institute.',
      unableteacher: 'Unable to fetch teachers list. Please try again later.',
      addclassfirst:
        'Please add class first for the selected institute or select another institute.',
      unableclass: 'Unable to fetch class list. Please try again later.',
      unablecurricular: 'Unable to fetch curricular list. Please try again later.',
      errorprocess: 'Error while processing please Try again later.',
      classroomrequired: 'Classroom name is required please enter name.',
      selectinstitute: 'Please select an institute to add Classroom.',
      selectteacher: 'Please select a teacher for the Classroom.',
      selectclass: 'Please select a class for the Classroom.',
      mxstudent: 'Please set Max students limit for the Classroom.',
      oneclass: 'One Classroom can allow max. 30 students.',
      alreadyexist: 'This Classroom name is already exist, please add another name.',
      classupdate: 'Classroom details has been updated.',
      errupdating: 'Error while updating Classroom curricular. Please try that later.',
      errprocess: 'Error while processing. Please try again later.',
      errupdatingclass: 'Error while updating Classroom details. Please try again later.',
      errfetch: 'Error while fetching Classroom data, please try again later.',
    },
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...',
      CANCEL: 'Cancel',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME_LABEL: 'TBD',
    NAME_PLACEHOLDER: 'TBD',
    TEACHER_LABEL: 'TBD',
    TEACHER_PLACEHOLDER: 'TBD',
    CLASS_NAME_LABEL: 'TBD',
    CLASS_NAME_PLACEHOLDER: 'TBD',
    CURRICULUM_LABEL: 'TBD',
    CURRICULUM_PLACEHOLDER: 'TBD',
    MAXSTUDENT_LABEL: 'TBD',
    MAXSTUDENT_PLACHOLDER: 'TBD',
    messages: {
      institutebefor: 'TBD',
      unabletofetch: 'TBD',
      addstaffirst: 'TBD',
      unableteacher: 'TBD',
      addclassfirst: 'TBD',
      unableclass: 'TBD',
      unablecurricular: 'TBD',
      errorprocess: 'TBD',
      classroomrequired: 'TBD',
      selectinstitute: 'TBD',
      selectteacher: 'TBD',
      selectclass: 'TBD',
      mxstudent: 'TBD',
      oneclass: 'TBD',
      alreadyexist: 'TBD',
      classupdate: 'TBD',
      errupdating: 'TBD',
      errprocess: 'TBD',
      errupdatingclass: 'TBD',
      errfetch: 'TBD',
    },
    BUTTON: {
      SAVE: 'TBD',
      SAVING: 'TBD',
      CANCEL: 'TBD',
    },
  },
};
const curricularviewdict: any = {
  EN: {
    TITLE: 'Curriculum Builder',
    SUBTITLE: 'Build curriculum, units and lesson plans here',
    HEADING: 'GENERAL INFORMATION',
    NAME: 'Curriculum Name',
    OWNER: 'Institution Owner',
    DESCRIPTION: 'Description',
    DESIGNER: 'Designers',
    LANGUAGE: 'Languages',
    OBJECTIVE: 'Objective',
    TAB: {
      UNIT: 'Units',
      LEARINGOBJECTIVE: 'Learning objectives',
      INFORMATION: 'Demographics & Information',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    OWNER: 'TBD',
    DESCRIPTION: 'TBD',
    DESIGNER: 'TBD',
    LANGUAGE: 'TBD',
    OBJECTIVE: 'TBD',
    TAB: {
      UNIT: 'TBD',
      LEARINGOBJECTIVE: 'TBD',
      INFORMATION: 'TBD',
    },
  },
};

const CHECKPOINTSDICT: any = {
  EN: {
    TITLE: 'CURRICULAR CHECKPOINTS',
    INFO: 'This curricular does not have any checkpoints yet. Please create a new one.',
    FETCH: 'Fetching Data Please wait...',
    BUTTON: {
      ADDEXISTING: 'Add Existing Checkpoint',
      ADDNEW: 'Add New Checkpoint',
    },
  },
  ES: {
    TITLE: 'TBD',
    INFO: 'TBD',
    FETCH: 'TBD',
    BUTTON: {
      ADDEXISTING: 'TBD',
      ADDNEW: 'TBD',
    },
  },
};

const LEARINGOBJECTIVEDICT: any = {
  EN: {
    TITLE: 'LEARNING OBJECTIVES',
    INFO:
      'This curricular does not have any learning objectives yet. Please create a new one.',
    FETCH: 'Fetching Data Please wait...',
    BUTTON: {
      ADD: 'Add New Learning Objective',
    },
  },
  ES: {
    TITLE: 'TBD',
    INFO: 'TBD',
    FETCH: 'TBD',
    BUTTON: {
      ADD: 'TBD',
    },
  },
};

const SYLLABUS: any = {
  EN: {
    TITLE: 'CURRICULUM UNITS',
    NO: 'No.',
    NAME: 'Unit Name',
    ACTION: 'Actions',
    EDIT: 'edit',
    INFO: 'This curricular does not have any units yet. Please create a new one.',
    FETCH: 'Fetching details...',
    ADDNEW: 'Add new Unit',
  },
  ES: {
    TITLE: 'TBD',
    NO: 'TBD',
    NAME: 'TBD',
    ACTION: 'TBD',
    EDIT: 'TBD',
    INFO: 'TBD',
    FETCH: 'TBD',
    ADDNEW: 'TBD',
  },
};

const Measurementdict: any = {
  EN: {
    NO: 'No.',
    MEASUREMENT: 'Measurements',
    ACTION: 'Actions',
    EDIT: 'Edit',
    INFO: 'This topic does not have any measurement yet. Please create a new one.',
    ADDNEW: 'Add New Measurement',
    FETCH: 'Fetching measurements list...',
  },
  ES: {
    NO: 'TBD',
    MEASUREMENT: 'TBD',
    ACTION: 'TBD',
    EDIT: 'TBD',
    INFO: 'TBD',
    ADDNEW: 'TBD',
    FETCH: 'TBD',
  },
};

const TOPICLISTDICT: any = {
  EN: {
    TOPIC: 'Topics',
    EDIT: 'Edit',
    INFO: 'This learning objective does not have any topics. Please create a new one.',
    ADDNEW: 'Add New Topic',
    FETCH: 'Fetching topics list...',
  },
  ES: {
    TOPIC: 'TBD',
    EDIT: 'TBD',
    INFO: 'TBD',
    ADDNEW: 'TBD',
    FETCH: 'TBD',
  },
};

const ADDLEARINGOBJDICT: any = {
  EN: {
    TITLE: 'Add learning objective',
    SUBTITLE: 'Add new learning objective.',
    HEADING: 'LEARNING OBJECTIVE INFORMATION',
    NAME: 'Learning Objective Name',
    DESC: 'Description',
    SAVE: 'Save',
    VALIDATION: 'Name is required',
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    DESC: 'TBD',
    SAVE: 'TBD',
    VALIDATION: 'TBD',
  },
};

const addQuestionDict: any = {
  EN: {
    heading: 'ADD NEW CHECKPOINT QUESTION',
    q: 'Question',
    qlabel: 'Question Label',
    selecttype: 'Select Type',
    selectpl: 'Type',
    selectlang: 'Select Language',
    selectlanpl: 'Language',
    addOption: 'Add Options :',
    otheropt: `Add an "Other" Answer Option and Comment Field`,
    nonefabove: `Add a "None of the above" Answer Option`,
    messages: {
      qrequired: 'Question input is required',
      qtyperequired: 'Question type is required',
      qlabelrequired: 'Question label is required',
      qdetailsave: 'Question details has been saved.',
      unabletosave: 'Unable to save Question details, Please try again later.',
    },
    Button: {
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  ES: {
    heading: 'TBD',
    q: 'TBD',
    qlabel: 'TBD',
    selecttype: 'TBD',
    selectpl: 'TBD',
    selectlang: 'TBD',
    selectlanpl: 'TBD',
    addOption: 'TBD',
    otheropt: `TBD`,
    nonefabove: `TBD`,
    messages: {
      qrequired: 'TBD',
      qtyperequired: 'TBD',
      qlabelrequired: 'TBD',
      qdetailsave: 'TBD',
      unabletosave: 'TBD',
    },
    Button: {
      save: 'TBD',
      cancel: 'TBD',
    },
  },
};

const SelectPreviousQuestionDict: any = {
  EN: {
    heading: 'SELECT NEW CHECKPOINT QUESTION',
    qselectd: 'Questions Selected',
    selection: 'Selection',
    question: 'Question',
    type: 'Type',
    language: 'Language',
    qempty: 'Question bank is empty please create a new question.',
    error: 'Error while fetching questions list please try again later.',
    wait: 'Fetching question details please wait...',
    button: {
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  ES: {
    heading: 'TBD',
    qselectd: 'TBD',
    selection: 'TBD',
    question: 'TBD',
    type: 'TBD',
    language: 'TBD',
    qempty: 'TBD',
    error: 'TBD',
    wait: 'TBD',
    button: {
      save: 'TBD',
      cancel: 'TBD',
    },
  },
};
const AddMeasurementDict: any = {
  EN: {
    title: 'Add Measurement',
    subtitle: 'Add new measurement to curricular.',
    heading: 'MEASUREMENT INFORMATION',
    mlabel: 'Measurement Name',
    selecttopic: 'Select Topic',
    topic: 'Topic',
    criterialabel: 'Criteria',
    distinlabel: 'Distinguished',
    excell: 'Excelled',
    adequate: 'Adequate',
    basic: 'Basic',
    button: {
      save: 'Save',
      cancel: 'cancel',
    },
    messages: {
      namerequired: 'Name is required',
      topicrequired: 'topic is required',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    mlabel: 'TBD',
    selecttopic: 'TBD',
    topic: 'TBD',
    criterialabel: 'TBD',
    distinlabel: 'TBD',
    excell: 'TBD',
    adequate: 'TBD',
    basic: 'TBD',
    button: {
      save: 'TBD',
      cancel: 'TBD',
    },
    messages: {
      namerequired: 'TBD',
      topicrequired: 'TBD',
    },
  },
};

const AddProfileCheckpointDict: any = {
  EN: {
    title: 'Add Checkpoint',
    subtitle: 'Add new checkpoint to curricular.',
    heading: 'ADD NEW CHECKPOINT',
    label: 'Title',
    checkpointlabel: 'Checkpoint Label',
    selectdesigner: 'Select Designers',
    placeholder: 'Designers',
    languageselect: 'Select Language',
    placeholderlanguage: 'Language',
    checkpointq: 'Checkpoint Questions',
    addquestion: 'Please add questions to this checkpoint.',
    no: 'No.',
    question: 'Question',
    type: 'Type',
    option: 'Options',
    button: {
      existing: 'Add Existing Questions',
      newq: 'Create New Question',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
    },
    messages: {
      unsave: 'Unable to save Checkpoint details, Please try again later.',
      titlerequired: 'Checkpoint title is required',
      labelrequired: 'Checkpoint label is required',
      minone: 'You need to add minimum one question to create a checkpoint.',
      noquestion: 'This checkpoint does not have any questions',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    label: 'TBD',
    checkpointlabel: 'TBD',
    selectdesigner: 'TBD',
    placeholder: 'TBD',
    languageselect: 'TBD',
    placeholderlanguage: 'TBD',
    checkpointq: 'TBD',
    addquestion: 'TBD',
    no: 'TBD',
    question: 'TBD',
    type: 'TBD',
    option: 'TBD',
    button: {
      existing: 'TBD',
      newq: 'TBD',
      cancel: 'TBD',
      save: 'TBD',
      saving: 'TBD',
    },
    messages: {
      unsave: 'TBD',
      titlerequired: 'TBD',
      labelrequired: 'TBD',
      minone: 'TBD',
      noquestion: 'TBD',
    },
  },
};

const AddSyllabusDict: any = {
  EN: {
    title: 'Unit Builder',
    subtitle: 'Create curriculum units here.',
    heading: 'UNIT INFORMATION',
    unitname: 'Unit Name',
    designer: 'Select Designers',
    placeholder: 'Designers',
    language: 'Select Language',
    placeholderlanguage: 'Language',
    description: 'Description',
    purpose: 'Purpose',
    objective: 'Objectives',
    methodology: 'Methodology',
    policy: 'Policies',
    save: 'Save',
    saving: 'Saving...',

    messages: {
      fetcherr: 'Error while fetching Designers list Please try again later.',
      uintsave: 'New unit has been saved.',
      unablesave: 'Unable to save new unit please try again later.',
      namerequired: 'Unit name is required please enter name.',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    unitname: 'TBD',
    designer: 'TBD',
    placeholder: 'TBD',
    language: 'TBD',
    placeholderlanguage: 'TBD',
    description: 'TBD',
    purpose: 'TBD',
    objective: 'TBD',
    methodology: 'TBD',
    policy: 'TBD',
    save: 'TBD',
    saving: 'TBD',

    messages: {
      fetcherr: 'TBD',
      uintsave: 'TBD',
      unablesave: 'TBD',
      namerequired: 'TBD',
    },
  },
};

const AddTopicDict: any = {
  EN: {
    title: 'Add Topic',
    subtitle: 'Add new topic to the curricular.',
    heading: 'TOPIC INFORMATION',
    topicname: 'Topic Name',
    learningobj: 'Select Learning objective',
    learningobjpl: 'Learning objective',
    description: 'Description',
    button: {
      cancel: 'Cancel',
      save: 'Save',
    },
    messages: {
      namerequired: 'Name is required',
      objectiverequired: 'learning objective is required',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    topicname: 'TBD',
    learningobj: 'TBD',
    learningobjpl: 'TBD',
    description: 'TBD',
    button: {
      cancel: 'TBD',
      save: 'TBD',
    },
    messages: {
      namerequired: 'TBD',
      objectiverequired: 'TBD',
    },
  },
};

const EditLearningObjectiveDict: any = {
  EN: {
    title: 'Edit Learning objective',
    subtitle: 'Edit curricular Learning objective.',
    heading: 'LEARNING OBJECTIVE INFORMATION',
    learningname: 'Lerning Objective name',
    description: 'Description',
    fetching: 'Fetching data...',
    button: {
      cancel: 'Cancel',
      save: 'Save',
    },
    messages: {
      namerequired: 'Name is required',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    learningname: 'TBD',
    description: 'TBD',
    fetching: 'TBD',
    button: {
      cancel: 'TBD',
      save: 'TBD',
    },
    messages: {
      namerequired: 'TBD',
    },
  },
};

const EditMeasurementDict: any = {
  EN: {
    title: 'Edit Measurement',
    subtitle: 'Edit curricular measurement.',
    heading: 'MEASUREMENT INFORMATION',
    labelmeasur: 'Measurement Name',
    seltopic: 'Select Topic',
    topic: 'Topic',
    criteria: 'Criteria',
    distinguished: 'Distinguished',
    excell: 'Excelled',
    adequite: 'Adequate',
    basic: 'Basic',
    fetching: 'Fetching data...',
    button: {
      cancel: 'Cancel',
      save: 'Save',
    },
    messages: {
      namerequierd: 'Name is required',
      topicrequired: 'topic is required',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    labelmeasur: 'TBD',
    seltopic: 'TBD',
    topic: 'TBD',
    criteria: 'TBD',
    distinguished: 'TBD',
    excell: 'TBD',
    adequite: 'TBD',
    basic: 'TBD',
    fetching: 'TBD',
    button: {
      cancel: 'TBD',
      save: 'TBD',
    },
    messages: {
      namerequierd: 'TBD',
      topicrequired: 'TBD',
    },
  },
};

const EditProfileCheckpointDict: any = {
  EN: {
    title: 'Add Checkpoint',
    subtitle: 'Add new checkpoint to curricular.',
    heading: 'ADD NEW CHECKPOINT',
    ltitle: 'Title',
    checklabel: 'Checkpoint Label',
    designer: 'Select Designers',
    language: 'Select Language',
    planguage: 'Language',
    checkpoint: 'Checkpoint Questions',
    addquestion: 'Please add questions to this checkpoint.',
    addexist: 'Add Existing Questions',
    addnew: 'Create New Question',
    no: 'No.',
    question: 'Question',
    type: 'Type',
    option: 'Options',
    noquestion: 'This checkpoint does not have any questions',
    save: 'Save',
    saving: 'Saving...',
    messages: {
      saveerr: 'Unable to save Checkpoint details, Please try again later.',
      title: 'Checkpoint title is required',
      label: 'Checkpoint label is required',
      onequetion: 'You need to add minimum one question to create a checkpoint.',
      fetcherr: 'Unable to fetch Checkpoint details, Please try again later.',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    ltitle: 'TBD',
    checklabel: 'TBD',
    designer: 'TBD',
    language: 'TBD',
    planguage: 'TBD',
    checkpoint: 'TBD',
    addquestion: 'TBD',
    addexist: 'TBD',
    addnew: 'TBD',
    no: 'TBD',
    question: 'TBD',
    type: 'TBD',
    option: 'TBD',
    noquestion: 'TBD',
    save: 'TBD',
    saving: 'TBD',
    messages: {
      saveerr: 'TBD',
      title: 'TBD',
      label: 'TBD',
      onequetion: 'TBD',
      fetcherr: 'TBD',
    },
  },
};

const EditSyllabusDict: any = {
  EN: {
    title: 'Unit Builder',
    subtitle: 'Update curriculum units here.',
    heading: 'GENERAL INFORMATION',
    unitname: 'Unit Name',
    designer: 'Select Designers',
    pdesigner: 'Designers',
    selectlang: 'Select Language',
    language: 'Language',
    desc: 'Description',
    purpose: 'Purpose',
    objective: 'Objectives',
    methodology: 'Methodology',
    policy: 'Policies',
    lessonplan: 'LESSON PLAN MANAGER',
    selectlesson: 'Select Lesson',
    no: 'No.',
    name: 'Lesson Name',
    measurement: 'Measurements',
    type: 'Type',
    status: 'Status',
    action: 'Actions',
    edit: 'edit',
    nolesson: 'No Lessons Selected',
    createnew: 'Create New Lesson',
    messages: {
      wantsave: 'Do you want to save changes before moving forward?',
      unitupdate: 'Unit details has been updated.',
      unableupdate: 'Unable to update unit details please try again later.',
      namerequired: 'Unit name is required please enter name.',
      updateerr: 'Error while updating lesson status please try later.',
      fetcher: 'Error while fetching unit data.',
      fetchlist: 'Error while fetching lessons list data.',
      fetchdesign: 'Error while fetching Designers list Please try again later.',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    unitname: 'TBD',
    designer: 'TBD',
    pdesigner: 'TBD',
    selectlang: 'TBD',
    language: 'TBD',
    desc: 'TBD',
    purpose: 'TBD',
    objective: 'TBD',
    methodology: 'TBD',
    policy: 'TBD',
    lessonplan: 'TBD',
    selectlesson: 'TBD',
    no: 'TBD',
    name: 'TBD',
    measurement: 'TBD',
    type: 'TBD',
    status: 'TBD',
    action: 'TBD',
    edit: 'TBD',
    nolesson: 'TBD',
    createnew: 'TBD',
    messages: {
      wantsave: 'TBD',
      unitupdate: 'TBD',
      unableupdate: 'TBD',
      namerequired: 'TBD',
      updateerr: 'TBD',
      fetcher: 'TBD',
      fetchlist: 'TBD',
      fetchdesign: 'TBD',
    },
  },
};

const EditTopicDict: any = {
  EN: {
    title: 'Edit Topic',
    subtitle: 'Edit curricular topic.',
    heading: 'TOPIC INFORMATION',
    topicname: 'Topic Name',
    selectlearning: 'Select Learning objective',
    learningobjective: 'Learning objective',
    desc: 'Description',
    fetching: 'Fetching data...',
    Distinguished: 'Distinguished',
    Excelled: 'Excelled',
    Adequate: 'Adequate',
    Basic: 'Basic',
    button: {
      cancel: 'Cancel',
      save: 'Save',
    },
    messages: {
      namerequired: 'Name is required',
      learningobj: 'learning objective is required',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    topicname: 'TBD',
    selectlearning: 'TBD',
    learningobjective: 'TBD',
    desc: 'TBD',
    fetching: 'TBD',
    Distinguished: 'TBD',
    Excelled: 'TBD',
    Adequate: 'TBD',
    Basic: 'TBD',
    button: {
      cancel: 'TBD',
      save: 'TBD',
    },
    messages: {
      namerequired: 'TBD',
      learningobj: 'TBD',
    },
  },
};
const ProfileCheckpointlookupDict: any = {
  EN: {
    title: 'Select Checkpoint',
    subtitle: 'Select checkpoint for curricular.',
    heading: 'CHECKPOINT LISTS',
    selectcheckpoint: 'Checkpoints Selected',
    selection: 'Selection',
    checkpoint: 'Checkpoint Title',
    language: 'Language',
    listempty: 'Other checkpoint list is empty, please create a new checkpoint.',
    errfetch: ' Error while fetching Checkpoint list Please try again later.',
    updating: 'Updating checkpoints please wait...',
    fetching: 'Fetching Checkpoint list Please wait...',
    button: {
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    selectcheckpoint: 'TBD',
    selection: 'TBD',
    checkpoint: 'TBD',
    language: 'TBD',
    listempty: 'TBD',
    errfetch: 'TBD',
    updating: 'TBD',
    fetching: 'TBD',
    button: {
      cancel: 'TBD',
      save: 'TBD',
      saving: 'TBD',
    },
  },
};

const RegistrationDict: any = {
  EN: {
    title: 'Registration',
    subtitle: 'Add new user to the list',
    requiredfield: 'Required fields',
    firstname: 'First Name',
    firstplaceholder: 'John',
    lastname: 'Last Name',
    lastplaceholder: 'Doe',
    email: 'Email',
    emailplaceholder: 'email@email.com',
    button: {
      submit: 'Submit',
    },
    messages: {
      emailerr: "Please make sure the user's email is correct",
      existemail: 'An account with this email exists',
      fitstname: "User's first name cannot be blank",
      lastname: "User's last name cannot be blank",
      email: "User's email cannot be blank",
      emailaddress: "User's email is not in the expected email address format",
      userrol: "User's role cannot be blank",
      loading: 'Loading...',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    requiredfield: 'TBD',
    firstname: 'TBD',
    firstplaceholder: 'TBD',
    lastname: 'TBD',
    lastplaceholder: 'TBD',
    email: 'TBD',
    emailplaceholder: 'TBD',
    button: {
      submit: 'TBD',
    },
    messages: {
      emailerr: 'TBD',
      existemail: 'TBD',
      fitstname: 'TBD',
      lastname: 'TBD',
      email: 'TBD',
      emailaddress: 'TBD',
      userrol: 'TBD',
      loading: 'TBD',
    },
  },
};

const UserDict: any = {
  EN: {
    title: 'USER INFORMATION',
  },
  ES: {
    title: 'TBD',
  },
};

const UserEditDict: any = {
  EN: {
    heading: 'Edit Personal Information',
    firstname: 'First Name',
    lastname: 'Last Name',
    nickname: 'Nickname',
    status: 'Status',
    role: 'Role',

    button: {
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  ES: {
    heading: 'TBD',
    firstname: 'TBD',
    lastname: 'TBD',
    nickname: 'TBD',
    status: 'TBD',
    role: 'TBD',

    button: {
      save: 'TBD',
      cancel: 'TBD',
    },
  },
};

const UserInformationDict: any = {
  EN: {
    details: 'Private Details',
    heading: 'Personal Information',
    fullname: 'Full Name',
    nickname: 'Nickname',
    role: 'Role',
    status: 'Status',
    email: 'Email Address',
    account: 'Account Created',
  },
  ES: {
    details: 'TDB',
    heading: 'TBD',
    fullname: 'TBD',
    nickname: 'TBD',
    role: 'TBD',
    status: 'TBD',
    email: 'TBD',
    account: 'TBD',
  },
};
const UserLookupDict: any = {
  EN: {
    title: 'USER MANAGEMENT',
    subtitle: "People's List",
    sortby: 'Sort By',
    name: 'Name',
    role: 'Role',
    status: 'Status',
    action: 'Actions',
    noresult: 'No Results',
    button: {
      add: 'Add New Person',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    sortby: 'TBD',
    name: 'TBD',
    role: 'TBD',
    status: 'TBD',
    action: 'TBD',
    noresult: 'TBD',
    button: {
      add: 'TBD',
    },
  },
};

const UserLookupWithTokenDict: any = {
  EN: {
    title: 'USER MANAGEMENT',
    subtitle: "People's List",
    sortby: 'Sort By',
    name: 'Name',
    role: 'Role',
    institution: 'Institution',
    status: 'Status',
    action: 'Actions',
    noresult: 'No Results',
    button: {
      add: 'Add New Person',
    },
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    sortby: 'TBD',
    name: 'TBD',
    role: 'TBD',
    status: 'TBD',
    action: 'TBD',
    noresult: 'TBD',
    button: {
      add: 'TBD',
    },
  },
};

const AddQuestionModalDict: any = {
  EN: {
    TITLE: 'ADD QUESTION',
    HEADING: '*Click here to add Question, directly from previously created questions.',
    QUESTION: 'Question',
    NOTELABEL: 'Notes',
    QUESTIONLABEL: 'Question Label',
    LANGUAGE: 'Language',
    TYPE: 'Type',
    MAKEQUESTIONREQUIRED: 'Make this question required',
    ADDOPTION: 'Add Options:',
    ADDOTHEROPTION: 'Add an "Other" Answer Option or Comment Field',
    ADDNOTEABOVE: 'Add a "None of the above" Answer Option',
    BUTTON: {
      NEXT: 'Next Question',
      CANCEL: 'Cancel',
      SAVE: 'Save',
    },
  },
  ES: {
    TITLE: 'TBD',
    HEADING: 'TBD',
    QUESTION: 'TBD',
    NOTELABEL: 'TBD',
    QUESTIONLABEL: 'TBD',
    LANGUAGE: 'TBD',
    TYPE: 'TBD',
    MAKEQUESTIONREQUIRED: 'TBD',
    ADDOPTION: 'TBD',
    ADDOTHEROPTION: 'TBD',
    ADDNOTEABOVE: 'TBD',
    BUTTON: {
      NEXT: 'TBD',
      CANCEL: 'TBD',
      SAVE: 'TBD',
    },
  },
};

const AddNewCheckPointDict: any = {
  EN: {
    BUILDER: 'Builder',
    CREATENEW: 'Create New Checkpoint',
    TITLE: 'Title',
    CHECKPOINTLABEL: 'Checkpoint Label',
    SUBTITLE: 'Subtitle',
    LANGUAGE: 'Select Language',
    DESIGNER: 'Select Designers',
    ESTIMATE: 'Estimated Time (min) ',
    CHECKPOINTQUESTION: 'Checkpoint Questions:',
    ADDQUESTION: 'Please add questions to checkpoint builder',
    NO: 'No.',
    QUESTION: 'Question',
    TYPE: 'Type',
    REQUIRED: 'Is Required',
    OPTION: 'Options',
    NOQUESTION: 'This checkpoint does not have any questions',

    BUTTON: {
      ADDEXIST: 'Add Existing Questions',
      CREATE: 'Create New Question',
      CANCEL: 'Cancel',
      SAVE: 'Save',
      SAVING: 'Saving...',
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.',
    },
    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATETIME: 'Checkpoint estimated time is required',
      VALIDNUMBER: 'Please enter valid number i.e. 30.',
      ONEQUESTION: 'You need to add minimum one question to create a checkpoint.',
    },
  },
  ES: {
    BUILDER: 'TBD',
    CREATENEW: 'TBD',
    TITLE: 'TBD',
    CHECKPOINTLABEL: 'TBD',
    SUBTITLE: 'TBD',
    LANGUAGE: 'TBD',
    DESIGNER: 'TBD',
    ESTIMATE: 'TBD',
    CHECKPOINTQUESTION: 'TBD',
    ADDQUESTION: 'TBD',
    NO: 'TBD',
    QUESTION: 'TBD',
    TYPE: 'TBD',
    REQUIRED: 'TBD',
    OPTION: 'TBD',
    NOQUESTION: 'TBD',

    BUTTON: {
      ADDEXIST: 'TBD',
      CREATE: 'TBD',
      CANCEL: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD',
    },
    MESSAGES: {
      UNABLESAVE: 'TBD',
    },
    VALIDATION: {
      TITLE: 'TBD',
      LABEL: 'TBD',
      ESTIMATETIME: 'TBD',
      VALIDNUMBER: 'TBD',
      ONEQUESTION: 'TBD',
    },
  },
};

const AddNewQuestionDict: any = {
  EN: {
    BUILDER: 'Builder',
    CHECKPOINT: 'Checkpoints',
    ADDNEWQUESTION: 'Add New Question',
    QUESTION: 'Question',
    QUESTIONLABE: 'Question Label',
    SELECTTYPE: 'Select Type',
    SELECTLANGUAGE: 'Select Language',
    LANGUAGE: 'Language',
    MAKEQUESTION: 'Make this question required',
    ADDOPTION: 'Add Options:',
    ADDOTHEROPTION: 'Add an "Other" Answer Option and Comment Field',
    ADDNONOFABOVE: 'Add a "None of the above" Answer Option',
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save',
      SAVING: 'Saving...',
    },
    VALIDATION: {
      QUESTION: 'Question input is required',
      TYPE: 'Question type is required',
      LABEL: 'Question label is required',
    },
    MESSAGES: {
      QUESTIONSAVE: 'Question details has been saved.',
      UNABLESAVE: 'Unable to save Question details, Please try again later.',
    },
  },
  ES: {
    BUILDER: 'TBD',
    CHECKPOINT: 'TBD',
    ADDNEWQUESTION: 'TBD',
    QUESTION: 'TBD',
    QUESTIONLABE: 'TBD',
    SELECTTYPE: 'TBD',
    SELECTLANGUAGE: 'TBD',
    LANGUAGE: 'TBD',
    MAKEQUESTION: 'TBD',
    ADDOPTION: 'TBD',
    ADDOTHEROPTION: 'TBD',
    ADDNONOFABOVE: 'TBD',
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD',
    },
    VALIDATION: {
      QUESTION: 'TBD',
      TYPE: 'TBD',
      LABEL: 'TBD',
    },
    MESSAGES: {
      QUESTIONSAVE: 'TBD',
      UNABLESAVE: 'TBD',
    },
  },
};

const CheckpointLookupDict: any = {
  EN: {
    BUILDER: 'Builder',
    PREVIOUSCHECKPOINT: 'Previous Checkpoints',
    CHEKPOINTSELECTED: 'Checkpoints Selected',
    SELECTION: 'Selection',
    CHECKPOINTTITLE: 'Checkpoint Title',
    LANGUAGE: 'Language',
    BUTTON: {
      SAVE: 'Save',
      CANCEL: 'Cancel',
      SAVING: 'Saving...',
    },
  },
  ES: {
    BUILDER: 'TBD',
    PREVIOUSCHECKPOINT: 'TBD',
    CHEKPOINTSELECTED: 'TBD',
    SELECTION: 'TBD',
    CHECKPOINTTITLE: 'TBD',
    LANGUAGE: 'TBD',
    BUTTON: {
      SAVE: 'TBD',
      CANCEL: 'TBD',
      SAVING: 'TDB',
    },
  },
};
const CheckpointQueTableDict: any = {
  EN: {
    NO: 'No.',
    QUESTION: 'Question',
    TYPE: 'Type',
    NOQUESTIONCHECKPOINT: 'This checkpoint does not have any questions',
    FETCHERR: 'Error while fetching checkpoint questions please try later...',
    FETCHING: 'Fetching checkpoint questions please wait...',

    BUTTON: {
      EDIT: 'Edit Checkpoint',
      REMOVE: 'Remove Checkpoint',
    },
  },
  ES: {
    NO: 'TBD',
    QUESTION: 'TBD',
    TYPE: 'TBD',
    NOQUESTIONCHECKPOINT: 'TBD',
    FETCHERR: 'TBD',
    FETCHING: 'TBD',

    BUTTON: {
      EDIT: 'TBD',
      REMOVE: 'TBD',
    },
  },
};

const EditCheckPointDict: any = {
  EN: {
    BUILDER: 'Builder',
    EDITCHECKPOINT: 'Edit Checkpoint',
    TITLE: 'Title',
    CHECKPOINTLABEL: 'Checkpoint Label',
    SUBTITLE: 'Subtitle',
    SELECTLANGUAGE: 'Select Language',
    SELECTDESIGNER: 'Select Designers',
    ESTIMATE: 'Estimated Time (min)',
    CHECKPOINTQUE: 'Checkpoint Questions: ',
    ADDQUESTION: 'Please add questions to checkpoint builder',
    NO: 'No.',
    QUESTION: 'Question',
    TYPE: 'Type',
    REQUIRED: 'Is Required',
    OPTION: 'Options',
    NOQUESTION: 'This checkpoint does not have any questions',

    BUTTON: {
      ADDEXIST: 'Add Existing Questions',
      CREATE: 'Create New Question',
      CANCEL: 'Cancel',
      SAVE: 'Save',
      SAVING: 'Saving...',
    },

    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATE: 'Checkpoint estimated time is required',
      ENTERVALIDNUMBER: 'Please enter valid number i.e. 30.',
      MINIMUMONE: 'You need to add minimum one question to create a checkpoint.',
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.',
    },
  },
  ES: {
    BUILDER: 'TBD',
    EDITCHECKPOINT: 'TBD',
    TITLE: 'TBD',
    CHECKPOINTLABEL: 'TBD',
    SUBTITLE: 'TBD',
    SELECTLANGUAGE: 'TBD',
    SELECTDESIGNER: 'TBD',
    ESTIMATE: 'TBD',
    CHECKPOINTQUE: 'TBD',
    ADDQUESTION: 'TBD',
    NO: 'TBD',
    QUESTION: 'TBD',
    TYPE: 'TBD',
    REQUIRED: 'TBD',
    OPTION: 'TBD',
    NOQUESTION: 'TBD',

    BUTTON: {
      ADDEXIST: 'TBD',
      CREATE: 'TBD',
      CANCEL: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD',
    },

    VALIDATION: {
      TITLE: 'TBD',
      LABEL: 'TBD',
      ESTIMATE: 'TBD',
      ENTERVALIDNUMBER: 'TBD',
      MINIMUMONE: 'TBD',
    },
    MESSAGES: {
      UNABLESAVE: 'TBD',
    },
  },
};

const EditQuestionDict: any = {
  EN: {
    ASSESSMENTBUILDER: 'Assessment Builder',
    CHECKPOINT: 'Checkpoints',
    EDITQUE: 'Edit Question',
    QUESTION: 'Question',
    QUESTIONLABEL: 'Question Label',
    SELECTTYPE: 'Select Type',
    SELECTLANGUAGE: 'Select Language',
    LANGUAGE: 'Language',
    QUEREQUIRED: 'Make this question required',
    ADDOPTION: 'Add Options:',
    OTHEROPT: 'Add an "Other" Answer Option and Comment Field',
    NONEOFABOVE: 'Add a "None of the above" Answer Option',
    BUTTON: {
      CANCEL: 'Cancel',
      SAVING: 'Saving...',
      SAVE: 'Save',
    },
    VALIDATION: {
      INPUT: 'Question input is required',
      TYPE: 'Question type is required',
      LABEL: 'Question label is required',
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Question details, Please try again later.',
    },
  },
  ES: {
    ASSESSMENTBUILDER: 'TBD',
    CHECKPOINT: 'TBD',
    EDITQUE: 'TBD',
    QUESTION: 'TBD',
    QUESTIONLABEL: 'TBD',
    SELECTTYPE: 'TBD',
    SELECTLANGUAGE: 'TBD',
    LANGUAGE: 'TBD',
    QUEREQUIRED: 'TBD',
    ADDOPTION: 'TBD',
    OTHEROPT: 'TBD',
    NONEOFABOVE: 'TBD',
    BUTTON: {
      CANCEL: 'TBD',
      SAVING: 'TBD',
      SAVE: 'TBD',
    },
    VALIDATION: {
      INPUT: 'TBD',
      TYPE: 'TBD',
      LABEL: 'TBD',
    },
    MESSAGES: {
      UNABLESAVE: 'TBD',
    },
  },
};

const QuestionLookupDict: any = {
  EN: {
    BUILDER: 'Builder',
    CHECKPOINT: 'Checkpoints',
    PREVQUE: 'Previous Questions',
    QUESELECT: 'Questions Selected',
    SELECTION: 'Selection',
    QUESTION: 'Question',
    TYPE: 'Type',
    LANGUAGE: 'Language',
    QUEEMPTY: 'Question bank is empty please create a new question.',
    FETCHERR: 'Error while fetching questions list please try again later.',
    FETCHING: 'Fetching question details please wait...',
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save',
    },
  },
  ES: {
    BUILDER: 'TBD',
    CHECKPOINT: 'TBD',
    PREVQUE: 'TBD',
    QUESELECT: 'TBD',
    SELECTION: 'TBD',
    QUESTION: 'TBD',
    TYPE: 'TBD',
    LANGUAGE: 'TBD',
    QUEEMPTY: 'TBD',
    FETCHERR: 'TBD',
    FETCHING: 'TBD',
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD',
    },
  },
};

const SelectedCheckPointsListDict: any = {
  EN: {
    BUILDER: 'Builder',
    ADDCHECKPOINT: 'Please add checkpoints to',
    BUTTON: {
      ADDEXIST: 'Add Existing Checkpoint',
      CREATE: 'Create New Checkpoint',
    },
  },
  ES: {
    BUILDER: 'TBD',
    ADDCHECKPOINT: 'TBD',
    BUTTON: {
      ADDEXIST: 'TBD',
      CREATE: 'TBD',
    },
  },
};
const AddNewLessonFormDict: any = {
  EN: {
    TITLE: 'Lesson Overview',
    NAME: 'Name',
    SELECTTYPE: 'Select Type',
    TYPE: 'Type',
    INSTITUTION: 'Institution',
    SELECTINSTITUTION: 'Select Institution',
    SELECTLANG: 'Select Language',
    LANGUAGE: 'Language',
    SELECTDESIGNER: 'Select Designers',
    DESIGNER: 'Designers',
    PURPOSE: 'Purpose',
    OBJECTIVE: 'Objective',
    MEASUREMENTLESSON: 'Lesson Measurements',
    SELECTMEASURE: 'Select Measurement',
    NO: 'No.',
    MEASUREMENT: 'Measurement',
    TOPIC: 'Topic',
    ACTION: 'Action',

    VALIDATION: {
      NAME: 'Lessson name is required',
      TYPE: 'Lesson type is required',
      INSTITUTE: 'Institute is required field.',
      LANGUAGE: 'Language selection is required',
    },
    MESSAGES: {
      REMOVE: 'Are you sure you want to remove this measurement?',
      ADDERR: 'Error while adding measurement,please try later.',
      SAVE: 'Lesson details saved successfully.',
      SAVEERR: 'Unable to save Lesson details, Please try again later.',
      LESSONNOTHAVE: 'This lesson does not have any measurements, please add new one.',
    },
    NEXT: 'Next',
    SAVE: 'Save',
    SAVING: 'Saving...',
  },
  ES: {
    TITLE: 'TBD',
    NAME: 'TBD',
    SELECTTYPE: 'TBD',
    TYPE: 'TBD',
    INSTITUTION: 'TBD',
    SELECTINSTITUTION: 'TBD',
    SELECTLANG: 'TBD',
    LANGUAGE: 'TBD',
    SELECTDESIGNER: 'TBD',
    DESIGNER: 'TBD',
    PURPOSE: 'TBD',
    OBJECTIVE: 'TBD',
    MEASUREMENTLESSON: 'TBD',
    SELECTMEASURE: 'TBD',
    NO: 'TBD',
    MEASUREMENT: 'TBD',
    TOPIC: 'TBD',
    ACTION: 'TBD',

    VALIDATION: {
      NAME: 'TBD',
      TYPE: 'TBD',
      INSTITUTE: 'TBD',
      LANGUAGE: 'TBD',
    },
    MESSAGES: {
      REMOVE: 'TBD',
      ADDERR: 'TBD',
      SAVE: 'TBD',
      SAVEERR: 'TBD',
      LESSONNOTHAVE: 'TBD',
    },
    SAVE: 'TBD',
    SAVING: 'TBD',
  },
};

const AssessmentInstuctionsDict: any = {
  EN: {
    INSTRUCTION: 'Instructions',
    HEADING: 'INSTRUCTIONS: Complete the following to provide information about your',
    SAVE: 'Save',
    SAVING: 'Saving...',
    MESSAGES: {
      INSTRUCTIONSAVE: 'Instructions details saved.',
      UPDATEERR: 'Error while updating instructions, please try again later.',
    },
  },
  ES: {
    INSTRUCTION: 'TBD',
    HEADING: 'TBD',
    SAVE: 'TBD',
    SAVING: 'TBD',
    MESSAGES: {
      INSTRUCTIONSAVE: 'TBD',
      UPDATEERR: 'TBD',
    },
  },
};

const GeneralInformationDict: any = {
  EN: {
    HEADING: 'Lesson Overview',
    NAME: 'Name',
    SELECTDESIGNER: 'Select Designers',
    DESIGNER: 'Designers',
    PURPOSE: 'Purpose',
    OBJECTIVE: 'Objective',
    LESSONMEASUREMENT: 'Lesson Measurements',
    SELECTMEASUREMENT: 'Select Measurement',
    SELECTTYPE: 'Select Type',
    TYPE: 'Type',
    INSTITUTION: 'Institution',
    SELECTINSTITUTION: 'Select Institution',
    SELECTLANG: 'Select Language',
    LANGUAGE: 'Language',
    NO: 'No.',
    MEASUREMENT: 'Measurement',
    TOPIC: 'Topic',
    ACTION: 'Action',
    BUTTON: {
      ADD: 'Add',
      SAVE: 'Save',
      SAVING: 'Saving...',
    },

    MESSAGES: {
      REMOVE: 'Are you sure you want to remove this measurement?',
      DELETEERR: 'Error while deleting measurement,please try later.',
      ADDERR: 'Error while adding measurement,please try later.',
      NAME: 'Lessson name is required',
      FETCHERR: 'Unable to fetch measurement details, Please try again later.',
      UPDATESUCCESS: 'Lesson details updated successfully.',
      UPDATEERR: 'Unable to update Lesson details, Please try again later.',
      LESSONNOTHAVE: 'This lesson does not have any measurements, please add new one.',
    },
  },
  ES: {
    HEADING: 'TBD',
    NAME: 'TBD',
    SELECTDESIGNER: 'TBD',
    DESIGNER: 'TBD',
    PURPOSE: 'TBD',
    SELECTTYPE: 'TBD',
    OBJECTIVE: 'TBD',
    LANGUAGE: 'Language',
    INSTITUTION: 'TBD',
    LESSONMEASUREMENT: 'TBD',
    SELECTMEASUREMENT: 'TBD',
    NO: 'TBD',
    MEASUREMENT: 'TBD',
    TOPIC: 'TBD',
    ACTION: 'TBD',
    BUTTON: {
      ADD: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD',
    },

    MESSAGES: {
      REMOVE: 'TBD',
      DELETEERR: 'TBD',
      ADDERR: 'TBD',
      NAME: 'TBD',
      FETCHERR: 'TBD',
      UPDATESUCCESS: 'TBD',
      UPDATEERR: 'TBD',
      LESSONNOTHAVE: 'TBD',
    },
  },
};

const PreviousQuestionsDict: any = {
  EN: {
    HEADING: 'Previously Used Questions',
    NO: 'No.',
    QUESTION: 'Question',
    LABEL: 'Label',
    TYPE: 'Type',
    ACTION: 'Action',

    WHERARE: 'Where are you from?',
    WHERYOU: 'Where-youre-from',
    TEXTINPUT: 'text Input',
    ADD: 'Add',
  },
  ES: {
    HEADING: 'TBD',
    NO: 'TBD',
    QUESTION: 'TBD',
    LABEL: 'TBD',
    TYPE: 'TBD',
    ACTION: 'TBD',

    WHERARE: 'TBD',
    WHERYOU: 'TBD',
    TEXTINPUT: 'TBD',
    ADD: 'TBD',
  },
};

const QuestionBuilderDict: any = {
  EN: {
    HEADING: 'Assessment Questions',
    NOTE: 'NOTE: You can drag and drop questions to change the sequence.',
    NO: 'No.',
    QUESTION: 'Question',
    LABEL: 'Label',
    TYPE: 'Type',
    ACTION: 'Action',
    WHERARE: 'Where are you from?',
    WHERYOU: 'Where-youre-from',
    TEXTINPUT: 'text Input',
  },
  ES: {
    HEADING: 'TBD',
    NOTE: 'TBD',
    NO: 'TBD',
    QUESTION: 'TBD',
    LABEL: 'TBD',
    TYPE: 'TBD',
    ACTION: 'TBD',
    WHERARE: 'TBD',
    WHERYOU: 'TBD',
    TEXTINPUT: 'TBD',
  },
};

const UnitLookupDict: any = {
  EN: {
    HEADING: 'Assign Unit',
    NOTE:
      'NOTE: Please select Curricular and then units to add current lesson to that unit.',
    NO: 'No.',
    CURRICULUMNAME: 'Curriculum Name',
    UNITNAME: 'Unit Name',
    STATUS: 'Status',
    ACTION: 'Action',
    NOTADDED: ' This lesson is not added to any curricular or units.',

    MESSAGES: {
      ADDED: 'Lesson added successfully.',
      ADDERR: 'Error while adding lesson to unit, please try later.',
      FETCHERR: 'Error while fetching units Data, Please try again later.',
    },
  },
  ES: {
    HEADING: 'TBD',
    NOTE: 'TBD',
    NO: 'TBD',
    CURRICULUMNAME: 'TBD',
    UNITNAME: 'TBD',
    STATUS: 'TBD',
    ACTION: 'TBD',
    NOTADDED: 'TBD',

    MESSAGES: {
      ADDED: 'TBD',
      ADDERR: 'TBD',
      FETCHERR: 'TBD',
    },
  },
};

const LessonBuilderDict: any = {
  EN: {
    TITLE: 'LESSON PLAN BUILDER',
    SUBTITLE: 'Build lessons, surveys or assessments here.',

    MESSAGES: {
      UNSAVE: 'You have unsaved changes, do you still want to continue?',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',

    MESSAGES: {
      UNSAVE: 'TBD',
    },
  },
};

const LessonEditDict: any = {
  EN: {
    TITLE: 'LESSON PLAN BUILDER',
    SUBTITLE: 'Build lessons, surveys or assessments here.',
    MESSAGES: {
      UNSAVE: 'You have unsaved changes, do you still want to continue?',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    MESSAGES: {
      UNSAVE: 'TBD',
    },
  },
};

const LessonsListDict: any = {
  EN: {
    TITLE: 'LESSONS LIST',
    SUBTITLE: 'All Lessons List',
    SORTBY: 'Sort By',
    NO: 'No.',
    LESSONTITLE: 'Lesson Title',
    TYPE: 'Type',
    LANGUAGE: 'Language',
    ACTION: 'Action',
    NORESULT: 'No Results',
    BUTTON: {
      ADD: 'Add New Lesson',
    },
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    SORTBY: 'TBD',
    NO: 'TBD',
    LESSONTITLE: 'TBD',
    TYPE: 'TBD',
    LANGUAGE: 'TBD',
    ACTION: 'TBD',
    NORESULT: 'TBD',
    BUTTON: {
      ADD: 'TBD',
    },
  },
};

const LessonsListRow: any = {
  EN: {},
  ES: {},
};

const CsvDict: any = {
  EN: {
    TITLE: 'Research & Analytics',
    SELECT_INST: 'Select institute',
    SELECT_CLASSROOM: 'Select classroom',
    SELECT_FILTERS: 'Select Filters',
  },
  ES: {
    TITLE: 'Investigar & Analítica',
    SELECT_INST: 'Seleccione instituto',
    SELECT_FILTERS: 'Seleccione Filtros',
    SELECT_CLASSROOM: 'Seleccione salón de clases',
  },
};

const DashboardDict: any = {
  EN: {
    YOUR_TEACHERS: 'Your Teachers',
    YOUR_CLASSROOMS: 'Your Classrooms',
    YOUR_STUDENTS: 'Your Students',
    YOUR_CLASSMATES: 'Your Classmates',
    GREETINGS_TEACHER: 'What do you want to teach today?',
    GREETINGS_STUDENT: 'What do you want to learn today?',
  },
  ES: {
    YOUR_TEACHERS: 'TBD',
    YOUR_CLASSROOMS: 'TBD',
    YOUR_STUDENTS: 'TBD',
    YOUR_CLASSMATES: 'TBD',
    GREETINGS_TEACHER: 'TBD',
    GREETINGS_STUDENT: 'TBD',
  },
};

function paginationPage(lang: string, page: number, total: number) {
  if (lang === 'EN') return `Showing Page ${page + 1} of ${total} pages`;
  if (lang === 'ES') return `Mostrando página ${page + 1} de ${total} páginas`;
  return '';
}

export {
  CsvDict,
  paginationPage,
  BUTTONS,
  BreadcrumsTitles,
  DashboardDict,
  appDict,
  anthologyDict,
  sideBarLinksDict,
  dashboardProfileDict,
  noticeboardDict,
  staffBuilderDict,
  editClassDict,
  spBuilderDict,
  manageusersDict,
  lessonDict,
  classRoomDict,
  lessonPlannerDict,
  PreviewFormDict,
  InstitutionDict,
  Institute_info,
  InstitutionEditDict,
  InstitutionAddDict,
  Institute_class,
  InstitueCurriculam,
  InstitueRomms,
  classBuilderdict,
  CurricularBuilderdict,
  RoomBuilderdict,
  EditCurriculardict,
  RoomEDITdict,
  curricularviewdict,
  CHECKPOINTSDICT,
  LEARINGOBJECTIVEDICT,
  SYLLABUS,
  Measurementdict,
  TOPICLISTDICT,
  ADDLEARINGOBJDICT,
  addQuestionDict,
  SelectPreviousQuestionDict,
  AddMeasurementDict,
  AddProfileCheckpointDict,
  AddSyllabusDict,
  AddTopicDict,
  EditLearningObjectiveDict,
  EditMeasurementDict,
  EditProfileCheckpointDict,
  EditSyllabusDict,
  EditTopicDict,
  ProfileCheckpointlookupDict,
  RegistrationDict,
  UserDict,
  UserEditDict,
  UserInformationDict,
  UserLookupDict,
  UserLookupWithTokenDict,
  AddQuestionModalDict,
  AddNewCheckPointDict,
  AddNewQuestionDict,
  CheckpointLookupDict,
  CheckpointQueTableDict,
  EditCheckPointDict,
  EditQuestionDict,
  QuestionLookupDict,
  SelectedCheckPointsListDict,
  AddNewLessonFormDict,
  AssessmentInstuctionsDict,
  GeneralInformationDict,
  PreviousQuestionsDict,
  QuestionBuilderDict,
  UnitLookupDict,
  LessonBuilderDict,
  LessonEditDict,
  LessonsListDict,
  EditQuestionModalDict,
};
