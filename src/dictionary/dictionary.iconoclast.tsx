// Buttons
const BUTTONS: any = {
  EN: {
    ADD: 'Add',
    ADD_NEW: 'Add New',
    EDIT: 'Edit',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    PUBLISH: 'Publish',
    YES: 'Yes'
  },
  ES: {
    ADD: 'Añadir',
    ADD_NEW: 'Añadir nuevo',
    EDIT: 'Edit',
    SAVE: 'Salvar',
    CANCEL: 'Cancelar',
    PUBLISH: 'TBD',
    YES: 'TBD'
  },
};

// Breadcrumbs
const BreadcrumsTitles: any = {
  EN: {
    HOME: 'HOME',
    PROFILE: 'PROFILE',
    PEOPLE: 'PEOPLE',
  },
  ES: {
    HOME: 'CASA',
    PROFILE: 'PERFIL',
    PEOPLE: 'PERSONAS',
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
      WARN_MSG: 'This will log you out and take you to the reset password page, do you want to continue?',
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
    PROFILE_INSTRUCTON: 'Haga clic en el círculo de arriba para actualizar la imagen de perfil.',
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
      INFO: 'La contraseña debe tener al menos 8 caracteres e incluir mayúsculas y minúsculas',
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
      CREATE: 'Create New',
      ADD: 'Add More',
      CANCEL: 'Cancel',
      DELETE: 'Delete'
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
      DELETE: 'Deletar'
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
  },
  ES: {
    TITLE: 'MIEMBROS DEL PERSONAL',
    ADD_PLACEHOLDER: 'Añadir nuevo',
    ADD_BUTTON: 'Añadir',
  },
};

const spBuilderDict: any = {
  EN: {
    TITLE: 'SERVICE PROVIDERS',
    ADD_PLACEHOLDER: 'Add a new service provider',
    ADD_BUTTON: 'ADD',
  },
  ES: {
    TITLE: 'PROVEEDORES DE SERVICIO',
    ADD_PLACEHOLDER: 'Agregar un nuevo proveedor de servicios',
    ADD_BUTTON: 'Añadir',
  },
};

const editClassDict: any = {
  EN: {
    TITLE: 'EDIT CLASS',
    SUBTITLE: 'Edit class information',
    NAME_INPUT_LABEL: 'Class Name',
    STUDENTS: 'STUDENTS',
    ADD_STUDENT_PLACEHOLDER: 'Add new student',
    ADD_STUDENT_BUTTON: 'Add',
    TABLE: {
      SNO: 'No.',
      NAME: 'Student Name',
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
      SELECT_CLASSROOM_WIDGETS: '⬆ Select a room to see editable widgets...'
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
      SELECT_CLASSROOM_WIDGETS: 'Select a room to see editable widgets...'
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

const lessonBuilderDict: any = {
  'EN': {
    PREVIEW_DETAILS: {
      WARN_MESSAGE: 'Publishing your changes will update lesson plans in all the connected units, Do you want to continue?',
      TITLE: 'Preview Details',
    }
  },
  'ES': {
    PREVIEW_DETAILS: {
      WARN_MESSAGE: 'TBD',
      TITLE: 'TBD',
    }
  }
}

function paginationPage(lang: string, page: number, total: number) {
  if (lang === 'EN') return `Showing Page ${page + 1} of ${total} pages`;
  if (lang === 'ES') return `Mostrando página ${page + 1} de ${total} páginas`;
  return '';
}

export {
  paginationPage,
  BUTTONS,
  BreadcrumsTitles,
  appDict,
  anthologyDict,
  sideBarLinksDict,
  dashboardProfileDict,
  staffBuilderDict,
  editClassDict,
  spBuilderDict,
  manageusersDict,
  lessonDict,
  classRoomDict,
  lessonPlannerDict,
  lessonBuilderDict
};
