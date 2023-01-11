// Authentication pages
const AuthDict: any = {
  EN: {
    VERIFY_EMAIL: 'Verify Email',
    LOGIN: 'Log In'
  },
  ES: {
    VERIFY_EMAIL: 'TBD',
    LOGIN: 'TBD'
  }
};

// Buttons
const BUTTONS: any = {
  EN: {
    ADD: 'Add',
    ADD_NEW: 'Add New',
    DELETE: 'Delete',
    EDIT: 'Edit',
    SAVE: 'Save',
    SAVING: 'Saving',
    CANCEL: 'Cancel',
    PUBLISH: 'Publish',
    YES: 'Yes',
    CREATE: 'Create',

    CREATING: 'Creating'
  },
  ES: {
    ADD: 'Añadir',
    ADD_NEW: 'Añadir nuevo',
    DELETE: 'TBD',
    EDIT: 'Edit',
    SAVE: 'Salvar',
    SAVING: 'TBD',
    CANCEL: 'Cancelar',
    PUBLISH: 'TBD',
    YES: 'TBD',
    CREATE: 'TBD',
    CREATING: 'TBD'
  }
};

// Breadcrumbs
const BreadcrumsTitles: any = {
  EN: {
    HOME: 'Home',
    PROFILE: 'PROFILE',
    TEST_CASES: 'TEST CASES',
    PEOPLE: 'PEOPLE',
    INSTITUTION_MANAGEMENT: 'Institution Management',
    ADD_INSTITUTION: 'Add New Institute',
    INSTITUTION_INFO: 'Institute Info',
    INSTITUTION_GENERAL_INFO: 'General Information',
    Class_Creation: 'Class Creation',
    CURRICULARBUILDER: 'New Course',
    CURRICULUM: 'Course',
    COURSES: 'Courses',
    UNITS: 'Units',
    CLASSROOM_CREATION: 'Classroom Creation',
    CLASSROOMS: 'Classrooms',
    CLASSROOM: 'Classroom',
    CLASSES: 'Classes',
    EDITCLASS: 'Edit Class',
    EDITCURRICULUM: 'Edit Course',
    EDITCLASSROOM: 'Edit Classroom',
    CURRICULUMBUILDER: 'Course Builder',
    LEARINGOBJECTIVE: 'Add Learning objective',
    AddMeasurement: 'Add Measurement',
    AddCheckpint: 'Add Checkpoint',
    UnitBuilder: 'Unit Builder',
    COURSE_BUILDER: 'Course Builder',
    AddTopic: 'Add Topic',
    EditLearningObj: 'Edit Learning objective',
    EditMeasurement: 'Edit Measurement',
    AddChekpoint: 'Add Checkpoint',
    EditTopic: 'Edit Topic',
    AddExistingCheckpoint: 'Add Existing Checkpoint',
    STAFF: 'Staff Manager',
    PeopleManagment: 'People Management',
    AddNewUser: 'Add New User',
    USERS: 'User Manager',
    UserInfo: 'User Information',
    LESSONS: 'Lessons',
    LESSONPLANBUILDER: 'Lesson Plan Builder',
    LESSON_BUILDER: 'Lesson Builder',
    LESSON_EDITOR: 'Lesson Editor',
    STUDENTS: 'Students',
    STUDENTS_NOTEBOOK: 'Students Notebook',
    ADD_NEW_LESSON_PLAN: 'Add new lesson plan',
    LOADING: 'Loading...',
    COMMUNTIY: 'S/B Community Builder'
  },
  ES: {
    HOME: 'CASA',
    PROFILE: 'PERFIL',
    PEOPLE: 'PERSONAS',
    INSTITUTION_MANAGEMENT: 'TBD',
    ADD_INSTITUTION: 'TBD',
    INSTITUTION_INFO: 'TBD',
    INSTITUTION_GENERAL_INFO: 'TBD',
    Class_Creation: 'TBD',
    CURRICULUM: 'TBD',
    COURSES: 'TBD',
    CURRICULARBUILDER: 'TBD',
    CLASSROOM_CREATION: 'TBD',
    CLASSROOMS: 'TBD',
    CLASSROOM: 'TBD',
    EDITCLASS: 'TBD',
    EDITCURRICULUM: 'TBD',
    EDITCLASSROOM: 'TBD',
    CLASSES: 'TBD',
    CURRICULUMBUILDER: 'TBD',
    LEARINGOBJECTIVE: 'TBD',
    AddMesurement: 'TBD',
    COMMUNTIY: 'TBD',
    AddCheckpint: 'TBD',
    UnitBuilder: 'TBD',
    AddTopic: 'TBD',
    EditLearningObj: 'TBD',
    EditMeasurement: 'TBD',
    AddChekpoint: 'TBD',
    EditTopic: 'TBD',
    AddExistingCheckpoint: 'TBD',
    STAFF: 'TBD',
    PeopleManagment: 'TBD',
    AddNewUser: 'TBD',
    UserInfo: 'TBD',
    LESSONS: 'TBD',
    LESSONPLANBUILDER: 'TBD',
    LESSON_EDITOR: 'TBD',
    STUDENTS: 'TBD',
    STUDENTS_NOTEBOOK: 'TBD'
  }
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
      PASSWORD: 'Password',
      PASSCODE: 'Journal Passcode',
      SUPER_ADMIN: 'Super Admin'
    },
    INSTITUTION_INFO: {
      TITLE: 'Institution Information',
      INSTITUTION: 'Institution',
      GRADE: 'Grade'
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
      CANCEL: 'Cancel'
    },
    CHANGE_PASSCODE: {
      TITLE: 'Change your Passcode',
      INFO:
        'Passcode must be at least 4 alphanumeric characters (no spaces or special characters)',
      OLD_PASS: 'Login Password',
      NEW_PASS: 'New Passcode',
      SAVE: 'Save New Passcode',
      CANCEL: 'Cancel',
      SUCCESS_MSG: 'Success',
      WARN_MSG:
        'This will log you out and take you to the reset password page, do you want to continue?',
      CONTINUE_BTN: 'Continue',
      ERRORS: {
        NO_OLD_PASS: 'Please enter your password',
        NO_NEW_PASS: 'Please enter your new password',
        NO_CONFIRM_PASS: 'Please enter your confirmation password',
        NOT_MATCH: 'Your new password and confirm password do not match'
      }
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
        NOT_MATCH: 'Your new password and confirm password do not match'
      }
    }
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
      PASSWORD: 'contraseña',
      PASSCODE: 'Journal Passcode',
      ROLE: 'Papel'
    },
    INSTITUTION_INFO: {
      TITLE: 'Información institucional',
      INSTITUTION: 'Institución',
      GRADE: 'Grado'
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
      CANCEL: 'Cancelar'
    },
    CHANGE_PASSCODE: {
      TITLE: 'Change your Passcode',
      INFO:
        'Passcode must be at least 4 alphanumeric characters (no spaces or special characters)',
      OLD_PASS: 'Login Password',
      NEW_PASS: 'New Passcode',
      SAVE: 'Save New Passcode',
      CANCEL: 'Cancel',
      SUCCESS_MSG: 'Success',
      WARN_MSG:
        'This will log you out and take you to the reset password page, do you want to continue?',
      CONTINUE_BTN: 'Continue',
      ERRORS: {
        NO_OLD_PASS: 'Please enter your old password',
        NO_NEW_PASS: 'Please enter your new password',
        NO_CONFIRM_PASS: 'Please enter your confirmation password',
        NOT_MATCH: 'Your new password and confirm password do not match'
      }
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
        NOT_MATCH: 'Su nueva contraseña y la contraseña de confirmación no coinciden'
      }
    }
  }
};

const dashboardTestCasesDict: any = {
  EN: {
    PROFILE: 'Test Cases',
    TITLE: 'TEST CASES',
    SUBTITLE: 'This contains test cases information.',
    EDIT_TEST_CASES: {
      TEST_ID: 'Test ID',
      TEST_NAME: 'Test Name',
      TEST_TYPE: 'Test Type',
      TEST_STEPS: 'Test Steps',
      TEST_DATA: 'Test Data',
      TEST_EXP_RESULTS: 'Test Expected Results',
      TEST_EDGE_CASES: 'Test Edge Cases',
      SAVE: 'Save',
      CANCEL: 'Cancel'
    }
  }
};

const anthologyDict: any = {
  EN: {
    TITLE_CONTAINER: 'Your Notebooks',
    TITLE: 'Notebook',
    NO_SELECTED: 'No notebook selected...',
    TABS: {
      A: 'Journal',
      B: 'Class Work',
      C: 'Class Notes',
      D: 'Uploads'
    },
    ACTIONS: {
      EDIT: 'Edit',
      SAVE: 'Save',
      CREATE: 'New Entry',
      ADD: 'Add More',
      CANCEL: 'Cancel',
      DELETE: 'Delete',
      CONFIRM: 'Confirm',
      UPLOAD: 'Upload'
    }
  },
  ES: {
    TITLE_CONTAINER: 'T.B.D',
    TITLE: 'Cuaderno',
    NO_SELECTED: 'T.B.D',
    TABS: {
      A: 'Diario',
      B: 'trabajo en clase',
      C: 'Apuntes de clase',
      D: 'Uploads'
    },
    ACTIONS: {
      EDIT: 'Editar',
      SAVE: 'Salvar',
      CREATE: 'Crear',
      ADD: 'Añadir más',
      CANCEL: 'Cancelar',
      DELETE: 'Deletar',
      CONFIRM: 'Confirm',
      UPLOAD: 'Upload'
    }
  }
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
      ACTIONS: 'Actions'
    },
    ADD_NEW: 'Add New User'
  },
  ES: {
    TITLE: 'GESTIÓN DE USUARIOS',
    SUBTITLE: 'Lista de personas',
    TABLE: {
      NAME: 'Nombre',
      ROLE: 'Papel',
      INST: 'Institución',
      STATUS: 'Estado',
      ACTIONS: 'Comportamiento'
    },
    ADD_NEW: 'Agregar persona'
  }
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
    UNIVERSAL_LESSON_BUILDER: 'Universal Builder',
    ANTHOLOGY: 'Notebooks',
    NOTICEBOARD: 'Noticeboard',
    NOTEBOOK: 'Notebook',
    DASHBOARD: 'Dashboard',
    RESEARCHANALYTICS: 'Research & Analytics'
  },
  ES: {
    REGISTRATION: 'Registro',
    INSTITUTIONS: 'Institución',
    PEOPLE: 'Personas',
    LESSON_PLANNER: 'Pasillo',
    CLASSROOM: 'Aula',
    NOTEBOOK: 'Computadora portátil',
    LESSON_BUILDER: 'Constructor de lecciones',
    UNIVERSAL_LESSON_BUILDER: 'Constructor Universal',
    ANTHOLOGY: 'Cuaderno',
    NOTICEBOARD: 'Tablón de anuncios',
    RESEARCHANALYTICS: 'Investigación y Análisis'
  }
};

const appDict: any = {
  EN: {
    LOG_OUT: 'Log Out',
    LOADING: 'Give us one second, this section is loading...'
  },
  ES: {
    LOG_OUT: 'Cerrar sesión',
    LOADING: 'esta sección se está cargando...'
  }
};

const staffBuilderDict: any = {
  EN: {
    TITLE: 'STAFF MEMBERS',
    ADD_PLACEHOLDER: 'Add new',
    ADD_SUPER_ADMIN_PLACEHOLDER: 'Add new Super Admin',
    ADD_SUPER_ADMIN: 'Existing Super Admin',
    ADD_BUTTON: 'ADD',
    NO: 'No.',
    NAME: 'Name',
    ROLE: 'Role',
    INSTITUTION_NAME: 'Institution Name',
    STATUS: 'Status',
    ACTION: 'Action',
    UPDATING: 'updating...',
    CANCEL: 'Cancel',
    INFO: 'This institute does not have any staff member. Please add new member.',
    LOADING: 'Loading...',
    STATUS_PLACEHOLDER: 'Select Status',
    EDIT: 'Edit'
  },
  ES: {
    TITLE: 'MIEMBROS DEL PERSONAL',
    ADD_PLACEHOLDER: 'Añadir nuevo',
    ADD_BUTTON: 'Añadir',
    NO: 'TBD',
    NAME: 'TBD',
    ROLE: 'TBD',
    INSTITUTION_NAME: 'TBD',
    STATUS: 'TBD',
    ACTION: 'TBD',
    UPDATING: 'TBD',
    CANCEL: 'TBD',
    INFO: 'TBD',
    LOADING: 'TBD',
    STATUS_PLACEHOLDER: 'TBD',
    EDIT: 'TBD'
  }
};

const spBuilderDict: any = {
  EN: {
    TITLE: 'SERVICE PROVIDERS',
    ADD_PLACEHOLDER: 'Add a new service vendor',
    ADD_BUTTON: 'ADD',
    NO: 'NO.',
    SERVICE: 'Service Vendors',
    STATUS: 'Status',
    ACTION: 'Actions',
    UPDATING: 'updating...',
    CANCEL: 'Cancel',
    INFO:
      'This institute does not have any service vendor. Please add new service vendor.'
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
    INFO: 'TBD'
  }
};

const editClassDict: any = {
  EN: {
    TITLE: 'EDIT CLASS',
    SUBTITLE: 'Edit class information',
    NAME_INPUT_LABEL: 'Class Name',
    STUDENTS: 'STUDENTS',
    ADD_STUDENT_PLACEHOLDER: 'Select student',
    ADD_STUDENT_LABEL: 'Add students to class',
    ADD_STUDENT_FROM_REGSITER: 'Add students from register to class',
    ADD_STUDENT_BUTTON: 'Add',
    GROUP: 'Group',
    GROUP_PLACEHOLDER: 'Select Group',
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
      unableupdate: 'Unable to update class details. Please try again later.'
    },
    TABLE: {
      SNO: 'No.',
      NAME: 'Participant Name',
      GROUP: 'Group',
      STATUS: 'Location Status',
      DATE: 'Date Added',
      ACTIONS: 'Actions'
    }
  },
  ES: {
    TITLE: 'EDITAR CLASE',
    SUBTITLE: 'Editar la información de la clase',
    NAME_INPUT_LABEL: 'Nombre de la clase',
    STUDENTS: 'ALUMNAS',
    ADD_STUDENT_PLACEHOLDER: 'Agregar nuevo alumno',
    ADD_STUDENT_LABEL: 'TBD',
    ADD_STUDENT_FROM_REGSITER: 'TBD',
    ADD_STUDENT_BUTTON: 'Añadir',
    GROUP: 'TBD',
    GROUP_PLACEHOLDER: 'TBD',
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
      unableupdate: 'TBD'
    },
    TABLE: {
      SNO: 'No.',
      NAME: 'nombre del estudiante',
      GROUP: 'TBD',
      STATUS: 'estado',
      DATE: 'TBD',
      ACTIONS: 'comportamiento'
    }
  }
};

const lessonDict: any = {
  EN: {
    CLASS: 'Class',
    TOPIC_CONNECTION: 'SEL Connection',
    KEYWORDS: 'Keywords',
    REFLECTION_QUESTIONS: 'Class Discussion'
  },
  ES: {
    CLASS: 'Class',
    TOPIC_CONNECTION: 'SEL Connection',
    KEYWORDS: 'Keywords',
    REFLECTION_QUESTIONS: 'Class Discussion'
  }
};

const noticeboardDict: any = {
  EN: {
    JOIN_CALL: {
      DEFAULT: 'Join Call',
      ZOOM: 'Join Zoom Call',
      MEET: 'Join Meet Call',
      TEAMS: 'Join Teams Call'
    },
    DOWNLOAD: 'Download',
    SECTION_TITLE: {
      ROOM_SELECTOR: 'Room Selector',
      WIDGET_MANAGER: 'Widget Manager'
    },
    ROOMS: {
      NONE: 'No rooms found'
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
      PLEASE_ADD: 'Please add'
    },
    WIDGET_DESCRIPTION: {
      TEXT:
        'This is the default text widget. Use this if you want to show a text message/notice to students in your room.',
      QUOTES:
        'Add multiple quotes above the lessons or to the side widget bar to inspire your students.',
      CALL:
        "This is a basic widget to post the zoom/meet/teams links you'll use to communicate with your students.",
      FILE:
        'This is a basic widget to share your drive/onedrive/dropbox files for student assignments etc.'
    }
  },
  ES: {
    JOIN_CALL: {
      DEFAULT: 'Unirse a la llamada',
      ZOOM: 'Unirse a la llamada Zoom',
      MEET: 'Unirse a la llamada Meet',
      TEAMS: 'Unirse a la llamada Teams'
    },
    DOWNLOAD: 'Descargar',
    SECTION_TITLE: {
      ROOM_SELECTOR: 'Selector de Habitación',
      WIDGET_MANAGER: 'Administrador de Widgets'
    },
    ROOMS: {
      NONE: 'No se encontraron habitaciones'
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
      PLEASE_ADD: 'Por favor añadir'
    },
    WIDGET_DESCRIPTION: {
      TEXT:
        'Este es el widget de texto predeterminado. Use esto si desea mostrar un mensaje de texto / aviso a los estudiantes en su habitación.',
      QUOTES:
        'Agregue varias citas sobre las lecciones o en la barra de widgets lateral para inspirar a sus estudiantes.',
      CALL:
        'Este es un widget básico para publicar los enlaces zoom / meet / teams que usará para comunicarse con sus estudiantes.',
      FILE:
        'Este es un widget básico para compartir sus archivos de drive / onedrive / dropbox para tareas de estudiantes, etc..'
    }
  }
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
    STEP: 'Step',
    UNIT_TITLE: 'Select Unit',
    UNIT_SUB_TITLE: 'Select unit for list of corresponding lessons',
    LESSON_TITLE: 'Select Lesson',
    LESSON_SUB_TITLE: 'Click on lesson you want to teach',
    LESSON_SUB_TITLE_ASYNC:
      'You are currently following lessons "self-paced", which means that you can enter any lesson at any time',
    BOTTOM_BAR: {
      START: 'START',
      DISABLE: 'DISABLE',
      ENABLE: 'ENABLE',
      TEACH: 'TEACH',
      ACTIVE: 'ACTIVE',
      COMPLETED: 'COMPLETED',
      OPENED: 'OPEN',
      CLOSED: 'CLOSED',
      SURVEY: 'SURVEY',
      UPCOMING: 'UPCOMING',
      GO_TO_NOTEBOOK: 'Go to Notebook'
    },
    LESSON_TABS: {
      TAB_ONE: `Today's Lesson`,
      TAB_TWO: 'Teach Lessons'
    },
    MESSAGES: {
      SELECT_SYLLABUS: 'Select a cohort to see applicable units...',
      NO_SYLLABUS: 'No units...',
      SELECT_CLASSROOM: 'Select a classroom to see applicable lessons...',
      NO_LESSONS: 'No lessons...',
      SELECT_CLASSROOM_WIDGETS: '⬆ Select a room to see editable widgets...',
      PLEASE_WAIT: 'Please wait'
    }
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
    STEP: 'TBD',
    UNIT_TITLE: 'TBD',
    UNIT_SUB_TITLE: 'TBD',
    LESSON_TITLE: 'TBD',
    LESSON_SUB_TITLE: 'TBD',
    LESSON_SUB_TITLE_ASYNC:
      'You are currently following lessons "self-paced", which means that you can enter any lesson at any time',
    BOTTOM_BAR: {
      START: 'TBD',
      DISABLE: 'TBD',
      ENABLE: 'TBD',
      TEACH: 'TBD',
      ACTIVE: 'TBD',
      COMPLETED: 'TBD',
      OPENED: 'TBD',
      CLOSED: 'TBD',
      SURVEY: 'TBD',
      UPCOMING: 'TBD'
    },
    LESSON_TABS: {
      TAB_ONE: `TBD`,
      TAB_TWO: 'TBD'
    },
    MESSAGES: {
      SELECT_SYLLABUS: 'Select a cohort to see applicable units...',
      NO_SYLLABUS: 'No units...',
      SELECT_CLASSROOM: 'Select a classroom to see applicable lessons...',
      NO_LESSONS: 'No lessons...',
      SELECT_CLASSROOM_WIDGETS: 'Select a room to see editable widgets...',
      PLEASE_WAIT: 'TBD'
    }
  }
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
      ROOM_NAME: 'Room',
      STUDDENT_ONLINE: 'Class Size',
      TOPIC: 'Topic',
      START_DATE: 'Start Date',
      EST_TIME: 'Scheduled Lesson Time',
      LESSON_CONTROL: 'Lesson Control',
      COLUMN: {
        ONE: 'Name',
        TWO: 'Current Page',
        THREE: 'Action'
      },
      STUDENT_SECTION: {
        IN_CLASS: 'In Classroom',
        NOT_IN_CLASS: 'Not In Classroom',
        ON_DEMAND: 'Self Paced (Not Online/Lesson)'
      }
    },
    ACCESS_BUTTONS: {
      START: 'Start',
      COMPLETE: 'Complete'
    }
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
      ROOM_NAME: 'TBD',
      STUDDENT_ONLINE: 'TBD',
      TOPIC: 'TBD',
      START_DATE: 'TBD',
      EST_TIME: 'TBD',
      LESSON_CONTROL: 'TBD',
      COLUMN: {
        ONE: 'TBD',
        TWO: 'TBD',
        THREE: 'TBD'
      },
      STUDENT_SECTION: {
        IN_CLASS: 'Student Roster',
        NOT_IN_CLASS: 'Not In Class',
        ON_DEMAND: 'On Demand'
      }
    },
    ACCESS_BUTTONS: {
      START: 'TBD',
      COMPLETE: 'TBD'
    }
  }
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
      FETCHERR: 'Error while fetching units for this lesson.Please try after some time.'
    },
    PREVIEW_DETAILS: {
      WARN_MESSAGE:
        'Changes will applay to all assigned lesson plans. Do you want to continue?',
      TITLE: 'Preview Details'
    }
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
      FETCHERR: 'TBD'
    },
    PREVIEW_DETAILS: {
      WARN_MESSAGE: 'TBD',
      TITLE: 'TBD'
    }
  }
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
      NORESULT: 'No Results'
    },
    SHOWPAGE: 'Showing Page',
    OF: 'of',
    PAGES: 'pages',
    SORTBY: 'Sort By',

    BUTTON: {
      Add: 'Add New Institution'
    }
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
      NORESULT: 'TBD'
    },
    SHOWPAGE: 'TBD',
    OF: 'TBD',
    PAGES: 'TBD',
    SORTBY: 'TBD',
    BUTTON: {
      Add: 'TBD'
    }
  }
};

const Institute_info: any = {
  EN: {
    TITLE: 'General Information',
    ADDRESS: 'Address',
    CONTACT: 'Contact No',
    INSTITUTION_TYPE: 'Institution Type',
    WEBSITE: 'Visit Their Website',
    SERVICE_PROVIDER: 'Service Provider',
    TABS: {
      SERVICE_PROVIDER: 'Service Providers',
      STAFF: 'Staff Manager',
      CLASS_MANAGER: 'Classroom Builder',
      LIVE_CLASS_ROOM: 'Live Classroom',
      COURSE_MANAGER: 'Course Builder',
      COURSES: 'Course Manager',
      UNITS: 'Unit Manager',
      COMMUNITY_MANAGER: 'Community Manager',
      INSTITUTION_MANAGER: 'Institution Manager',
      CLASSES: 'Classes',
      STUDENT_ROASTER: 'Student Roster',
      CURRICULAR: 'Course',
      CLASSROOMS: 'Classroom Manager',
      GENERAL_INFORMATION: 'General Information',
      LESSONS: 'Lesson Manager',
      RESEARCH_AND_ANALYTICS: 'Analytics Manager',
      DOWNLOAD_SURVEYS: 'Download Surveys',
      UPLOAD_SURVEY: 'Upload Survey',

      DOWNLOAD_CSV: 'Download Surveys',
      UPLOAD_CSV: 'Upload Surveys',
      UPLOAD_TO_ATHENA: 'Upload to Athena',
      HOME: 'Dashboard',
      NOTEBOOK: 'Notebook',
      COMMUNITY: 'Community',
      GAME_CHANGERS: 'Game Changers'
    }
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
      LIVE_CLASS_ROOM: 'TBD',
      CURRICULAR: 'TBD',
      CLASSROOMS: 'TBD',
      STUDENT_ROASTER: 'TBD',
      DOWNLOAD_SURVEYS: 'TBD',
      GENERAL_INFORMATION: 'TBD',
      LESSONS: 'TBD',
      RESEARCH_AND_ANALYTICS: 'TBD',
      HOME: 'TBD',
      COMMUNITY: 'TBD',
      NOTEBOOK: 'TBD',
      GAME_CHANGERS: 'TBD'
    }
  }
};

const InstitutionEditDict: any = {
  EN: {
    INFO: 'Click the circle above to update institution image.',

    FORM: {
      TITLE: 'General Information and Vendor Management',
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
      SERVICEPROVIDER_LABEL_WITH_NAME: 'is a Service Provider',
      SERVICEPROVIDER_LABEL_WITHOUT_NAME: 'Service Provider'
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'School',
      AFTERSCHOOL: 'After School',
      DAYCAMP: 'Day Camp',
      SUMMERCAMP: 'Summer Camp',
      C3: '501C3'
    },
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save'
    },
    messages: {
      namerequired: 'Institute name is required.',
      typerequired: 'Institute type is required.',
      unabletoupdate: 'Unable to update institute details. Please try again later.',
      saveMsg: 'Institution details saved successfully',
      uploaderr: 'Unable to upload image. Please try again later. ',
      deleterr: 'Error in deleting institute image.',
      imgeerr: 'Unable to update image changes. Please try again later.'
    }
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
      SERVICEPROVIDER_LABEL: 'TBD'
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'TBD',
      AFTERSCHOOL: 'TBD',
      DAYCAMP: 'TBD',
      SUMMERCAMP: 'TBD',
      C3: 'TBD'
    },
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD'
    },
    messages: {
      namerequired: 'TBD',
      typerequired: 'TBD',
      unabletoupdate: 'TBD',
      uploaderr: 'TBD',
      deleterr: 'TBD',
      imgeerr: 'TBD'
    }
  }
};

const InstitutionAddDict: any = {
  EN: {
    INFOA: 'Click circle to manage your avatar.',
    INFO: 'Click the circle above to update institution image.',
    TITLE: 'Add Institution',
    SUBTITLE: 'Add new institution to the list',
    FORM: {
      TITLE: 'General Information and Vendor Management',
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
      SERVICEPROVIDER_LABEL_WITH_NAME: 'is a Service Provider',
      SERVICEPROVIDER_LABEL_WITHOUT_NAME: 'Service Provider'
    },
    SERVICE_VENDORS: 'Service Vendors',
    INSTITUTION_TYPE: {
      SCHOOL: 'School',
      AFTERSCHOOL: 'After School',
      DAYCAMP: 'Day Camp',
      SUMMERCAMP: 'Summer Camp',
      C3: '501C3'
    },
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save'
    },
    messages: {
      namerequired: 'Institute name is required.',
      saveMsg: 'Institution details saved successfully',
      uploaderr: 'Unable to upload image. Please try again later. ',
      adderr: 'Unable to add new institute. Please try again later.'
    }
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
      SERVICEPROVIDER_LABEL: 'TBD'
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'TBD',
      AFTERSCHOOL: 'TBD',
      DAYCAMP: 'TBD',
      SUMMERCAMP: 'TBD',
      C3: 'TBD'
    },
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD'
    },
    messages: {
      namerequired: 'TBD',
      uploaderr: 'TBD',
      adderr: 'TBD'
    }
  }
};

const InstitutionBuilderDict: any = {
  EN: {
    GENERAL_INFORMATION: 'General Information',
    INFOA: 'Click circle to manage your avatar.',
    INFO: 'Click the circle above to update institution image.',
    TITLE: 'Add Institution',
    SUBTITLE: 'Add new institution to the list',
    FORM: {
      TITLE: 'General Information and Vendor Management',
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
      SERVICEPROVIDER_LABEL_WITH_NAME: 'is a Service Provider',
      SERVICEPROVIDER_LABEL_WITHOUT_NAME: 'Service Provider'
    },
    SERVICE_VENDORS: 'Service Vendors',
    INSTITUTION_TYPE: {
      SCHOOL: 'School',
      AFTERSCHOOL: 'After School',
      DAYCAMP: 'Day Camp',
      SUMMERCAMP: 'Summer Camp',
      C3: '501C3'
    },
    BUTTON: {
      CANCEL: 'Cancel',
      SAVE: 'Save'
    },
    messages: {
      namerequired: 'Institute name is required.',
      saveMsg: 'Institution details saved successfully',
      uploaderr: 'Unable to upload image. Please try again later. ',
      adderr: 'Unable to add new institute. Please try again later.'
    }
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
      SERVICEPROVIDER_LABEL: 'TBD'
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'TBD',
      AFTERSCHOOL: 'TBD',
      DAYCAMP: 'TBD',
      SUMMERCAMP: 'TBD',
      C3: 'TBD'
    },
    BUTTON: {
      CANCEL: 'TBD',
      SAVE: 'TBD'
    },
    messages: {
      namerequired: 'TBD',
      uploaderr: 'TBD',
      adderr: 'TBD'
    }
  }
};

const Institute_class: any = {
  EN: {
    TITLE: 'INSTITUTE CLASSES',
    NO: 'No.',
    CLASSNAME: 'Class Name',
    ACTION: 'Actions',
    EDIT: 'Edit',
    INFO: 'This institute does not have any class. Please create a new class.',
    BUTTON: {
      ADD: 'New class'
    }
  },
  ES: {
    TITLE: 'TBD',
    NO: 'TBD',
    CLASSNAME: 'TBD',
    ACTION: 'TBD',
    EDIT: 'Editar',
    INFO: 'TBD',
    BUTTON: {
      ADD: 'TBD'
    }
  }
};
const InstitueCurriculum: any = {
  EN: {
    TITLE: 'Courses',
    BUTTON: {
      ADD: 'New Course'
    },
    NO: 'No.',
    NAME: 'Course Name',
    INSTITUTION_NAME: 'Institution Name',
    COURSE_TYPE: 'Course Type',
    UNITS: 'Units',
    ACTION: 'Actions',
    VIEW: 'View',
    INFO: 'This institute does not have any course. Please create a new course.',
    NO_DELETE: '(Course in use)',
    LOADING: 'Loading Courses...',
    SELECT_INSTITUTION: 'Select Institution'
  },
  ES: {
    TITLE: 'TBD',
    BUTTON: {
      ADD: 'TBD'
    },
    NO: 'TBD',
    NAME: 'TBD',
    INSTITUTION_NAME: 'TBD',
    COURSE_TYPE: 'TBD',
    UNITS: 'TBD',
    LESSONS: 'TBD',
    ACTION: 'TBD',
    VIEW: 'TBD',
    INFO: 'TBD',
    NO_DELETE: 'TBD',
    LOADING: 'TBD',
    SELECT_INSTITUTION: 'TBD'
  }
};

const InstitueRomms: any = {
  EN: {
    TITLE: 'Classroom List',
    NO: 'No.',
    CLASSROOMS_NAME: 'Classroom Name',
    CLASS_NAME: 'Class Name',
    INSTITUTION_NAME: 'Institution Name',
    TEACHER: 'Teacher',
    CO_TEACHER: 'Co Teachers',
    CURRICULUM: 'Course',
    STATUS: 'Status',
    MXSTUDENTS: 'Max. Students',
    ACTION: 'Actions',
    EDIT: 'Edit',
    messages: {
      nothaveclass:
        'This institute does not have any classroom. Please create a new classroom.',
      fetcherr: 'Error while fetching classroom data please Try again later.'
    },
    BUTTON: {
      ADD: 'New Classroom'
    },
    LOADING: 'Loading Classrooms...',
    SELECT_STAFF: 'Select Staff',
    SELECT_INSTITUTION: 'Select Institution'
  },
  ES: {
    TITLE: 'TBD',
    NO: 'TBD',
    CURRICULUM: 'TBD',
    CLASSROOMS_NAME: 'TBD',
    CLASS_NAME: 'TBD',
    CO_TEACHER: 'TBD',
    INSTITUTION_NAME: 'TBD',
    TEACHER: 'TBD',
    MXSTUDENTS: 'TBD',
    ACTION: 'TBD',
    EDIT: 'Editar',
    messages: {
      nothaveclass: 'TBD',
      fetcherr: 'TBD'
    },
    BUTTON: {
      ADD: 'TBD'
    },
    LOADING: 'Cargando aulas...',
    SELECT_STAFF: 'TBD',
    SELECT_INSTITUTION: 'TBD'
  }
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
      SAVING: 'Saving...'
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
          'Invalid path please go back to institution selection page to select your institute.'
      },
      VALIDATION: {
        NAME: 'Class name is required please enter.',
        INSTITUTE: 'Please select an institute to add class.',
        CLASSNAME: 'This class name is already exist, please add another name.'
      },
      SUCCESS: {
        CLASSSAVE: 'New class details has been saved.'
      }
    }
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
        INVALIDPATH: 'TBD'
      },
      VALIDATION: {
        NAME: 'TBD',
        INSTITUTE: 'TBD',
        CLASSNAME: 'TBD'
      },
      SUCCESS: {
        CLASSSAVE: 'TBD'
      }
    },

    BUTTON: {
      ADD: 'TBD',
      SAVE: 'TBD',
      SAVING: 'TBD'
    }
  }
};

const CourseBuilderDict: any = {
  EN: {
    TITLE: 'Create New Course',
    SUBTITLE: 'Add new course to the list',
    HEADING: 'COURSE INFORMATION',
    NAME: 'Course Name',
    LANGUAGE: 'Select Language',
    DESIGNER: 'Select Designers',
    TYPE: 'Select Type',
    SUMMARY: 'Summary',
    DESCRIPTION: 'Description',
    OBJECT: 'Objective',
    ADD_NEW_UNIT: 'New Unit',
    SELECT_UNIT: 'Select Unit',
    NO_UNIT: 'No units assigned to course',
    TABLE_HEADS: {
      NUMBER: 'No.',
      LESSONS: 'Lessons',
      OBJECTIVES: 'Objective',
      UNIT_NAME: 'Unit Name',
      ACTION: 'Actions'
    },
    MESSAGES: {
      ERROR: {
        save: 'Unable to save new course please try again later.',
        fetch: 'Unable to fetch institution list pleas try later.',
        designerlist: 'Error while fetching Designers list Please try again later.',
        process: 'Error while processing please Try again later.',
        invalid:
          'Invalid path please go back to institution selection page to select your institute.',
        FETCH_COURSE_ERR: 'Error while fetching course data, please try again later.',
        FETCH_UNIT_ERR: 'Error while fetching units, please try again later.'
      },
      validation: {
        name: 'Course name is required please enter name.',
        institute: 'Please select an institute to add course.',
        curricular: 'This course name is already exist, please add another name.'
      },
      success: {
        save: 'New Course has been saved.'
      }
    },
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...'
    }
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    LANGUAGE: 'TBD',
    DESIGNER: 'TBD',
    TYPE: 'TBD',
    SUMMARY: 'TBD',
    DESCRIPTION: 'TBD',
    OBJECT: 'TBD',
    messages: {
      error: {
        save: 'TBD',
        fetch: 'TBD',
        designerlist: 'TBD',
        process: 'TBD',
        invalid: 'TBD'
      },
      validation: {
        name: 'TBD',
        institute: 'TBD',
        curricular: 'TBD'
      },
      success: {
        save: 'TBD'
      }
    },
    BUTTON: {
      SAVE: 'TBD',
      SAVING: 'TBD'
    }
  }
};

const CurricularBuilderdict: any = {
  EN: {
    TITLE: 'Create New Course',
    SUBTITLE: 'Add new course to the list',
    HEADING: 'COURSE INFORMATION',
    NAME: 'Course Name',
    LANGUAGE: 'Select Language',
    DESIGNER: 'Select Designers',
    TYPE: 'Select Type',
    SUMMARY: 'Summary',
    DESCRIPTION: 'Description',
    OBJECT: 'Objective',
    messages: {
      error: {
        save: 'Unable to save new course please try again later.',
        fetch: 'Unable to fetch institution list pleas try later.',
        designerlist: 'Error while fetching Designers list Please try again later.',
        process: 'Error while processing please Try again later.',
        invalid:
          'Invalid path please go back to institution selection page to select your institute.'
      },
      validation: {
        name: 'Course name is required please enter name.',
        institute: 'Please select an institute to add course.',
        curricular: 'This course name is already exist, please add another name.'
      },
      success: {
        save: 'New course has been saved.'
      }
    },
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...'
    }
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    LANGUAGE: 'TBD',
    DESIGNER: 'TBD',
    TYPE: 'TBD',
    SUMMARY: 'TBD',
    DESCRIPTION: 'TBD',
    OBJECT: 'TBD',
    messages: {
      error: {
        save: 'TBD',
        fetch: 'TBD',
        designerlist: 'TBD',
        process: 'TBD',
        invalid: 'TBD'
      },
      validation: {
        name: 'TBD',
        institute: 'TBD',
        curricular: 'TBD'
      },
      success: {
        save: 'TBD'
      }
    },
    BUTTON: {
      SAVE: 'TBD',
      SAVING: 'TBD'
    }
  }
};
const RoomBuilderdict: any = {
  EN: {
    TITLE: 'Create New Classroom',
    SUBTITLE: 'Add new Classroom to the list',
    HEADING: 'CLASSROOM INFORMATION',
    NAME_LABEL: 'Classroom Name',
    NAME_PLACEHOLDER: 'Add Classroom name',
    TEACHER_LABEL: 'Teacher',
    CO_TEACHER_LABEL: 'Co-Teachers',
    TEACHER_PLACEHOLDER: 'Select teacher',
    CO_TEACHER_PLACEHOLDER: 'Select Co-Teachers',
    CLASS_NAME_LABEL: 'Class Name',
    CLASS_NAME_PLACEHOLDER: 'Select Class',
    CURRICULUM_LABEL: 'Course',
    CURRICULUM_PLACEHOLDER: 'Select Course',
    INSTITUTION_LABEL: 'Institution',
    INSTITUTION_PLACEHOLDER: 'Select Institution',
    STATUS_LABEL: 'Status',
    STATUS_PLACEHOLDER: 'Select Status',
    MAXSTUDENT_LABEL: 'Max Number of Students',
    MAXSTUDENT_PLACHOLDER: 'Max students',
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...'
    },
    messages: {
      error: {
        institutebefor: 'Please create an institute before creating Classroom.',
        institutelist: 'Unable to fetch institution list. Please try again later.',
        staffmember: 'Please create staff member first for your institute.',
        teacherlist: 'Unable to fetch teachers list. Please try again later.',
        createclass: 'Please create class first for your institute.',
        classlist: 'Unable to fetch class list. Please try again later.',
        curricular: 'Unable to fetch course list. Please try again later.',
        process: 'Error while processing please Try again later.',
        classroomadd: 'Error while adding Classroom course. Please try again later.',
        ecreateclass: 'Error while creating Classroom. Please try again later.',
        invalid:
          'Invalid path please go back to institution selection page to select your institute.'
      },
      validation: {
        classroomname: 'Classroom name is required please enter name.',
        institute: 'Please select an institute to add Classroom.',
        teacher: 'Please select a teacher for the Classroom.',
        class: 'Please select a class for the Classroom.',
        maxstudent: 'Please set Max students limit for the Classroom.',
        allowstudent: 'One Classroom can allow max. 30 students.',
        classroomexist: 'This Classroom name is already exist, please add another name.'
      },
      success: {
        classroomdetail: 'New Classroom details has been saved.',
        newclassroom: 'New Classroom details has been saved.'
      }
    }
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
      SAVING: 'TBD'
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
        invalid: 'TBD'
      },
      validation: {
        classroomname: 'TBD',
        institute: 'TBD',
        teacher: 'TBD',
        class: 'TBD',
        maxstudent: 'TBD',
        allowstudent: 'TBD',
        classroomexist: 'TBD'
      },
      success: {
        classroomdetail: 'TBD',
        newclassroom: 'TBD'
      }
    }
  }
};

const EditCurriculardict: any = {
  EN: {
    TITLE: 'Edit Course',
    SUBTITLE: 'Update course information',
    HEADING: 'COURSE INFORMATION',
    NAME: 'Course Name',
    LANGUAGE: 'Select Language',
    DESIGNER: 'Select Designers',
    TYPE: 'Select Type',
    SUMMARY: 'Summary',
    DESCRIPTION: 'Description',
    OBJECTIVE: 'Objective',
    messages: {
      fetcherr: 'Error while fetching Designers list Please try again later.',
      curricularchange: 'Course changes has been saved.',
      updateerror: 'Error while updating course data please try later.',
      unablefetch: 'Unable to fetch institution list pleas try later.',
      processerr: 'Error while processing please Try again later.',
      namerequired: 'Course name is required please enter name.',
      selectinstitute: 'Please select an institute to add course.',
      nameexist: 'This course name is already exist, please add another name.',
      fetchinger: 'Error while fetching course data,please try again later.'
    },
    BUTTON: {
      SAVE: 'Save',
      CANCEL: 'Cancel'
    }
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    LANGUAGE: 'TBD',
    TYPE: 'TBD',
    SUMMARY: 'TBD',
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
      fetchinger: 'TBD'
    },
    BUTTON: {
      SAVE: 'TBD',
      CANCEL: 'TBD'
    }
  }
};

const RoomEDITdict: any = {
  EN: {
    TITLE: 'Edit Classroom',
    SUBTITLE: 'Edit Classroom information',
    HEADING: 'Classroom information',
    NAME_LABEL: 'Classroom Name',
    NAME_PLACEHOLDER: 'Add Classroom name',
    TEACHER_LABEL: 'Teacher',
    TEACHER_PLACEHOLDER: 'Select teacher',
    CO_TEACHER_LABEL: 'Co-teachers',
    CO_TEACHER_PLACEHOLDER: 'Select Co-teacher',
    CLASS_NAME_LABEL: 'Class Name',
    CLASS_NAME_PLACEHOLDER: 'Select Class',
    CURRICULUM_LABEL: 'Course',
    ACTIVE_UNIT_LABEL: 'Active Unit (Classroom Environment)',
    ACTIVE_UNIT_PLACEHOLDER: 'Select Active Unit',
    CURRICULUM_PLACEHOLDER: 'Select Course',
    STATUS_LABEL: 'Status',
    STATUS_PLACEHOLDER: 'Select Status',
    INSTITUTION_LABEL: 'Institution',
    INSTITUTION_PLACEHOLDER: 'Select Institution',
    MAXSTUDENT_LABEL: 'Max Number of Students',
    MAXSTUDENT_PLACHOLDER: 'Max students',
    CONFERENCE_CALL_LINK_LABEL: 'Conference link',
    CONFERENCE_CALL_LINK_PLACEHOLDER: 'Enter zoom, teams or meets link here',
    LOCATION_LABEL: 'Classroom location',
    LOCATION_PLACEHOLDER: 'Enter location here',
    CLASS_DETAILS_TAB_HEADING: 'Class Details',
    CLASS_DETAILS_TAB_DESCRIPTION: 'Create a classroom',
    CLASS_STUDENT_TAB_HEADING: 'Students',
    CLASS_STUDENT_TAB_DESCRIPTION: 'Add students to classroom',
    CLASS_DYNAMICS_TAB_HEADING: 'Class Dynamics(optional)',
    CLASS_DYNAMICS_TAB_DESCRIPTION:
      'Manage subject proficiency & create course partners and student groups',
    CLASS_UNIT_PLANNER_TAB_HEADING: 'Unit Planner',
    CLASS_UNIT_PLANNER_TAB_DESCRIPTION:
      'Set the schedule for your class and confirm lesson dates',
    TAB_DISABLED_TOOLTIP_TEXT: 'Add classroom details in step 1 to continue',
    messages: {
      institutebefor: 'Please create an institute before creating Classroom.',
      unabletofetch: 'Unable to fetch institution list. Please try again later.',
      addstaffirst:
        'Please add staff member first for the selected institute or select another institute.',
      unableteacher: 'Unable to fetch teachers list. Please try again later.',
      addclassfirst:
        'Please add class first for the selected institute or select another institute.',
      unableclass: 'Unable to fetch class list. Please try again later.',
      unablecurricular: 'Unable to fetch course list. Please try again later.',
      errorprocess: 'Error while processing. Please try again later.',
      classroomrequired: 'Classroom name is required please enter name.',
      selectinstitute: 'Please select an institute to add Classroom.',
      selectteacher: 'Please select a teacher for the classroom.',
      selectCurriculum: 'Please select a course for the classroom.',
      selectclass: 'Please select a class for the classroom.',
      mxstudent: 'Please set Max students limit for the classroom.',
      oneclass: 'One Classroom can allow max. 30 students.',
      alreadyexist: 'This Classroom name is already exist, please add another name.',
      classupdate: 'Classroom details has been updated.',
      errupdating: 'Error while updating Classroom course. Please try that later.',
      errprocess: 'Error while processing. Please try again later.',
      errupdatingclass: 'Error while updating Classroom details. Please try again later.',
      errfetch: 'Error while fetching Classroom data, please try again later.'
    },
    BUTTON: {
      SAVE: 'Save',
      SAVING: 'Saving...',
      CANCEL: 'Cancel'
    }
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME_LABEL: 'TBD',
    NAME_PLACEHOLDER: 'TBD',
    TEACHER_LABEL: 'TBD',
    TEACHER_PLACEHOLDER: 'TBD',
    CO_TEACHER_LABEL: 'TBD',
    CO_TEACHER_PLACEHOLDER: 'TBD',
    CLASS_NAME_LABEL: 'TBD',
    ACTIVE_UNIT_LABEL: 'TBD',
    ACTIVE_UNIT_PLACEHOLDER: 'TBD',
    CLASS_NAME_PLACEHOLDER: 'TBD',
    CURRICULUM_LABEL: 'TBD',
    CURRICULUM_PLACEHOLDER: 'TBD',
    MAXSTUDENT_LABEL: 'TBD',
    MAXSTUDENT_PLACHOLDER: 'TBD',
    CONFERENCE_CALL_LINK_LABEL: 'TBD',
    CONFERENCE_CALL_LINK_PLACEHOLDER: 'TBD',
    LOCATION_LABEL: 'TBD',
    LOCATION_PLACEHOLDER: 'TBD',
    CLASS_DETAILS_TAB_HEADING: 'TBD',
    CLASS_DETAILS_TAB_DESCRIPTION: 'TBD',
    CLASS_DYNAMICS_TAB_HEADING: 'TBD',
    CLASS_DYNAMICS_TAB_DESCRIPTION: 'TBD',
    CLASS_STUDENT_TAB_HEADING: 'TBD',
    CLASS_STUDENT_TAB_DESCRIPTION: 'TBD',
    CLASS_UNIT_PLANNER_TAB_HEADING: 'TBD',
    CLASS_UNIT_PLANNER_TAB_DESCRIPTION: 'TBD',
    TAB_DISABLED_TOOLTIP_TEXT: 'TBD',
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
      selectCurriculum: 'TBD',
      selectclass: 'TBD',
      mxstudent: 'TBD',
      oneclass: 'TBD',
      alreadyexist: 'TBD',
      classupdate: 'TBD',
      errupdating: 'TBD',
      errprocess: 'TBD',
      errupdatingclass: 'TBD',
      errfetch: 'TBD'
    },
    BUTTON: {
      SAVE: 'TBD',
      SAVING: 'TBD',
      CANCEL: 'TBD'
    }
  }
};

const RoomDetailsDict: any = {
  EN: {
    COURSE_DETAILS: 'Course Details',
    COURSE_FREQUENCY: 'Course Schedule',
    COURSE_PARTNERS: 'Course Partners',
    SUBJECT_PROFICIENCY: 'Subject Proficiency'
  },
  ES: {
    COURSE_DETAILS: 'TBD',
    COURSE_FREQUENCY: 'TBD',
    COURSE_PARTNERS: 'TBD',
    SUBJECT_PROFICIENCY: 'TBD'
  }
};

const SubjectProficiencyDict: any = {
  EN: {
    NO_GROUP_MESSAGE: 'No group added'
  },
  ES: {
    NO_GROUP_MESSAGE: 'TBD'
  }
};

const GroupFormDict: any = {
  EN: {
    HEADING: 'Group Details',
    LABELS: {
      GROUP_NAME: 'Group name',
      ADVISOR: 'Advisor',
      LOCATION: 'Location',
      STUDENTS: 'Students'
    },
    PLACEHOLDERS: {
      GROUP_NAME: 'Enter Group name',
      ADVISOR: 'Select advisor for group',
      LOCATION: 'Enter location'
    },
    MESSAGES: {
      GROUP_NAME: 'Group name is required',
      GROUP_ADVISOR: 'Group advisor is required'
    }
  },
  ES: {
    HEADING: 'TBD',
    LABELS: {
      GROUP_NAME: 'TBD',
      ADVISOR: 'TBD',
      LOCATION: 'TBD',
      STUDENTS: 'TBD'
    },
    PLACEHOLDERS: {
      GROUP_NAME: 'TBD',
      ADVISOR: 'TBD',
      LOCATION: 'TBD'
    },
    MESSAGES: {
      GROUP_NAME: 'TBD',
      GROUP_ADVISOR: 'TBD'
    }
  }
};

const CourseScheduleDict: any = {
  EN: {
    HEADING: 'Schedule Details',
    PLACEHOLDERS: {
      START_DATE: 'Start date',
      END_DATE: 'End date',
      START_TIME: 'Start Time',
      END_TIME: 'End Time',
      WEEK_DAY: 'Week Day',
      FREQUENCY: 'Frequency',
      CONFERENCE_CALL_LINK: 'Conference call link',
      LOCATION: 'Location',
      ADDITIONAL_NOTES: 'Notes regarding schedule'
    },
    MESSAGES: {
      START_DATE: 'Start date is required',
      END_DATE: 'End date is required',
      START_TIME: 'Start time is required',
      END_TIME: 'End time is required',
      SUCCESS_MESSAGE: 'Course Schedule updated successfully'
    }
  },
  ES: {
    HEADING: 'Schedule',
    PLACEHOLDERS: {
      START_DATE: 'TBD',
      END_DATE: 'TBD',
      START_TIME: 'TBD',
      END_TIME: 'TBD',
      WEEK_DAY: 'TBD',
      FREQUENCY: 'TBD',
      CONFERENCE_CALL_LINK: 'TBD',
      LOCATION: 'TBD',
      ADDITIONAL_NOTES: 'TBD'
    },
    MESSAGES: {
      START_DATE: 'TBD',
      END_DATE: 'TBD',
      START_TIME: 'TBD',
      END_TIME: 'TBD',
      SUCCESS_MESSAGE: 'TBD'
    }
  }
};

const curricularviewdict: any = {
  EN: {
    TITLE: 'Course Builder',
    SUBTITLE: 'Build course, units and lesson plans here',
    HEADING: 'GENERAL INFORMATION',
    NAME: 'Course Name',
    OWNER: 'Institution Owner',
    DESCRIPTION: 'Description',
    DESIGNER: 'Designers',
    LANGUAGE: 'Languages',
    OBJECTIVE: 'Objective',
    TAB: {
      UNIT: 'Units',
      LEARINGOBJECTIVE: 'Learning objectives',
      INFORMATION: 'Demographics & Information'
    }
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
      INFORMATION: 'TBD'
    }
  }
};

const CHECKPOINTSDICT: any = {
  EN: {
    TITLE: 'Demographics & Information (Course)',
    INFO: 'This course does not have any checkpoints yet. Please create a new one.',
    FETCH: 'Fetching Data Please wait...',
    BUTTON: {
      ADDEXISTING: 'Add Existing Checkpoint',
      ADDNEW: 'Add New Checkpoint'
    }
  },
  ES: {
    TITLE: 'TBD',
    INFO: 'TBD',
    FETCH: 'TBD',
    BUTTON: {
      ADDEXISTING: 'TBD',
      ADDNEW: 'TBD'
    }
  }
};

const LEARINGOBJECTIVEDICT: any = {
  EN: {
    TITLE: 'LEARNING OBJECTIVES',
    INFO:
      'This course does not have any learning objectives yet. Please create a new one.',
    FETCH: 'Fetching Data Please wait...',
    BUTTON: {
      ADD: 'Add Learning Objective',
      EDIT: 'Edit Learning Objective'
    }
  },
  ES: {
    TITLE: 'TBD',
    INFO: 'TBD',
    FETCH: 'TBD',
    BUTTON: {
      ADD: 'TBD',
      EDIT: 'TBD'
    }
  }
};

const SYLLABUS: any = {
  EN: {
    TITLE: 'COURSE UNITS',
    NO: 'No.',
    NAME: 'Unit Name',
    ACTION: 'Actions',
    EDIT: 'Edit',
    INFO: 'This course does not have any units yet. Please create a new one.',
    FETCH: 'Fetching details...',
    ADDNEW: 'Add new Unit'
  },
  ES: {
    TITLE: 'TBD',
    NO: 'TBD',
    NAME: 'TBD',
    ACTION: 'TBD',
    EDIT: 'Editar',
    INFO: 'TBD',
    FETCH: 'TBD',
    ADDNEW: 'TBD'
  }
};

const Measurementdict: any = {
  EN: {
    NO: 'No.',
    MEASUREMENT: 'Measurements',
    ACTION: 'Actions',
    EDIT: 'Edit',
    INFO: 'This topic does not have any measurement yet. Please create a new one.',
    ADDNEW: 'Add New Measurement',
    FETCH: 'Fetching measurements list...'
  },
  ES: {
    NO: 'TBD',
    MEASUREMENT: 'TBD',
    ACTION: 'TBD',
    EDIT: 'TBD',
    INFO: 'TBD',
    ADDNEW: 'TBD',
    FETCH: 'TBD'
  }
};

const TOPICLISTDICT: any = {
  EN: {
    TOPIC: 'Topics',
    EDIT: 'Edit',
    INFO: 'This learning objective does not have any topics. Please create a new one.',
    ADD: 'Add Topic',
    ADDNEW: 'Add New Topic',
    FETCH: 'Fetching topics list...'
  },
  ES: {
    TOPIC: 'TBD',
    EDIT: 'TBD',
    INFO: 'TBD',
    ADDNEW: 'TBD',
    FETCH: 'TBD'
  }
};

const ADDLEARINGOBJDICT: any = {
  EN: {
    TITLE: 'Add learning objective',
    SUBTITLE: 'Add new learning objective.',
    HEADING: 'LEARNING OBJECTIVE INFORMATION',
    NAME: 'Learning Objective Name',
    DESC: 'Description',
    SAVE: 'Save',
    VALIDATION: 'Name is required'
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    HEADING: 'TBD',
    NAME: 'TBD',
    DESC: 'TBD',
    SAVE: 'TBD',
    VALIDATION: 'TBD'
  }
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
      unabletosave: 'Unable to save Question details, Please try again later.'
    },
    Button: {
      save: 'Save',
      cancel: 'Cancel'
    }
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
      unabletosave: 'TBD'
    },
    Button: {
      save: 'TBD',
      cancel: 'TBD'
    }
  }
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
      cancel: 'Cancel'
    }
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
      cancel: 'TBD'
    }
  }
};

const AddMeasurementDict: any = {
  EN: {
    title: 'Add Measurement',

    subtitle: 'Add new measurement to course.',
    heading: 'Measurement Information',
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
      cancel: 'cancel'
    },
    messages: {
      namerequired: 'Name is required',
      topicrequired: 'topic is required'
    }
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
      cancel: 'TBD'
    },
    messages: {
      namerequired: 'TBD',
      topicrequired: 'TBD'
    }
  }
};

const AddProfileCheckpointDict: any = {
  EN: {
    title: 'Add Checkpoint',
    subtitle: 'Add new checkpoint to course.',
    heading: 'ADD NEW CHECKPOINT',
    label: 'Title',
    checkpointlabel: 'Checkpoint Label',
    selectdesigner: 'Select Designers',
    placeholder: 'Designers',
    languageselect: 'Select Language',
    typeSelect: 'Select Scope',
    typePlaceholder: 'Public',
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
      saving: 'Saving...'
    },
    messages: {
      unsave: 'Unable to save Checkpoint details, Please try again later.',
      titlerequired: 'Checkpoint title is required',
      labelrequired: 'Checkpoint label is required',
      minone: 'You need to add minimum one question to create a checkpoint.',
      noquestion: 'This checkpoint does not have any questions'
    }
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    typePlaceholder: 'TBD',
    heading: 'TBD',
    label: 'TBD',
    checkpointlabel: 'TBD',
    selectdesigner: 'TBD',
    typeSelect: 'TBD',
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
      saving: 'TBD'
    },
    messages: {
      unsave: 'TBD',
      titlerequired: 'TBD',
      labelrequired: 'TBD',
      minone: 'TBD',
      noquestion: 'TBD'
    }
  }
};

const SyllabusDict: any = {
  EN: {
    TITLE: 'Unit Builder',
    LESSON_PLAN: 'LESSON PLAN MANAGER',
    ADD_NEW_LESSON: 'New Lesson',
    ADD_UNIT: 'Add Unit',
    SELECT_LESSON: 'Select Lesson',
    HEADING: 'UNIT INFORMATION',
    LESSON_PLAN_HEADING: 'LESSON PLAN MANAGER',
    TABLE_HEADS: {
      NUMBER: 'No.',
      LESSON_NAME: 'Lesson Name',
      MEASUREMENTS: 'Measurements',
      TYPE: 'Type',
      ACTION: 'Actions'
    },
    MESSAGES: {
      wantsave: 'Do you want to save changes before moving forward?',
      fetchlist: 'Error while fetching lessons list data.',
      fetchdesign: 'Error while fetching Designers list Please try again later.',
      UPDATE_ERROR: 'Error while updating please try again later.'
    }
  },
  ES: {
    TITLE: 'TBD',
    LESSON_PLAN: 'TBD',
    ADD_NEW_LESSON: 'TBD',
    ADD_UNIT: 'TBD',
    SELECT_LESSON: 'TBD',
    HEADING: 'TBD',
    LESSON_PLAN_HEADING: 'TBD',
    TABLE_HEADS: {
      NUMBER: 'TBD',
      LESSON_NAME: 'TBD',
      MEASUREMENTS: 'TBD',
      TYPE: 'TBD',
      ACTION: 'TBD'
    },
    MESSAGES: {
      wantsave: 'TBD',
      fetchlist: 'TBD',
      fetchdesign: 'TBD'
    }
  }
};

const AddSyllabusDict: any = {
  EN: {
    title: 'Unit Builder',
    subtitle: 'Create course units here.',
    heading: 'UNIT INFORMATION',
    unitname: 'Unit Name',
    designer: 'Select Designers',
    placeholder: 'Designers',
    language: 'Select Language',
    placeholderlanguage: 'Language',
    description: 'Description',
    purpose: 'Essential Question',
    priority: 'Priority Standards',
    secondary: 'Secondary Standards',
    objective: 'Student Objectives',
    methodology: 'Methodology',
    policy: 'Policies',
    save: 'Save',
    saving: 'Saving...',
    messages: {
      fetcherr: 'Error while fetching Designers list Please try again later.',
      unitupdate: 'Unit details has been updated.',
      unablesave: 'Unable to save new unit please try again later.',
      namerequired: 'Unit name is required please enter name.'
    }
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    heading: 'TBD',
    unitname: 'TBD',
    priority: 'TBD',
    secondary: 'TBD',
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
      unitupdate: 'TBD',
      uintsave: 'TBD',
      unablesave: 'TBD',
      namerequired: 'TBD'
    }
  }
};

const AddTopicDict: any = {
  EN: {
    title: 'Add Topic',
    subtitle: 'Add new topic to the course.',
    heading: 'TOPIC INFORMATION',
    topicname: 'Topic Name',
    learningobj: 'Select Learning objective',
    learningobjpl: 'Learning objective',
    description: 'Description',
    button: {
      cancel: 'Cancel',
      save: 'Save'
    },
    messages: {
      namerequired: 'Name is required',
      objectiverequired: 'learning objective is required'
    }
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
      save: 'TBD'
    },
    messages: {
      namerequired: 'TBD',
      objectiverequired: 'TBD'
    }
  }
};

const EditLearningObjectiveDict: any = {
  EN: {
    title: 'Edit Learning objective',
    subtitle: 'Edit course Learning objective.',
    heading: 'LEARNING OBJECTIVE INFORMATION',
    learningname: 'Lerning Objective name',
    description: 'Description',
    fetching: 'Fetching data...',
    button: {
      cancel: 'Cancel',
      save: 'Save'
    },
    messages: {
      namerequired: 'Name is required'
    }
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
      save: 'TBD'
    },
    messages: {
      namerequired: 'TBD'
    }
  }
};

const EditMeasurementDict: any = {
  EN: {
    title: 'Edit Measurement',
    subtitle: 'Edit course measurement.',
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
      save: 'Save'
    },
    messages: {
      namerequierd: 'Name is required',
      topicrequired: 'topic is required'
    }
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
      save: 'TBD'
    },
    messages: {
      namerequierd: 'TBD',
      topicrequired: 'TBD'
    }
  }
};

const EditProfileCheckpointDict: any = {
  EN: {
    title: 'Add Checkpoint',
    subtitle: 'Add new checkpoint to course.',
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
      fetcherr: 'Unable to fetch Checkpoint details, Please try again later.'
    }
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
      fetcherr: 'TBD'
    }
  }
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
    edit: 'Edit',
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
      fetchdesign: 'Error while fetching Designers list Please try again later.'
    }
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
      fetchdesign: 'TBD'
    }
  }
};

const EditTopicDict: any = {
  EN: {
    title: 'Edit Topic',
    subtitle: 'Edit course topic.',
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
      save: 'Save'
    },
    messages: {
      namerequired: 'Name is required',
      learningobj: 'learning objective is required'
    }
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
      save: 'TBD'
    },
    messages: {
      namerequired: 'TBD',
      learningobj: 'TBD'
    }
  }
};

const ProfileCheckpointlookupDict: any = {
  EN: {
    title: 'Select Checkpoint',
    subtitle: 'Select checkpoint for course.',
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
      saving: 'Saving...'
    }
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
      saving: 'TBD'
    }
  }
};

const RegistrationDict: any = {
  EN: {
    title: 'Register New User',
    subtitle: 'Add new user to the list',
    requiredfield: 'Required fields',
    firstname: 'First Name',
    firstplaceholder: 'John',
    lastname: 'Last Name',
    lastplaceholder: 'Doe',
    email: 'Email',
    emailplaceholder: 'email@email.com',
    GROUP_PLACEHOLDER: 'Select group for student',
    role: 'Role',
    roles: {
      sup: 'Super Admin',
      adm: 'Admin',
      bld: 'Builder',
      flw: 'Fellow',
      crd: 'Coordinator',
      tr: 'Teacher',
      st: 'Student'
    },
    class: 'Class',
    status: 'Status',
    statusPlaceholder: 'Choose Status',
    paceLabel: 'Choose Pace',
    paceCheckBox: 'Self Paced',
    button: {
      submit: 'Submit'
    },
    messages: {
      emailerr: "Please make sure the user's email is correct",
      existemail: 'An account with this email exists',
      firstname: "User's first name cannot be blank",
      lastname: "User's last name cannot be blank",
      email: "User's email cannot be blank",
      emailaddress: "User's email is not in the expected email address format",
      userrol: "User's role cannot be blank",
      loading: 'Loading...',
      institution: 'Institution cannot be blank',
      GROUP_NO_OPTION: 'Select class first',
      GROUP_NO_OPTION_AFTER_FETCH: 'No group found',
      ROLE_NO_OPTION: 'Select role first'
    }
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
      submit: 'TBD'
    },
    messages: {
      emailerr: 'TBD',
      existemail: 'TBD',
      firstname: 'TBD',
      lastname: 'TBD',
      email: 'TBD',
      emailaddress: 'TBD',
      userrol: 'TBD',
      loading: 'TBD',
      institution: 'TBD'
    }
  }
};

const UserDict: any = {
  EN: {
    title: 'USER INFORMATION'
  },
  ES: {
    title: 'TBD'
  }
};

const UserEditDict: any = {
  EN: {
    heading: 'Edit Personal Information',
    firstname: 'First Name',
    lastname: 'Last Name',
    nickname: 'Nickname',
    status: 'Status',
    inactive_date: 'Inactive or Suspension Date',
    status_reason: 'Inactive or Suspension Reason',
    role: 'Role',
    button: {
      save: 'Save',
      cancel: 'Cancel'
    },
    ondemand: 'Self-Paced',
    SUPER_ADMIN: 'Super Admin'
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
      cancel: 'TBD'
    },
    ondemand: 'TBD',
    SUPER_ADMIN: 'TBD'
  }
};

const UserInformationDict: any = {
  EN: {
    heading: 'Personal Information',
    demographics: 'Demographics',
    private: 'Private',
    details: 'Private Details',
    fullname: 'Full Name',
    nickname: 'Nickname',
    role: 'Role',
    status: 'Status',
    email: 'Email Address',
    account: 'Account Created',
    ondemand: 'Self-Paced',

    LOCATION: 'Location',
    SUPER_ADMIN: 'Super Admin',
    RESET_PASSWORD: 'Reset password',
    RESETTING_PASSWORD: 'Resetting password',
    MESSAGE: {
      RESET_PASSWORD_SUCCESS: 'Password reset successfully',
      RESET_PASSWORD_FAILURE: 'Password reset failed'
    }
  },
  ES: {
    heading: 'TBD',
    demographics: 'TBD',
    private: 'TBD',
    details: 'TBD',
    fullname: 'TBD',
    nickname: 'TBD',
    role: 'TBD',
    status: 'TBD',

    CLASSROOM_LOCATION: 'TBD',
    email: 'TBD',
    account: 'TBD',
    ondemand: 'TBD',
    RESET_PASSWORD: 'TBD',
    RESETTING_PASSWORD: 'TBD',
    MESSAGE: {
      RESET_PASSWORD_SUCCESS: 'TBD',
      RESET_PASSWORD_FAILURE: 'TBD'
    }
  }
};

const UserLookupDict: any = {
  EN: {
    title: 'USER MANAGEMENT',
    subtitle: "People's List",
    sortby: 'Sort By',
    name: 'Name',
    role: 'Role',
    location: 'location',
    flow: 'flow',
    status: 'Status',
    action: 'Actions',
    noresult: 'No Results',
    button: {
      add: 'Add New User'
    }
  },
  ES: {
    title: 'TBD',
    subtitle: 'TBD',
    sortby: 'TBD',
    name: 'TBD',
    role: 'TBD',
    status: 'TBD',
    action: 'TBD',
    location: 'location',
    noresult: 'TBD',
    button: {
      add: 'TBD'
    }
  }
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
      add: 'Add New User'
    }
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
      add: 'TBD'
    }
  }
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
      SAVE: 'Save'
    }
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
      SAVE: 'TBD'
    },
    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATE: 'Checkpoint estimated time is required',
      ENTERVALIDNUMBER: 'Please enter valid number i.e. 30.',
      MINIMUMONE: 'You need to add minimum one question to create a checkpoint.'
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.'
    }
  }
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
      SAVING: 'Saving'
    },
    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATE: 'Checkpoint estimated time is required',
      ENTERVALIDNUMBER: 'Please enter valid number i.e. 30.',
      MINIMUMONE: 'You need to add minimum one question to create a checkpoint.'
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.'
    }
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
      SAVING: 'TBD',
      SAVE: 'TBD'
    },
    VALIDATION: {
      TITLE: 'TBD',
      LABEL: 'TBD',
      ESTIMATE: 'TBD',
      ENTERVALIDNUMBER: 'TBD',
      MINIMUMONE: 'TBD'
    },
    MESSAGES: {
      UNABLESAVE: 'TBD'
    }
  }
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
      SAVING: 'Saving...'
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.'
    },
    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATETIME: 'Checkpoint estimated time is required',
      VALIDNUMBER: 'Please enter valid number i.e. 30.',
      ONEQUESTION: 'You need to add minimum one question to create a checkpoint.'
    }
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
      SAVING: 'TBD'
    },
    MESSAGES: {
      UNABLESAVE: 'TBD'
    },
    VALIDATION: {
      TITLE: 'TBD',
      LABEL: 'TBD',
      ESTIMATETIME: 'TBD',
      VALIDNUMBER: 'TBD',
      ONEQUESTION: 'TBD'
    }
  }
};
const AddNewQuestionDict: any = {
  EN: {
    BUILDER: 'Builder',
    CHECKPOINT: 'Checkpoints',
    ADDNEWQUESTION: 'Add New Question',
    QUESTION: 'Question',
    QUESTIONLABEL: 'Question Label',
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
      SAVING: 'Saving...'
    },
    VALIDATION: {
      QUESTION: 'Question input is required',
      TYPE: 'Question type is required',
      LABEL: 'Question label is required'
    },
    MESSAGES: {
      QUESTIONSAVE: 'Question details has been saved.',
      UNABLESAVE: 'Unable to save Question details, Please try again later.'
    }
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
      SAVING: 'TBD'
    },
    VALIDATION: {
      QUESTION: 'TBD',
      TYPE: 'TBD',
      LABEL: 'TBD'
    },
    MESSAGES: {
      QUESTIONSAVE: 'TBD',
      UNABLESAVE: 'TBD'
    }
  }
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
      CANCEL: 'Cancel'
    }
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
      CANCEL: 'TBD'
    }
  }
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
      REMOVE: 'Remove Checkpoint'
    }
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
      REMOVE: 'TBD'
    }
  }
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
      SAVING: 'Saving...'
    },

    VALIDATION: {
      TITLE: 'Checkpoint title is required',
      LABEL: 'Checkpoint label is required',
      ESTIMATE: 'Checkpoint estimated time is required',
      ENTERVALIDNUMBER: 'Please enter valid number i.e. 30.',
      MINIMUMONE: 'You need to add minimum one question to create a checkpoint.'
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Checkpoint details, Please try again later.'
    }
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
      SAVING: 'TBD'
    },

    VALIDATION: {
      TITLE: 'TBD',
      LABEL: 'TBD',
      ESTIMATE: 'TBD',
      ENTERVALIDNUMBER: 'TBD',
      MINIMUMONE: 'TBD'
    },
    MESSAGES: {
      UNABLESAVE: 'TBD'
    }
  }
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
      SAVE: 'Save'
    },
    VALIDATION: {
      INPUT: 'Question input is required',
      TYPE: 'Question type is required',
      LABEL: 'Question label is required'
    },
    MESSAGES: {
      UNABLESAVE: 'Unable to save Question details, Please try again later.'
    }
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
      SAVE: 'TBD'
    },
    VALIDATION: {
      INPUT: 'TBD',
      TYPE: 'TBD',
      LABEL: 'TBD'
    },
    MESSAGES: {
      UNABLESAVE: 'TBD'
    }
  }
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
      SAVE: 'Save'
    }
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
      SAVE: 'TBD'
    }
  }
};
const SelectedCheckPointsListDict: any = {
  EN: {
    BUILDER: 'Builder',
    ADDCHECKPOINT: 'Please add checkpoints to',
    BUTTON: {
      ADDEXIST: 'Add Existing Checkpoint',
      CREATE: 'Create New Checkpoint'
    }
  },
  ES: {
    BUILDER: 'TBD',
    ADDCHECKPOINT: 'TBD',
    BUTTON: {
      ADDEXIST: 'TBD',
      CREATE: 'TBD'
    }
  }
};
const AddNewLessonFormDict: any = {
  EN: {
    TITLE: 'Lesson Overview',
    NAME: 'Lesson Name',
    SELECTTYPE: 'Select Type',
    TYPE: 'Type',
    INSTITUTION: 'Institution',
    SELECTINSTITUTION: 'Select Institution',
    SELECT_TARGET_AUDIENCE: 'Select Target Audience',
    SELECTLANG: 'Select Language',
    TARGET_AUDIENCE: 'Target Audience',
    LANGUAGE: 'Language',
    SELECTDESIGNER: 'Select Designers',
    DESIGNER: 'Designers',
    DURATION: 'Duration (Sessions)',
    MATERIALS: 'Materials',
    PURPOSE: 'Purpose',
    OBJECTIVE: 'Lesson Objectives',
    REMINDERANDNOTES: 'Reminder & Notes',
    RESOURCES: 'Resources',
    NOTES: 'Notes',
    SUMMARY: 'Summary',
    IMAGE_CAPTION: 'Image Overlay Text',
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
      STUDENT_SUMMARY: 'Student summary is required',
      IMAGE_CAPTION: 'Image Overlay text is required'
    },
    MESSAGES: {
      REMOVE: 'Are you sure you want to remove this measurement?',
      ADDERR: 'Error while adding measurement,please try later.',
      SAVE: 'Lesson details saved successfully.',
      SAVEERR: 'Unable to save Lesson details, Please try again later.',
      UPDATE: 'Lesson details updated successfully.',
      UPDATEERR: 'Unable to update Lesson details, Please try again later.',
      LESSONNOTHAVE: 'This lesson does not have any measurements, please add new one.',
      MEASUREMENTALREADYADDED: 'This measurment is already added.',
      MEASUREMENTADDSUCCESS: 'Lesson measurment list updated successfully.',
      NODESIGNEROPTION: 'Select Institution first',
      LOADING: 'Loading...'
    },
    NEXT: 'Next',
    SAVE: 'Save',
    SAVING: 'Saving...'
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
    DURATION: 'TBD',
    MATERIALS: 'TBD',
    PURPOSE: 'TBD',
    OBJECTIVE: 'TBD',
    RESOURCES: 'TBD',
    NOTES: 'TBD',
    SUMMARY: 'TBD',
    IMAGE_CAPTION: 'TBD',
    MEASUREMENTLESSON: 'TBD',
    REMINDERANDNOTES: 'TBD',
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
      STUDENT_SUMMARY: 'TBD',
      IMAGE_CAPTION: 'TBD'
    },
    MESSAGES: {
      REMOVE: 'TBD',
      ADDERR: 'TBD',
      SAVE: 'TBD',
      SAVEERR: 'TBD',
      LESSONNOTHAVE: 'TBD',
      NODESIGNEROPTION: 'TBD'
    },
    SAVE: 'TBD',
    SAVING: 'TBD'
  }
};
const AssessmentInstuctionsDict: any = {
  EN: {
    INSTRUCTION: 'Instructions',
    HEADING: 'INSTRUCTIONS: Complete the following to provide information about your',
    SAVE: 'Save',
    SAVING: 'Saving...',
    MESSAGES: {
      INSTRUCTIONSAVE: 'Instructions details saved.',
      UPDATEERR: 'Error while updating instructions, please try again later.'
    }
  },
  ES: {
    INSTRUCTION: 'TBD',
    HEADING: 'TBD',
    SAVE: 'TBD',
    SAVING: 'TBD',
    MESSAGES: {
      INSTRUCTIONSAVE: 'TBD',
      UPDATEERR: 'TBD'
    }
  }
};
const GeneralInformationDict: any = {
  EN: {
    HEADING: 'Lesson Overview',
    NAME: 'Name',
    SELECTDESIGNER: 'Select Designers',
    DESIGNER: 'Designers',
    LANGUAGE: 'Language',
    PURPOSE: 'Purpose',
    OBJECTIVE: 'Objective',
    SELECTTYPE: 'Select Type',
    TYPE: 'Type',
    INSTITUTION: 'Institution',
    SELECTINSTITUTION: 'Select Institution',
    SELECTLANG: 'Select Language',
    LESSONMEASUREMENT: 'Lesson Measurements',
    SELECTMEASUREMENT: 'Select Measurement',
    NO: 'No.',
    MEASUREMENT: 'Measurement',
    TOPIC: 'Topic',
    ACTION: 'Action',
    BUTTON: {
      ADD: 'Add',
      SAVE: 'Save',
      SAVING: 'Saving...'
    },

    MESSAGES: {
      REMOVE: 'Are you sure you want to remove this measurement?',
      DELETEERR: 'Error while deleting measurement,please try later.',
      ADDERR: 'Error while adding measurement,please try later.',
      NAME: 'Lessson name is required',
      FETCHERR: 'Unable to fetch measurement details, Please try again later.',
      UPDATESUCCESS: 'Lesson details updated successfully.',
      UPDATEERR: 'Unable to update Lesson details, Please try again later.',
      LESSONNOTHAVE: 'This lesson does not have any measurements, please add new one.'
    }
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
      SAVING: 'TBD'
    },

    MESSAGES: {
      REMOVE: 'TBD',
      DELETEERR: 'TBD',
      ADDERR: 'TBD',
      NAME: 'TBD',
      FETCHERR: 'TBD',
      UPDATESUCCESS: 'TBD',
      UPDATEERR: 'TBD',
      LESSONNOTHAVE: 'TBD'
    }
  }
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
    ADD: 'Add'
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
    ADD: 'TBD'
  }
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
    TEXTINPUT: 'text Input'
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
    TEXTINPUT: 'TBD'
  }
};

const UnitLookupDict: any = {
  EN: {
    HEADING: 'Assign Module',
    NOTE:
      'NOTE: Please select course and then modules to add current session to that module.',
    NO: 'No.',
    CURRICULUMNAME: 'Course Name',
    NAME: 'Name',
    INSTITUTION_NAME: 'Institution Name',
    UNITNAME: 'Module Name',
    LESSONS: 'Lessons',
    STATUS: 'Status',
    ACTION: 'Action',
    NOTADDED: ' This session is not added to any course or modules.',
    NO_UNIT_ADDED: 'This lesson is not added to any unit',
    NEW_UNIT: 'New Unit',
    UNIT_DETAILS: 'View Unit details',
    VIEW: 'View',
    INFO: 'This institute does not have any unit. Please create a new unit.',
    MESSAGES: {
      ADDED: 'Session added successfully.',
      ADDERR: 'Error while adding session to module, please try later.',
      FETCHERR: 'Error while fetching modules Data, Please try again later.'
    },
    NO_DELETE: '(Unit in use)',
    SELECT_INSTITUTION: 'Select Institution'
  },
  ES: {
    HEADING: 'TBD',
    NOTE: 'TBD',
    NO: 'TBD',
    CURRICULUMNAME: 'TBD',
    INSTITUTION_NAME: 'TBD',
    UNITNAME: 'TBD',
    STATUS: 'TBD',
    ACTION: 'TBD',
    NOTADDED: 'TBD',
    NO_UNIT_ADDED: 'TBD',
    NEW_UNIT: 'New Unit',
    UNIT_DETAILS: 'View Unit details',
    VIEW: 'View',
    INFO: 'This institute does not have any unit. Please create a new unit.',
    MESSAGES: {
      ADDED: 'TBD',
      ADDERR: 'TBD',
      FETCHERR: 'TBD'
    },
    NO_DELETE: '(Unit in use)',
    SELECT_STAFF: 'TBD',
    SELECT_INSTITUTION: 'TBD'
  }
};

const LessonBuilderDict: any = {
  EN: {
    TITLE: 'LESSON PLAN BUILDER',
    SUBTITLE: 'Build lessons, surveys or assessments here.',
    OVEVIEW_TITLE: 'Overview',
    OVERVIEW_DESCRIPTION: 'Capture core details of your lesson',
    ACTIVITY_TITLE: 'Activities',
    ACTIVITY_DESCRIPTION: 'Create class and home work here',
    ACTIVITY_TOOLTIP: 'Add overview details in step 1 to continue',
    UNIT_MANAGER_TITLE: 'Unit Manager',
    UNIT_MANAGER_DESCRIPTION: 'Assign lessons to units',
    UNIT_MANAGER_TOOLTIP: 'Create lesson activities in step 2 to continue',
    LEARNING_EVIDENCE_TITLE: 'Select measurements applied to lesson',
    LEARNING_EVIDENCE_DESCRIPTION: 'Link measurements to lesson',
    LEARNING_EVIDENCE_TOOLTIP: 'Assign your lesson to courses in step 3 to continue',
    BUTTON: {
      ADD_PLAN: 'Add new page',
      EDIT: 'Edit',
      VIEW: 'View',
      PREVIEW: 'Preview',
      SAVE: 'Save',
      ADD_ROW: 'Add Component',
      DELETE: 'Delete',
      ADD_EVIDENCE: 'Add Evidence'
    },
    LESSON_PLAN_COLUMN: {
      ID: 'id',
      PAGE_TITLE: 'Activity name',
      PLAN_LABEL: 'Activity label',
      DESCRIPTION: 'Instructions',
      TAGS: 'Add Tags',
      ESTIMATED_TIME: 'Scheduled Lesson Time',
      ACTIVITY_TYPE: 'Activity Type',
      INTERACTION_TYPE: 'Interaction Type',
      ACTIVITY_INSTRUCTIONS: 'Activity Instructions',
      ACTION: 'Actions',
      BUTTON: 'Create lesson plan'
    },
    LESSON_CLASSROOM_ACTIVITY_TABLE: {
      ACTIVITY_LABEL: 'Activity Label',
      ACTIVITY_NAME: 'Activity name',
      INTERACTION_TYPE: 'Interaction Type',
      INSTRUCTION: 'Instructions',
      ESTIMATED_TIME: 'Estimated Time',
      ACTION: 'Actions',
      ADD_NEW_ACTIVITY: 'New Class Activity',
      HEADING: 'Class Activities'
    },
    LESSON_HOMEWORK_ACTIVITY_TABLE: {
      ACTIVITY_LABEL: 'Activity Label',
      ACTIVITY_NAME: 'Activity name',
      INSTRUCTION: 'Instructions',
      ESTIMATED_TIME: 'Estimated Time',
      ACTION: 'Actions',
      ADD_NEW_ACTIVITY: 'New Homework',
      HEADING: 'Homework/Challenges'
    },
    LESSON_COURSES_UNIT_DETAIL_VIEW: {
      INSTITUTION: 'Institution',
      CLASSROOM: 'Classroom',
      LEAD_INSTRUCTOR: 'Lead Instructor'
    },
    LEARNING_EVIDENCE_COLUMNS: {
      LEARNING_OBJECTIVE: 'Learning Objective',
      TOPICS: 'Topics',
      MEASUREMENTS: 'Measurements',
      EVIDENCE_ACTIVITY: 'Evidence Activity(Page)',
      EVIDENCE_PLACE: 'Evidence Place',
      ACTION: 'Action',
      MEASURED: 'Measured',
      ADD_EVIDENCE: {
        OBJECTIVE: 'Objective',
        TOPICS: 'Topics',
        MEASUREMENTS: 'Measurements',
        ACTIVITY: 'Activity Page'
      }
    },
    LESSON_PLAN_FORM: {
      DESCRIPTION: 'Description',
      ESTIMATED_TIME: 'Estimated Time',
      HEADING: 'Create new lesson plan',
      ID: 'Id',
      LABEL: 'Lesson plan label',
      TITLE: 'Page title'
    },
    MESSAGES: {
      UNSAVE: 'You have unsaved changes, do you still want to continue?',
      PUBLISH_DISABLED_INFO: 'Complete lesson summary and plan tabs to continue'
    },
    INFORMATION_HEADING: 'General Information',
    NAME: 'Lesson Name',
    OWNER: 'Institution Owner',
    DESCRIPTION: 'Description',
    DESIGNER: 'Designers',
    DURATION: 'Duration',
    LANGUAGE: 'Languages',
    LESSON_PLAN_LABEL: 'Lesson Plan Label',
    OBJECTIVE: 'Objective',
    PURPOSE: 'Purpose',
    RESOURCES: 'Resources',
    NOTES: 'Notes & Reflection',
    SUMMARY: 'Student Summary'
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    BUTTON: {
      ADD_PLAN: 'TBD',
      EDIT: 'TBD',
      VIEW: 'TBD',
      PREVIEW: 'TBD',
      ADD_ROW: 'TBD',
      SAVE: 'TBD'
    },
    LESSON_PLAN_COLUMN: {
      ID: 'TBD',
      PAGE_TITLE: 'TBD',
      PLAN_LABEL: 'TBD',
      DESCRIPTION: 'TBD',
      TAGS: 'TBD',
      ESTIMATED_TIME: 'TBD',
      ACTION: 'TBD',
      ACTIVITY_TYPE: 'TBD',
      INTERACTION_TYPE: 'TBD',
      ACTIVITY_INSTRUCTIONS: 'TBD'
    },
    LESSON_PLAN_FORM: {
      DESCRIPTION: 'TBD',
      ESTIMATED_TIME: 'TBD',
      HEADING: 'TBD',
      ID: 'TBD',
      LABEL: 'TBD',
      TITLE: 'TBD'
    },
    LESSON_CLASSROOM_ACTIVITY_TABLE: {
      ACTIVITIES: 'TBD',
      ACTIVITY_NAME: 'TBD',
      INSTRUCTION: 'TBD',
      ESTIMATED_TIME: 'TBD',
      ACTION: 'TBD',
      ADD_NEW_ACTIVITY: 'TBD',
      HEADING: 'TBD'
    },
    LESSON_HOMEWORK_ACTIVITY_TABLE: {
      ACTIVITIES: 'TBD',
      ACTIVITY_NAME: 'TBD',
      INSTRUCTION: 'TBD',
      ESTIMATED_TIME: 'TBD',
      ACTION: 'TBD',
      ADD_NEW_ACTIVITY: 'TBD',
      HEADING: 'TBD'
    },
    LESSON_COURSES_UNIT_DETAIL_VIEW: {
      INSTITUTION: 'TBD',
      CLASSROOM: 'TBD',
      LEAD_INSTRUCTOR: 'TBD'
    },
    LEARNING_EVIDENCE_COLUMNS: {
      LEARNING_OBJECTIVE: 'TBD',
      TOPICS: 'TBD',
      MEASUREMENTS: 'TBD',
      EVIDENCE_ACTIVITY: 'TBD',
      EVIDENCE_PLACE: 'TBD',
      ACTION: 'TBD',
      MEASURED: 'TBD',
      ADD_EVIDENCE: {
        OBJECTIVE: 'TBD',
        TOPICS: 'TBD',
        MEASUREMENTS: 'TBD',
        ACTIVITY: 'TBD'
      }
    },
    MESSAGES: {
      UNSAVE: 'TBD',
      PUBLISH_DISABLED_INFO: 'TBD'
    },
    INFORMATION_HEADING: 'TBD',
    NAME: 'TBD',
    OWNER: 'TBD',
    DESCRIPTION: 'TBD',
    DESIGNER: 'TBD',
    DURATION: 'TBD',
    LANGUAGE: 'TBD',
    LESSON_PLAN_LABEL: 'TBD',
    OBJECTIVE: 'TBD',
    PURPOSE: 'TBD',
    RESOURCES: 'TBD',
    NOTES: 'TBD',
    SUMMARY: 'TBD'
  }
};

const LessonEditDict: any = {
  EN: {
    TITLE: 'LESSON PLAN BUILDER',
    SUBTITLE: 'Build lessons, surveys or assessments here.',
    MESSAGES: {
      UNSAVE: 'You have unsaved changes, do you still want to continue?'
    }
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    MESSAGES: {
      UNSAVE: 'TBD'
    }
  }
};

const LessonsListDict: any = {
  EN: {
    TITLE: 'LESSONS LIST',
    HEADING: 'Lessons',
    SUBTITLE: 'All Lessons List',
    SORTBY: 'Sort By',
    NO: 'No.',
    LESSONTITLE: 'Lesson Title',
    INSTITUTION_NAME: 'Institution Name',
    SELECT_INSTITUTION: 'Select Institution',
    TARGET_AUDIENCE: 'Target Audience',
    TYPE: 'Type',
    LANGUAGE: 'Language',
    ACTION: 'Actions',
    NORESULT: 'No Results',
    BUTTON: {
      ADD: 'Add New Lesson',
      START_CLONING: 'Start cloning',
      CLONING: 'cloning'
    },
    NO_DELETE: '(Lesson in use)'
  },
  ES: {
    TITLE: 'TBD',
    SUBTITLE: 'TBD',
    SORTBY: 'TBD',
    NO: 'TBD',
    LESSONTITLE: 'TBD',
    INSTITUTION_NAME: 'TBD',
    TARGET_AUDIENCE: 'TBD',
    TYPE: 'TBD',
    LANGUAGE: 'TBD',
    ACTION: 'TBD',
    NORESULT: 'TBD',
    BUTTON: {
      ADD: 'TBD',
      START_CLONING: 'TBD',
      CLONING: 'TBD'
    },
    NO_DELETE: '(Lesson in use)'
  }
};

const UniversalBuilderDict: any = {
  EN: {
    FETCHING: 'Fetching lesson pages...',
    GALLERY: {
      LESSON_PAGES: 'Lesson Pages'
    },
    TEMPLATES: {
      TITLE: 'Lesson Templates'
    },
    FORMS: {
      FILE_UPLOAD_TEXT: "Drag 'n' drop {label} here, or click to select {label}",
      VIDEO_URL_LABEL: 'Video URL',
      VIDEO_SIZE_LABEL: 'Video SIZE',
      VIDEO_SIZE_PLACEHOLDER: 'Select Video size'
    },
    FORMS_ERROR_MSG: {
      IMAGE_REQUIRED: 'Please upload image',
      IMAGE_WIDTH: 'Please enter valid width for image or set it to auto',
      IMAGE_HEIGHT: 'Please enter valid height for image or set it to auto',
      VIDEO_REQUIRED: 'Please enter youtube video url',
      VIDEO_INVALID: 'Please enter valid youtube video url'
    }
  },
  ES: {
    FETCHING: 'Fetching lesson pages...',
    GALLERY: {
      LESSON_PAGES: 'TBD'
    },
    TEMPLATES: {
      TITLE: 'TBD'
    }
  }
};

const CsvDict: any = {
  EN: {
    TITLE: 'Download Surveys',
    SELECT_INST: 'Select institute',
    SELECT_CLASSROOM: 'Select classroom',
    SELECT_FILTERS: 'Select Filters',
    SELECT_REASON: 'Select Reason',
    REASON: 'Reason....',
    UPLOAD_MULTIPLE_SURVEY_IMAGES: 'Upload Multipe Survey Images',
    DESCRIBE_REASON: 'Describe Reason'
  },
  ES: {
    TITLE: 'TBD',
    SELECT_INST: 'Seleccione instituto',
    SELECT_FILTERS: 'Seleccione Filtros',
    SELECT_CLASSROOM: 'Seleccione salón de clases',
    SELECT_REASON: 'Seleccionar motivo',
    REASON: 'Razón....',
    UPLOAD_MULTIPLE_SURVEY_IMAGES: 'Cargar imágenes de encuestas múltiples',
    DESCRIBE_REASON: 'Describa la razón'
  }
};

const DashboardDict: any = {
  EN: {
    YOUR_TEACHERS: 'Your Teachers',
    YOUR_CLASSROOMS: 'Your Classrooms',
    YOUR_STUDENTS: 'Your Students',
    YOUR_CLASSMATES: 'Your Classmates',
    GREETINGS_TEACHER: 'What do you want to teach today?',
    GREETINGS_STUDENT: 'What do you want to learn today?'
  },
  ES: {
    YOUR_TEACHERS: 'TBD',
    YOUR_CLASSROOMS: 'TBD',
    YOUR_STUDENTS: 'TBD',
    YOUR_CLASSMATES: 'TBD',
    GREETINGS_TEACHER: 'TBD',
    GREETINGS_STUDENT: 'TBD'
  }
};

const LearningEvidenceDict: any = {
  EN: {
    TITLE: 'Add Measurements to Lesson'
  },
  ES: {
    TITLE: 'TBD'
  }
};

const CommonlyUsedDict: any = {
  EN: {
    BACK: 'Back',
    BACK_TO_LIST: 'Back to list',
    NO_SEARCH_RESULT: 'No data found'
  },
  ES: {
    BACK: 'TBD',
    BACK_TO_LIST: 'TBD',
    NO_SEARCH_RESULT: 'TBD'
  }
};

const General: any = {
  EN: {
    SENTIMENT: {
      TITLE: "How you've been?",
      MODAL_TITLE: 'The Backstory',
      NO_DATA: 'No sentiments data found',
      EMOJIS: {
        AWFUL: 'awful',
        BAD: 'bad',
        OKAY: 'okay',
        GOOD: 'good',
        GREAT: 'great'
      }
    }
  },
  ES: {
    SENTIMENT: {
      MODAL_TITLE: 'TBD',
      TITLE: 'TBD',
      NO_DATA: 'No sentiments data found',
      EMOJIS: {
        AWFUL: 'TBD',
        BAD: 'TBD',
        OKAY: 'TBD',
        GOOD: 'TBD',
        GREAT: 'TBD'
      }
    }
  }
};

const StudentDict: any = {
  EN: {
    NO_STUDENT: 'No Student Found'
  },
  ES: {
    NO_STUDENT: 'TBD'
  }
};

const CommunityDict: any = {
  EN: {
    TITLE: 'Community',
    HEADER: 'Here is what is happening today',
    TABS: {
      FRONT_PAGE: 'Front page',
      COMMUNITY_BUILDER: 'Community Builder'
    }
  },
  ES: {
    TITLE: 'TBD',
    HEADER: 'TBD',
    TABS: {
      FRONT_PAGE: 'TBD',
      COMMUNITY_BUILDER: 'TBD'
    }
  }
};

function paginationPage(lang: string, page: number, total: number) {
  if (lang === 'EN') return `Showing Page ${page + 1} of ${total} pages`;
  if (lang === 'ES') return `Mostrando página ${page + 1} de ${total} páginas`;
  return '';
}

export {
  AuthDict,
  CommunityDict,
  CsvDict,
  paginationPage,
  BUTTONS,
  General,
  BreadcrumsTitles,
  appDict,
  anthologyDict,
  sideBarLinksDict,
  DashboardDict,
  noticeboardDict,
  dashboardProfileDict,
  dashboardTestCasesDict,
  staffBuilderDict,
  editClassDict,
  spBuilderDict,
  manageusersDict,
  InstitutionDict,
  Institute_info,
  InstitutionEditDict,
  InstitutionAddDict,
  InstitutionBuilderDict,
  Institute_class,
  InstitueCurriculum,
  InstitueRomms,
  classBuilderdict,
  CurricularBuilderdict,
  RoomBuilderdict,
  EditCurriculardict,
  RoomEDITdict,
  RoomDetailsDict,
  GroupFormDict,
  CourseScheduleDict,
  curricularviewdict,
  CHECKPOINTSDICT,
  LEARINGOBJECTIVEDICT,
  SYLLABUS,
  Measurementdict,
  TOPICLISTDICT,
  ADDLEARINGOBJDICT,
  lessonDict,
  classRoomDict,
  lessonPlannerDict,
  PreviewFormDict,
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
  CourseBuilderDict,
  SyllabusDict,
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
  StudentDict,
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
  UniversalBuilderDict,
  LearningEvidenceDict,
  CommonlyUsedDict
};
