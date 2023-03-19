import {
  ADDLEARINGOBJDICTInterface,
  AddMeasurementDictInterface,
  AddNewCheckPointDictInterface,
  AddNewLessonFormDictInterface,
  AddNewQuestionDictInterface,
  AddProfileCheckpointDictInterface,
  addQuestionDictInterface,
  AddQuestionModalDictInterface,
  AddSyllabusDictInterface,
  AddTopicDictInterface,
  AnthologyDictInterface,
  AppDictInterface,
  AssessmentInstuctionsDictInterface,
  AuthDictInterface,
  BreadcrumbsTitlesInterface,
  ButtonInterface,
  CheckpointLookupDictInterface,
  CheckpointQueTableDictInterface,
  CHECKPOINTSDICTInterface,
  ClassBuilderdictInterface,
  ClassroomDictInterface,
  CommonlyUsedDictInterface,
  CommunityDictInterface,
  CourseBuilderDictInterface,
  CourseScheduleDictInterface,
  CsvDictInterface,
  CurricularBuilderdictInterface,
  CurricularViewInterface,
  DashboardDictInterface,
  DashboardProfileDictInterface,
  DashboardTestCasesDictInterface,
  EditCheckPointDictInterface,
  EditClassDictInterface,
  EditCurriculardictInterface,
  EditLearningObjectiveDictInterface,
  EditMeasurementDictInterface,
  EditProfileCheckpointDictInterface,
  EditQuestionDictInterface,
  EditQuestionModalDictInterface,
  EditSyllabusDictInterface,
  EditTopicDictInterface,
  GeneralInformationDictInterface,
  GeneralInterface,
  GroupFormDictInterface,
  InstitueRommsInterface,
  InstituteClassInterface,
  InstituteCurriculumInterface,
  InstitutionAddDictInterface,
  InstitutionBuilderDictInterface,
  InstitutionDictInterface,
  InstitutionEditDictInterface,
  InstitutionInfoInterface,
  LEARINGOBJECTIVEDICTInterface,
  LearningEvidenceDictInterface,
  LessonBuilderDictInterface,
  LessonDictInterface,
  LessonEditDictInterface,
  LessonPlannerDictInterface,
  LessonsListDictInterface,
  ManageUsersDictInterface,
  MeasurementDictInterface,
  NoticeboardDictInterface,
  PreviousQuestionsDictInterface,
  ProfileCheckpointlookupDictInterface,
  QuestionBuilderDictInterface,
  RegistrationDictInterface,
  RoomBuilderdictInterface,
  RoomDetailsDictInterface,
  RoomEDITdictInterface,
  SelectedCheckPointsListDictInterface,
  SelectPreviousQuestionDictInterface,
  SideBarLinksDictInterface,
  SpBuilderDictInterface,
  StaffBuilderDictInterface,
  StudentDictInterface,
  SyllabusDictInterface,
  SYLLABUSInterface,
  TOPICLISTDICTInterface,
  UnitLookupDictInterface,
  UniversalBuilderDictInterface,
  UserDictInterface,
  UserEditDictInterface,
  UserInformationDictInterface,
  UserLookupDictInterface
} from '@interfaces/dictionary.interface';

const AuthDict: AuthDictInterface = {
  EN: {
    VERIFY_EMAIL: 'Verify Email',
    LOGIN: 'Log In'
  },
  ES: {
    VERIFY_EMAIL: 'Verify Email',
    LOGIN: 'Log In'
  }
};

const BUTTONS: ButtonInterface = {
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
    ADD: 'Agregar',
    ADD_NEW: 'Agregar Nuevo',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
    SAVE: 'Guardar',
    SAVING: 'Guardando',
    CANCEL: 'Cancelar',
    PUBLISH: 'Publicar',
    YES: 'Sí',
    CREATE: 'Crear',
    CREATING: 'Creando'
  }
};

const BreadcrumsTitles: BreadcrumbsTitlesInterface = {
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
    COURSES: 'Course Manager',
    UNITS: 'Unit Manager',
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
    HOME: 'Casa',
    PROFILE: 'PERFIL',
    TEST_CASES: 'CASOS DE PRUEBA',
    PEOPLE: 'PEOPLE',
    INSTITUTION_MANAGEMENT: 'Administración de Instituciones',
    ADD_INSTITUTION: 'Agregar nueva Institución',
    INSTITUTION_INFO: 'Información de la Institución',
    INSTITUTION_GENERAL_INFO: 'Información general',
    Class_Creation: 'Creación de Clases',
    CURRICULARBUILDER: 'Nuevo Curso',
    CURRICULUM: 'Curso',
    COURSES: 'Administrador de Cursos',
    UNITS: 'Administrador de Unidades',
    CLASSROOM_CREATION: 'Creación de Aulas',
    CLASSROOMS: 'Aulas',
    CLASSROOM: 'Aula',
    CLASSES: 'Clases',
    EDITCLASS: 'Editar Clase',
    EDITCURRICULUM: 'Editar Curso',
    EDITCLASSROOM: 'Editar Aula',
    CURRICULUMBUILDER: 'Constructor de Cursos',
    LEARINGOBJECTIVE: 'Agregar objetivo de aprendizaje',
    AddMeasurement: 'Agregar medida',
    AddCheckpint: 'Agregar punto de control',
    UnitBuilder: 'Constructor de Unidades',
    COURSE_BUILDER: 'Constructor de Cursos',
    AddTopic: 'Agregar tema',
    EditLearningObj: 'Editar objetivo de aprendizaje',
    EditMeasurement: 'Editar medida',
    AddChekpoint: 'Agregar punto de control',
    EditTopic: 'Editar tema',
    AddExistingCheckpoint: 'Agregar punto de control existente',
    STAFF: 'Administrador de Personal',
    PeopleManagment: 'Gestión de personal',
    AddNewUser: 'Agregar Nuevo Usuario',
    USERS: 'Administrador de Usuarios',
    UserInfo: 'Información del usuario',
    LESSONS: 'Lecciones',
    LESSONPLANBUILDER: 'Constructor de Plan de lección',
    LESSON_BUILDER: 'Constructor de Lecciones',
    LESSON_EDITOR: 'Editor de lecciones',
    STUDENTS: 'Estudiantes',
    STUDENTS_NOTEBOOK: 'Cuaderno de Estudiantes',
    ADD_NEW_LESSON_PLAN: 'Agregar nuevo plan de lección',
    LOADING: 'Cargando...',
    COMMUNTIY: 'Constructor de Comunidad S/B'
  }
};

const dashboardProfileDict: DashboardProfileDictInterface = {
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
      INFO: 'Passcode must be at least 4 alphanumeric characters (no spaces or special characters)',
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
    TITLE: 'PERFIL DE USUARIO',
    PROFILE_INSTRUCTON:
      'Haga clic en el círculo de arriba para actualizar la foto de perfil.',
    SUBTITLE: 'Esto contiene tu información de perfil.',
    PERSONAL_INFO: {
      TITLE: 'Información Personal',
      FULL_NAME: 'Nombre Completo',
      FIRST_NAME: 'Nombre de Pila',
      LAST_NAME: 'Apellido',
      NICKNAME: 'Apodo',
      BIRTHDAY: 'Fecha de Nacimiento',
      LANGUAGE: 'Preferencia de Idioma',
      EMAIL: 'Correo electrónico',
      CONTACT: 'Número de contacto',
      ROLE: 'Rol',
      PASSWORD: 'Contraseña',
      PASSCODE: 'Código de diario',
      SUPER_ADMIN: 'Super Administrador'
    },
    INSTITUTION_INFO: {
      TITLE: 'Información de la Institución',
      INSTITUTION: 'Institución',
      GRADE: 'Grado'
    },
    EDIT_PROFILE: {
      TITLE: 'Editar Información Personal',
      FIRST_NAME: 'Nombre de Pila',
      BIRTHDAY: 'Fecha de Nacimiento',
      LAST_NAME: 'Apellido',
      NICKNAME: 'Apodo',
      LANGUAGE: 'Preferencia de Idioma',
      CONTACT: 'Número de contacto',
      SAVE: 'Guardar',
      CANCEL: 'Cancelar'
    },
    CHANGE_PASSCODE: {
      TITLE: 'Cambiar su Código de diario',
      INFO: 'El código debe tener al menos 4 caracteres alfanuméricos (sin espacios ni caracteres especiales)',
      OLD_PASS: 'Contraseña de inicio de sesión',
      NEW_PASS: 'Nuevo Código',
      SAVE: 'Guardar Nuevo Código',
      CANCEL: 'Cancelar',
      SUCCESS_MSG: '¡Éxito!',
      WARN_MSG:
        'Esto lo desconectará y lo llevará a la página de restablecimiento de contraseña, ¿desea continuar?',
      CONTINUE_BTN: 'Continuar',
      ERRORS: {
        NO_OLD_PASS: 'Por favor ingrese su contraseña',
        NO_NEW_PASS: 'Por favor ingrese su nueva contraseña',
        NO_CONFIRM_PASS: 'Por favor ingrese la confirmación de su contraseña',
        NOT_MATCH: 'Su nueva contraseña y la confirmación de contraseña no coinciden'
      }
    },
    CHANGE_PASSWORD: {
      TITLE: 'Cambiar su Contraseña',
      INFO: 'La contraseña debe tener al menos 8 caracteres y debe incluir mayúsculas y minúsculas',
      OLD_PASS: 'Contraseña Anterior',
      NEW_PASS: 'Nueva Contraseña',
      CONFIRM_PASS: 'Confirmar Contraseña',
      FORGOT_PASS_LINK: '¿No recuerda su contraseña anterior?',
      SAVE: 'Guardar Nueva Contraseña',
      CANCEL: 'Cancelar',
      SUCCESS_MSG: '¡Éxito!',
      WARN_MSG:
        'Esto lo desconectará y lo llevará a la página de restablecimiento de contraseña, ¿desea continuar?',
      CONTINUE_BTN: 'Continuar',
      ERRORS: {
        NO_OLD_PASS: 'Por favor ingrese su antigua contraseña',
        NO_NEW_PASS: 'Por favor ingrese su nueva contraseña',
        NO_CONFIRM_PASS: 'Por favor ingrese la confirmación de su contraseña',
        NOT_MATCH: 'Su nueva contraseña y la confirmación de contraseña no coinciden'
      }
    }
  }
};

// Create a ts interface for dashboardTestCasesDict

const dashboardTestCasesDict: DashboardTestCasesDictInterface = {
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
  },
  ES: {
    PROFILE: 'Casos de prueba',
    TITLE: 'CASOS DE PRUEBA',
    SUBTITLE: 'Esto contiene información sobre casos de prueba.',
    EDIT_TEST_CASES: {
      TEST_ID: 'ID de prueba',
      TEST_NAME: 'Nombre de prueba',
      TEST_TYPE: 'Tipo de prueba',
      TEST_STEPS: 'Pasos de prueba',
      TEST_DATA: 'Datos de prueba',
      TEST_EXP_RESULTS: 'Resultados esperados de prueba',
      TEST_EDGE_CASES: 'Casos límite de prueba',
      SAVE: 'Guardar',
      CANCEL: 'Cancelar'
    }
  }
};

const anthologyDict: AnthologyDictInterface = {
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
    TITLE_CONTAINER: 'Tus Cuadernos',
    TITLE: 'Cuaderno',
    NO_SELECTED: 'Ningún cuaderno seleccionado...',
    TABS: {
      A: 'Diario',
      B: 'Trabajo de clase',
      C: 'Apuntes de clase',
      D: 'Subidas'
    },
    ACTIONS: {
      EDIT: 'Editar',
      SAVE: 'Guardar',
      CREATE: 'Nueva entrada',
      ADD: 'Añadir más',
      CANCEL: 'Cancelar',
      DELETE: 'Borrar',
      CONFIRM: 'Confirmar',
      UPLOAD: 'Subir'
    }
  }
};

// Create a ts interface for manageusersDict

const manageusersDict: ManageUsersDictInterface = {
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
      ROLE: 'Rol',
      INST: 'Institución',
      STATUS: 'Estado',
      ACTIONS: 'Acciones'
    },
    ADD_NEW: 'Añadir nuevo usuario'
  }
};

const sideBarLinksDict: SideBarLinksDictInterface = {
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
    INSTITUTIONS: 'Instituciones',
    PEOPLE: 'Personas',
    LESSON_PLANNER: 'Planificador',
    CLASSROOM: 'Aula',
    LESSON_BUILDER: 'Constructor de lecciones',
    UNIVERSAL_LESSON_BUILDER: 'Constructor universal',
    ANTHOLOGY: 'Cuadernos',
    NOTICEBOARD: 'Tablón',
    NOTEBOOK: 'Cuaderno de notas',
    DASHBOARD: 'Panel',
    RESEARCHANALYTICS: 'Investigación y análisis'
  }
};

const appDict: AppDictInterface = {
  EN: {
    LOG_OUT: 'Log Out',
    LOADING: 'Give us one second, this section is loading...'
  },
  ES: {
    LOG_OUT: 'Cerrar sesión',
    LOADING: 'Espere un momento, esta sección se está cargando...'
  }
};

const staffBuilderDict: StaffBuilderDictInterface = {
  EN: {
    TITLE: 'STAFF AND INVITED GUESTS',
    ADD_PLACEHOLDER: 'Add new',
    ADD_SUPER_ADMIN_PLACEHOLDER: 'Add new Super Admin',
    ADD_SUPER_ADMIN: 'Existing Super Admin',
    ADD_BUTTON: 'ADD',
    NO: 'No.',
    NAME: 'Name',
    ROLE: 'Role',
    INSTITUTION_NAME: 'Institution Name',
    STATUS: 'Status',
    ACTION: 'Actions',
    UPDATING: 'updating...',
    CANCEL: 'Cancel',
    INFO: 'This institute does not have any staff member. Please add new member.',
    LOADING: 'Loading...',
    STATUS_PLACEHOLDER: 'Select Status',
    EDIT: 'Edit'
  },
  ES: {
    TITLE: 'PERSONAL E INVITADOS',
    ADD_PLACEHOLDER: 'Agregar nuevo',
    ADD_SUPER_ADMIN_PLACEHOLDER: 'Añadir un superadministrador nuevo',
    ADD_SUPER_ADMIN: 'Superadministrador existente',
    ADD_BUTTON: 'AGREGAR',
    NO: 'No.',
    NAME: 'Nombre',
    ROLE: 'Rol',
    INSTITUTION_NAME: 'Nombre de la institución',
    STATUS: 'Estado',
    ACTION: 'Acciones',
    UPDATING: 'actualizando...',
    CANCEL: 'Cancelar',
    INFO: 'Esta institución no tiene ningún miembro del personal. Por favor, agregue un nuevo miembro.',
    LOADING: 'Cargando...',
    STATUS_PLACEHOLDER: 'Seleccionar estado',
    EDIT: 'Editar'
  }
};

const spBuilderDict: SpBuilderDictInterface = {
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
    INFO: 'This institute does not have any service vendor. Please add new service vendor.'
  },
  ES: {
    TITLE: 'PROVEEDORES DE SERVICIO',
    ADD_PLACEHOLDER: 'Agregar un nuevo proveedor de servicios',
    ADD_BUTTON: 'AGREGAR',
    NO: 'NO.',
    SERVICE: 'Proveedores de servicios',
    STATUS: 'Estado',
    ACTION: 'Acciones',
    UPDATING: 'actualizando...',
    CANCEL: 'Cancelar',
    INFO: 'Esta institución no tiene ningún proveedor de servicios. Por favor, agregue un nuevo proveedor de servicios.'
  }
};

// Create a ts interface for editClassDict

const editClassDict: EditClassDictInterface = {
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
      STATUS: 'Status',
      LOCATION: 'Location',
      TYPE: 'Type',
      DATE: 'Date Added',
      ACTIONS: 'Actions'
    }
  },
  ES: {
    TITLE: 'EDITAR CLASE',
    SUBTITLE: 'Editar información de la clase',
    NAME_INPUT_LABEL: 'Nombre de la clase',
    STUDENTS: 'ESTUDIANTES',
    ADD_STUDENT_PLACEHOLDER: 'Seleccione el estudiante',
    ADD_STUDENT_LABEL: 'Agregar estudiantes a la clase',
    ADD_STUDENT_FROM_REGSITER: 'Agregar estudiantes del registro a la clase',
    ADD_STUDENT_BUTTON: 'Añadir',
    GROUP: 'Grupo',
    GROUP_PLACEHOLDER: 'Seleccione un grupo',
    UPDATING: 'actualizando...',
    CANCEL: 'Cancelar',
    NOSTUDENT: 'No se han agregado estudiantes a la clase.',
    LOADING: 'Cargando lista de estudiantes de la clase...',
    EDIT: 'Editar',
    heading: 'INFORMACIÓN DE LA CLASE',
    heading2: 'ESTUDIANTES',
    messages: {
      errorfetch: 'Error al obtener datos de la clase, intente nuevamente más tarde.',
      errorstudentadd:
        'Error mientras se agrega el estudiante, inténtelo de nuevo más tarde',
      processerror: 'Error de procesamiento, inténtelo de nuevo más tarde.',
      classrequired: 'Se requiere el nombre de la clase, por favor ingrese uno.',
      selectinstitute: 'Seleccione una institución para agregar la clase.',
      classexist: 'Este nombre de clase ya existe, por favor agregue otro nombre.',
      classupdate: 'Se han actualizado los detalles de la clase.',
      unableupdate:
        'No se pudo actualizar los detalles de la clase. Por favor, inténtelo de nuevo más tarde.'
    },
    TABLE: {
      SNO: 'No.',
      NAME: 'Nombre del participante',
      GROUP: 'Grupo',
      STATUS: 'Estado',
      LOCATION: 'Ubicación',
      TYPE: 'Tipo',
      DATE: 'Fecha de agregado',
      ACTIONS: 'Acciones'
    }
  }
};

const lessonDict: LessonDictInterface = {
  EN: {
    CLASS: 'Class',
    TOPIC_CONNECTION: 'SEL Connection',
    KEYWORDS: 'Keywords',
    REFLECTION_QUESTIONS: 'Class Discussion'
  },
  ES: {
    CLASS: 'Clase',
    TOPIC_CONNECTION: 'Conexión SEL',
    KEYWORDS: 'Palabras clave',
    REFLECTION_QUESTIONS: 'Discusión en clase'
  }
};

const noticeboardDict: NoticeboardDictInterface = {
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
      TEXT: 'This is the default text widget. Use this if you want to show a text message/notice to students in your room.',
      QUOTES:
        'Add multiple quotes above the lessons or to the side widget bar to inspire your students.',
      CALL: "This is a basic widget to post the zoom/meet/teams links you'll use to communicate with your students.",
      FILE: 'This is a basic widget to share your drive/onedrive/dropbox files for student assignments etc.'
    }
  },
  ES: {
    JOIN_CALL: {
      DEFAULT: 'Unirse a la llamada',
      ZOOM: 'Unirse a la llamada de Zoom',
      MEET: 'Unirse a la llamada de Meet',
      TEAMS: 'Unirse a la llamada de Teams'
    },
    DOWNLOAD: 'Descargar',
    SECTION_TITLE: {
      ROOM_SELECTOR: 'Selector de sala',
      WIDGET_MANAGER: 'Administrador de widget'
    },
    ROOMS: {
      NONE: 'No se encontraron salas'
    },
    FORM: {
      WIDGET_STATUS: 'Estado del widget',
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      PLACEMENT: 'Ubicación',
      CONTENT: 'Contenido',
      IN_SIDEBAR: 'En la barra lateral',
      ABOVE_LESSONS: 'Encima de las lecciones',
      PLEASE_ADD_TITLE: 'Por favor agregar título',
      TITLE: 'Título',
      TYPE: 'Tipo',
      PLEASE_ADD: 'Por favor agregar'
    },
    WIDGET_DESCRIPTION: {
      TEXT: 'Este es el widget de texto predeterminado. Úselo si desea mostrar un mensaje/notificación de texto a los estudiantes en su sala.',
      QUOTES:
        'Agregue varias citas encima de las lecciones o en la barra lateral para inspirar a sus estudiantes.',
      CALL: 'Este es un widget básico para publicar los enlaces de zoom/meet/teams que utilizará para comunicarse con sus estudiantes.',
      FILE: 'Este es un widget básico para compartir sus archivos de drive/onedrive/dropbox para las tareas de los estudiantes, etc.'
    }
  }
};

const classRoomDict: ClassroomDictInterface = {
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
    TITLE: 'Aula',
    LIST_TITLE: 'Aulas',
    LESSON: 'Lección',
    LIST_LESSON: 'Lecciones',
    ASSESSMENT: 'Evaluación',
    SURVEY: 'Encuesta',
    LESSON_PLANNER: 'Planificador de Lecciones',
    ASSESSMENT_TITLE: 'Encuestas y Evaluaciones',
    STEP: 'Paso',
    UNIT_TITLE: 'Seleccionar Unidad',
    UNIT_SUB_TITLE: 'Seleccionar unidad para ver lista de lecciones correspondientes',
    LESSON_TITLE: 'Seleccionar Lección',
    LESSON_SUB_TITLE: 'Haz clic en la lección que deseas enseñar',
    LESSON_SUB_TITLE_ASYNC:
      'Actualmente estás siguiendo las lecciones "a tu propio ritmo", lo que significa que puedes entrar en cualquier lección en cualquier momento',
    BOTTOM_BAR: {
      START: 'INICIAR',
      DISABLE: 'DESACTIVAR',
      ENABLE: 'ACTIVAR',
      TEACH: 'ENSEÑAR',
      ACTIVE: 'ACTIVO',
      COMPLETED: 'COMPLETADO',
      OPENED: 'ABERTO',
      CLOSED: 'FECHADO',
      SURVEY: 'ENCUESTA',
      UPCOMING: 'PRÓXIMAMENTE',
      GO_TO_NOTEBOOK: 'Ir a Cuaderno'
    },
    LESSON_TABS: {
      TAB_ONE: 'Lección de hoy',
      TAB_TWO: 'Enseñar Lecciones'
    },
    MESSAGES: {
      SELECT_SYLLABUS: 'Seleccione una cohorte para ver las unidades aplicables...',
      NO_SYLLABUS: 'Sin unidades...',
      SELECT_CLASSROOM: 'Selecciona un aula para ver las lecciones aplicables...',
      NO_LESSONS: 'Sin lecciones...',
      SELECT_CLASSROOM_WIDGETS: '⬆ Selecciona una sala para ver los widgets editables...',
      PLEASE_WAIT: 'Por favor espera'
    }
  }
};

const lessonPlannerDict: LessonPlannerDictInterface = {
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
    INTRO: 'Introducción',
    WARM_UP: 'Calentamiento',
    CORE_LESSON: 'Lección Principal',
    ACTIVITY: 'Actividad',
    CHECKPOINT: 'Punto de Control',
    OUTRO: 'Despedida',
    BREAKDOWN: 'Desglose',
    NA: 'n/a',
    WARMUP_BREAKDOWN: 'Calentamiento/Desglose',
    CORELESSON_BREAKDOWN: 'Lección Principal/Desglose',
    ACTIVITY_BREAKDOWN: 'Actividad/Desglose',
    OTHER_LABELS: {
      ROOM_NAME: 'Sala',
      STUDDENT_ONLINE: 'Tamaño de la Clase',
      TOPIC: 'Tema',
      START_DATE: 'Fecha de Inicio',
      EST_TIME: 'Tiempo de la Lección Programada',
      LESSON_CONTROL: 'Control de la Lección',
      COLUMN: {
        ONE: 'Nombre',
        TWO: 'Página Actual',
        THREE: 'Acción'
      },
      STUDENT_SECTION: {
        IN_CLASS: 'En Clase',
        NOT_IN_CLASS: 'No En Clase',
        ON_DEMAND: 'Auto-Dirigido (No en Línea /Lección)'
      }
    },
    ACCESS_BUTTONS: {
      START: 'Comenzar',
      COMPLETE: 'Completar'
    }
  }
};

const InstitutionDict: InstitutionDictInterface = {
  EN: {
    TITLE: 'INSTITUTIONS MANAGEMENT',
    SUBTITLE: 'Institutions List',
    TABLE: {
      NAME: 'Institute Name',
      TYPE: 'Type',
      WEBSITE: 'Website',
      CONTACT: 'Contact No',
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
    TITLE: 'GESTIÓN DE INSTITUCIONES',
    SUBTITLE: 'Lista de Instituciones',
    TABLE: {
      NAME: 'Nombre de la Institución',
      TYPE: 'Tipo',
      WEBSITE: 'Sitio Web',
      CONTACT: 'Contacto',
      ACTION: 'Acciones',
      NORESULT: 'Sin Resultados'
    },
    SHOWPAGE: 'Mostrando Pagina',
    OF: 'de',
    PAGES: 'páginas',
    SORTBY: 'Organizar Por',

    BUTTON: {
      Add: 'Agregar Nueva Institución'
    }
  }
};

const Institute_info: InstitutionInfoInterface = {
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
      USER_REGISTRY: 'User Registry',
      CLASS_MANAGER: 'Classroom Builder',
      REGISTER_NEW_USER: 'Register New User',
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
      GAME_CHANGERS: 'Game Changers',
      EDIT_PROFILE: 'Edit Profile',
      DICTIONARY: 'Dictionary',
      TEST_CASES: 'Test Cases',
      ERRORS: 'Errors',
      UPLOAD_LOGS: 'Upload Logs',
      ADD_NEW_COURSE: 'Add new course',
      ADD_NEW_UNIT: 'Add new unit',
      ADD_NEW_LESSON: 'Add new lesson',
      ADD_NEW_ROOM: 'Add new classroom'
    }
  },
  ES: {
    TITLE: 'Información General',
    ADDRESS: 'Dirección',
    CONTACT: 'Número de Contacto',
    INSTITUTION_TYPE: 'Tipo de Institución',
    WEBSITE: 'Visitar Su Sitio Web',
    SERVICE_PROVIDER: 'Proveedor de Servicios',
    TABS: {
      SERVICE_PROVIDER: 'Proveedores de Servicios',
      STAFF: 'Administrador de Personal',
      CLASS_MANAGER: 'Constructor de Salones de Clases',
      LIVE_CLASS_ROOM: 'Salón de Clases en Vivo',
      USER_REGISTRY: 'Registro de Usuarios',
      REGISTER_NEW_USER: 'Registrar Nuevo Usuario',
      COURSE_MANAGER: 'Constructor de Cursos',
      COURSES: 'Administrador de Cursos',
      UNITS: 'Administrador de Unidades',
      COMMUNITY_MANAGER: 'Administrador de Comunidad',
      INSTITUTION_MANAGER: 'Administrador de Institución',
      CLASSES: 'Clases',
      STUDENT_ROASTER: 'Lista de Estudiantes',
      CURRICULAR: 'Curso',
      CLASSROOMS: 'Administrador de Salones de Clases',
      GENERAL_INFORMATION: 'Información General',
      LESSONS: 'Administrador de Lecciones',
      RESEARCH_AND_ANALYTICS: 'Administrador de Analítica',
      DOWNLOAD_SURVEYS: 'Descargar Encuestas',
      UPLOAD_SURVEY: 'Subir Encuesta',

      DOWNLOAD_CSV: 'Descargar CSV',
      UPLOAD_CSV: 'Subir CSV',
      UPLOAD_TO_ATHENA: 'Subir a Athena',
      HOME: 'Tablero',
      NOTEBOOK: 'Libreta',
      COMMUNITY: 'Comunidad',
      GAME_CHANGERS: 'Innovadores',
      EDIT_PROFILE: 'Editar Perfil',
      DICTIONARY: 'Diccionario',
      TEST_CASES: 'Casos de Prueba',
      ERRORS: 'Errores',
      UPLOAD_LOGS: 'Subir Registros',
      ADD_NEW_COURSE: 'Agregar nuevo curso',
      ADD_NEW_UNIT: 'Agregar nueva unidad',
      ADD_NEW_LESSON: 'Agregar nueva lección',
      ADD_NEW_ROOM: 'Agregar nuevo salón de clases'
    }
  }
};

const InstitutionEditDict: InstitutionEditDictInterface = {
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
    INFO: 'Haga clic en el círculo de arriba para actualizar la imagen de la institución.',
    FORM: {
      TITLE: 'Información general y gestión de proveedores',
      INSTITUTION_TYPE: 'Tipo de institución',
      NAME_INPUT_LABEL: 'Nombre de la institución',
      NAME_INPUT_PLACEHOLDER: 'por ejemplo, Artista Iconoclasta',
      WEBSITE_INPUT_LABEL: 'Sitio web(*por favor ingrese la URL completa)',
      WEBSITE_INPUT_PLACEHOLDER: 'por ejemplo, https://artistasiconoclastas.org/',
      ADDRESS_INPUT_LABEL: 'Línea de dirección 1',
      ADDRESS2_INPUT_LABEL: 'Línea de dirección 2',
      CITY_LABEL: 'Ciudad',
      STATE_LABEL: 'Estado',
      ZIP_LABEL: 'Código postal',
      PHONE_LABEL: 'Teléfono',
      SERVICEPROVIDER_LABEL_WITH_NAME: 'es un proveedor de servicios',
      SERVICEPROVIDER_LABEL_WITHOUT_NAME: 'Proveedor de servicios'
    },
    INSTITUTION_TYPE: {
      SCHOOL: 'Escuela',
      AFTERSCHOOL: 'Escuela después de clases',
      DAYCAMP: 'Campamento de día',
      SUMMERCAMP: 'Campamento de verano',
      C3: '501C3'
    },
    BUTTON: {
      CANCEL: 'Cancelar',
      SAVE: 'Guardar'
    },
    messages: {
      namerequired: 'El nombre de la institución es obligatorio.',
      typerequired: 'El tipo de institución es obligatorio.',
      unabletoupdate:
        'No se pueden actualizar los detalles de la institución. Por favor, inténtelo de nuevo más tarde.',
      saveMsg: 'Detalles de la institución guardados correctamente',
      uploaderr:
        'No se puede cargar la imagen. Por favor, inténtelo de nuevo más tarde. ',
      deleterr: 'Error al eliminar la imagen de la institución.',
      imgeerr:
        'No se pueden actualizar los cambios de imagen. Por favor, inténtelo de nuevo más tarde.'
    }
  }
};

const InstitutionAddDict: InstitutionAddDictInterface = {
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
    INFOA: 'Haga clic en el círculo para administrar su avatar.',
    INFO: 'Haga clic en el círculo de arriba para actualizar la imagen de la institución.',
    TITLE: 'Añadir institución',
    SUBTITLE: 'Añadir nueva institución a la lista',
    FORM: {
      TITLE: 'Información general y gestión de proveedores',
      INSTITUTION_TYPE: 'Tipo de institución',
      NAME_INPUT_LABEL: 'Nombre de la institución',
      NAME_INPUT_PLACEHOLDER: 'por ejemplo, Artista Iconoclasta',
      WEBSITE_INPUT_LABEL: 'Sitio web(*por favor ingrese la URL completa)',
      WEBSITE_INPUT_PLACEHOLDER: 'por ejemplo, https://artistasiconoclastas.org/',
      ADDRESS_INPUT_LABEL: 'Línea de dirección 1',
      ADDRESS2_INPUT_LABEL: 'Línea de dirección 2',
      CITY_LABEL: 'Ciudad',
      STATE_LABEL: 'Estado',
      ZIP_LABEL: 'Código postal',
      PHONE_LABEL: 'Teléfono',
      state: 'Seleccione el estado',
      SERVICEPROVIDER_LABEL_WITH_NAME: 'es un proveedor de servicios',
      SERVICEPROVIDER_LABEL_WITHOUT_NAME: 'Proveedor de servicios'
    },
    SERVICE_VENDORS: 'Vendedores de servicios',
    INSTITUTION_TYPE: {
      SCHOOL: 'Escuela',
      AFTERSCHOOL: 'Escuela después de clases',
      DAYCAMP: 'Campamento de día',
      SUMMERCAMP: 'Campamento de verano',
      C3: '501C3'
    },
    BUTTON: {
      CANCEL: 'Cancelar',
      SAVE: 'Guardar'
    },
    messages: {
      namerequired: 'El nombre de la institución es obligatorio.',
      saveMsg: 'Detalles de la institución guardados correctamente',
      uploaderr:
        'No se puede cargar la imagen. Por favor, inténtelo de nuevo más tarde. ',
      adderr:
        'No se puede agregar una nueva institución. Por favor, inténtelo de nuevo más tarde.'
    }
  }
};

const InstitutionBuilderDict: InstitutionBuilderDictInterface = {
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
    GENERAL_INFORMATION: 'Información General',
    INFOA: 'Haga clic en el círculo para administrar su avatar.',
    INFO: 'Haga clic en el círculo de arriba para actualizar la imagen de la institución.',
    TITLE: 'Añadir institución',
    SUBTITLE: 'Añadir nueva institución a la lista',
    FORM: {
      TITLE: 'Información general y gestión de proveedores',
      INSTITUTION_TYPE: 'Tipo de institución',
      NAME_INPUT_LABEL: 'Nombre de la institución',
      NAME_INPUT_PLACEHOLDER: 'por ejemplo, Artista Iconoclasta',
      WEBSITE_INPUT_LABEL: 'Sitio web(*por favor ingrese la URL completa)',
      WEBSITE_INPUT_PLACEHOLDER: 'por ejemplo, https://artistasiconoclastas.org/',
      ADDRESS_INPUT_LABEL: 'Línea de dirección 1',
      ADDRESS2_INPUT_LABEL: 'Línea de dirección 2',
      CITY_LABEL: 'Ciudad',
      STATE_LABEL: 'Estado',
      ZIP_LABEL: 'Código postal',
      PHONE_LABEL: 'Teléfono',
      state: 'Seleccione el estado',
      SERVICEPROVIDER_LABEL_WITH_NAME: 'es un proveedor de servicios',
      SERVICEPROVIDER_LABEL_WITHOUT_NAME: 'Proveedor de servicios'
    },
    SERVICE_VENDORS: 'Vendedores de servicios',
    INSTITUTION_TYPE: {
      SCHOOL: 'Escuela',
      AFTERSCHOOL: 'Escuela después de clases',
      DAYCAMP: 'Campamento de día',
      SUMMERCAMP: 'Campamento de verano',
      C3: '501C3'
    },
    BUTTON: {
      CANCEL: 'Cancelar',
      SAVE: 'Guardar'
    },
    messages: {
      namerequired: 'El nombre de la institución es obligatorio.',
      saveMsg: 'Detalles de la institución guardados correctamente',
      uploaderr:
        'No se puede cargar la imagen. Por favor, inténtelo de nuevo más tarde. ',
      adderr:
        'No se puede agregar una nueva institución. Por favor, inténtelo de nuevo más tarde.'
    }
  }
};

const Institute_class: InstituteClassInterface = {
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
    TITLE: 'CLASES DE INSTITUTO',
    NO: 'No.',
    CLASSNAME: 'Nombre de la clase',
    ACTION: 'Acciones',
    EDIT: 'Editar',
    INFO: 'Este instituto no tiene ninguna clase. Por favor, cree una nueva clase.',
    BUTTON: {
      ADD: 'Nueva clase'
    }
  }
};
const InstitueCurriculum: InstituteCurriculumInterface = {
  EN: {
    TITLE: 'Course List',
    BUTTON: {
      ADD: 'New Course'
    },
    NO: 'No.',
    NAME: 'Course Name',
    INSTITUTION_NAME: 'Institution Name',
    COURSE_TYPE: 'Course Type',
    UNITS: 'Course Units',
    ACTION: 'Actions',
    VIEW: 'View',
    INFO: 'This institute does not have any course. Please create a new course.',
    NO_DELETE: '(Course in use)',
    LOADING: 'Loading Courses...',
    SELECT_INSTITUTION: 'Select Institution'
  },
  ES: {
    TITLE: 'Lista de Cursos',
    BUTTON: {
      ADD: 'Nuevo Curso'
    },
    NO: 'No.',
    NAME: 'Nombre del Curso',
    INSTITUTION_NAME: 'Nombre de la Institución',
    COURSE_TYPE: 'Tipo de Curso',
    UNITS: 'Unidades del Curso',
    ACTION: 'Acciones',
    VIEW: 'Ver',
    INFO: 'Este instituto no tiene ningún curso. Por favor, cree un nuevo curso.',
    NO_DELETE: '(Curso en uso)',
    LOADING: 'Cargando Cursos...',
    SELECT_INSTITUTION: 'Seleccionar Institución'
  }
};

const InstitueRomms: InstitueRommsInterface = {
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
    TITLE: 'Lista de Aulas',
    NO: 'No.',
    CLASSROOMS_NAME: 'Nombre del Aula',
    CLASS_NAME: 'Nombre de la Clase',
    INSTITUTION_NAME: 'Nombre de la Institución',
    TEACHER: 'Profesor',
    CO_TEACHER: 'Co Profesores',
    CURRICULUM: 'Curso',
    STATUS: 'Estado',
    MXSTUDENTS: 'Max. de Estudiantes',
    ACTION: 'Acciones',
    EDIT: 'Editar',
    messages: {
      nothaveclass:
        'Este instituto no tiene ninguna clase. Por favor, cree una nueva clase.',
      fetcherr:
        'Error al cargar los datos del aula. Por favor, inténtelo de nuevo más tarde.'
    },
    BUTTON: {
      ADD: 'Nueva Aula'
    },
    LOADING: 'Cargando Aulas...',
    SELECT_STAFF: 'Seleccionar Personal',
    SELECT_INSTITUTION: 'Seleccionar Institución'
  }
};

const classBuilderdict: ClassBuilderdictInterface = {
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
    TITLE: 'Crear Nueva Clase',
    SUBTITLE: 'Agregar nueva clase a la lista',
    NAME_LABEL: 'Nombre de la Clase',
    HEADING: 'INFORMACIÓN DE LA CLASE',
    HEADING2: 'ESTUDIANTES',
    MEMBER_PLACEHOLDER: 'Agregar nuevo estudiante',

    BUTTON: {
      ADD: 'Agregar',
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    },
    MESSAGES: {
      ERROR: {
        FETCHSTUDENT:
          'Error al obtener la lista de estudiantes. Por favor, inténtelo de nuevo o puede agregarlos más tarde.',
        FETCHINSTITUTION:
          'Error al obtener la lista de instituciones. Por favor, inténtelo de nuevo más tarde.',
        STUDENTADDERROR:
          'Error al agregar datos de estudiantes. Puede agregarlos por separado de la clase.',
        SAVECLASSERROR:
          'No se puede guardar la nueva clase. Por favor, inténtelo de nuevo más tarde.',
        PROCESSINGERROR:
          'Error en el procesamiento. Por favor, inténtelo de nuevo más tarde.',
        INVALIDPATH:
          'Ruta inválida. Por favor, vuelva a la página de selección de instituciones para seleccionar su instituto.'
      },
      VALIDATION: {
        NAME: 'Se requiere el nombre de la clase. Por favor, ingrese.',
        INSTITUTE: 'Seleccione una institución para agregar la clase.',
        CLASSNAME: 'Este nombre de clase ya existe. Por favor, agregue otro nombre.'
      },
      SUCCESS: {
        CLASSSAVE: 'Se han guardado los detalles de la nueva clase.'
      }
    }
  }
};

const CourseBuilderDict: CourseBuilderDictInterface = {
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
        fetchlist: 'Error while fetching course list, please try again later.',
        FETCH_COURSE_ERR: 'Error while fetching course data, please try again later.',
        FETCH_UNIT_ERR: 'Error while fetching units, please try again later.',
        UPDATE_ERROR: 'Error while updating course, please try again later.'
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
    TITLE: 'Crear Nuevo Curso',
    SUBTITLE: 'Agregar nuevo curso a la lista',
    HEADING: 'INFORMACIÓN DEL CURSO',
    NAME: 'Nombre del Curso',
    LANGUAGE: 'Seleccione Idioma',
    DESIGNER: 'Seleccione Diseñadores',
    TYPE: 'Seleccione Tipo',
    SUMMARY: 'Resumen',
    DESCRIPTION: 'Descripción',
    OBJECT: 'Objetivo',
    ADD_NEW_UNIT: 'Nueva Unidad',
    SELECT_UNIT: 'Seleccionar Unidad',
    NO_UNIT: 'No hay unidades asignadas al curso',
    TABLE_HEADS: {
      NUMBER: 'No.',
      LESSONS: 'Lecciones',
      OBJECTIVES: 'Objetivo',
      UNIT_NAME: 'Nombre de la Unidad',
      ACTION: 'Acciones'
    },
    MESSAGES: {
      ERROR: {
        save: 'No se puede guardar el nuevo curso. Por favor, inténtelo de nuevo más tarde.',
        fetch:
          'No se pueden obtener las listas de instituciones. Por favor, inténtelo más tarde.',
        designerlist:
          'Error al obtener la lista de diseñadores. Por favor, inténtelo de nuevo más tarde.',
        process: 'Error en el procesamiento. Por favor, inténtelo de nuevo más tarde.',
        invalid:
          'Ruta inválida. Por favor, vuelva a la página de selección de instituciones para seleccionar su instituto.',
        fetchlist:
          'Error al obtener la lista de cursos. Por favor, inténtelo de nuevo más tarde.',
        FETCH_COURSE_ERR:
          'Error al obtener los datos del curso. Por favor, inténtelo de nuevo más tarde.',
        FETCH_UNIT_ERR:
          'Error al obtener las unidades. Por favor, inténtelo de nuevo más tarde.',
        UPDATE_ERROR: 'Error al actualizar el curso, por favor inténtalo más tarde.'
      },
      validation: {
        name: 'Se requiere el nombre del curso. Por favor, ingrese el nombre.',
        institute: 'Seleccione una institución para agregar el curso.',
        curricular: 'Este nombre de curso ya existe. Por favor, agregue otro nombre.'
      },
      success: {
        save: 'Se ha guardado el nuevo curso correctamente.'
      }
    },
    BUTTON: {
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    }
  }
};

const CurricularBuilderdict: CurricularBuilderdictInterface = {
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
    TITLE: 'Crear Nuevo Curso',
    SUBTITLE: 'Agregar nuevo curso a la lista',
    HEADING: 'INFORMACIÓN DEL CURSO',
    NAME: 'Nombre del Curso',
    LANGUAGE: 'Seleccionar Idioma',
    DESIGNER: 'Seleccionar Diseñadores',
    TYPE: 'Seleccionar Tipo',
    SUMMARY: 'Resumen',
    DESCRIPTION: 'Descripción',
    OBJECT: 'Objetivo',
    messages: {
      error: {
        save: 'No se puede guardar el nuevo curso. Por favor, inténtelo de nuevo más tarde.',
        fetch:
          'No se pueden obtener las listas de instituciones. Por favor, inténtelo más tarde.',
        designerlist:
          'Error al obtener la lista de diseñadores. Por favor, inténtelo de nuevo más tarde.',
        process: 'Error en el procesamiento. Por favor, inténtelo de nuevo más tarde.',
        invalid:
          'Ruta inválida. Por favor, vuelva a la página de selección de instituciones para seleccionar su instituto.'
      },
      validation: {
        name: 'Se requiere el nombre del curso. Por favor, ingrese el nombre.',
        institute: 'Seleccione una institución para agregar el curso.',
        curricular: 'Este nombre de curso ya existe. Por favor, agregue otro nombre.'
      },
      success: {
        save: 'Se ha guardado el nuevo curso correctamente.'
      }
    },
    BUTTON: {
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    }
  }
};
const RoomBuilderdict: RoomBuilderdictInterface = {
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
      errupdatingclass: 'Error while updating classroom. Please try again later.',
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
    TITLE: 'Crear Nueva Aula',
    SUBTITLE: 'Agregar nueva aula a la lista',
    HEADING: 'INFORMACIÓN DEL AULA',
    NAME_LABEL: 'Nombre del Aula',
    NAME_PLACEHOLDER: 'Agregar nombre del aula',
    TEACHER_LABEL: 'Profesor',
    CO_TEACHER_LABEL: 'Co-Profesores',
    TEACHER_PLACEHOLDER: 'Seleccionar profesor',
    CO_TEACHER_PLACEHOLDER: 'Seleccionar Co-Profesores',
    CLASS_NAME_LABEL: 'Nombre de la Clase',
    CLASS_NAME_PLACEHOLDER: 'Seleccionar Clase',
    CURRICULUM_LABEL: 'Curso',
    CURRICULUM_PLACEHOLDER: 'Seleccionar Curso',
    INSTITUTION_LABEL: 'Institución',
    INSTITUTION_PLACEHOLDER: 'Seleccionar Institución',
    STATUS_LABEL: 'Estado',
    STATUS_PLACEHOLDER: 'Seleccionar Estado',
    MAXSTUDENT_LABEL: 'Máximo número de estudiantes',
    MAXSTUDENT_PLACHOLDER: 'Máximo de estudiantes',
    BUTTON: {
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    },
    messages: {
      errupdatingclass:
        'Error al actualizar el aula. Por favor, inténtelo de nuevo más tarde.',
      error: {
        institutebefor: 'Por favor, cree una institución antes de crear un aula.',
        institutelist:
          'Error al obtener la lista de instituciones. Por favor, inténtelo de nuevo más tarde.',
        staffmember:
          'Por favor, cree primero un miembro del personal para su institución.',
        teacherlist:
          'Imposible obtener la lista de profesores. Por favor, inténtelo de nuevo más tarde.',
        createclass: 'Por favor, cree primero una clase para su institución.',
        classlist:
          'Imposible obtener la lista de clases. Por favor, inténtelo de nuevo más tarde.',
        curricular:
          'Imposible obtener la lista de cursos. Por favor, inténtelo de nuevo más tarde.',
        process: 'Error al procesar, por favor, inténtelo de nuevo más tarde.',
        classroomadd:
          'Error al agregar un curso de aula. Por favor, inténtelo de nuevo más tarde.',
        ecreateclass: 'Error al crear el aula. Por favor, inténtelo de nuevo más tarde.',
        invalid:
          'Ruta inválida, por favor, vuelva a la página de selección de instituciones para seleccionar su institución.'
      },
      validation: {
        classroomname: 'Se requiere el nombre del aula, por favor, ingrese el nombre.',
        institute: 'Por favor, seleccione una institución para agregar el aula.',
        teacher: 'Por favor, seleccione un profesor para el aula.',
        class: 'Por favor, seleccione una clase para el aula.',
        maxstudent: 'Por favor, establezca el límite máximo de estudiantes para el aula.',
        allowstudent: 'Un aula puede permitir un máximo de 30 estudiantes.',
        classroomexist: 'Este nombre de aula ya existe, por favor, agregue otro nombre.'
      },
      success: {
        classroomdetail: 'Se han guardado los detalles del nuevo aula.',
        newclassroom: 'Se han guardado los detalles del nuevo aula.'
      }
    }
  }
};

const EditCurriculardict: EditCurriculardictInterface = {
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
    TITLE: 'Modificar Curso',
    SUBTITLE: 'Actualizar información del curso',
    HEADING: 'INFORMACIÓN DEL CURSO',
    NAME: 'Nombre del Curso',
    LANGUAGE: 'Seleccionar Lenguaje',
    DESIGNER: 'Seleccionar Diseñadores',
    TYPE: 'Seleccionar Tipo',
    SUMMARY: 'Resumen',
    DESCRIPTION: 'Descripción',
    OBJECTIVE: 'Objetivo',
    messages: {
      fetcherr:
        'Error al obtener la lista de Diseñadores. Por favor, inténtelo de nuevo más tarde.',
      curricularchange: 'Se han guardado los cambios del curso.',
      updateerror:
        'Error al actualizar los datos del curso, por favor inténtelo más tarde.',
      unablefetch:
        'Imposible obtener la lista de instituciones. Por favor, inténtelo más tarde.',
      processerr: 'Error al procesar, por favor, inténtelo de nuevo más tarde.',
      namerequired: 'Se requiere el nombre del curso, por favor, ingrese el nombre.',
      selectinstitute: 'Por favor, seleccione una institución para agregar el curso.',
      nameexist: 'Este nombre de curso ya existe, por favor, agregue otro nombre.',
      fetchinger:
        'Error al obtener los datos del curso, por favor, inténtelo de nuevo más tarde.'
    },
    BUTTON: {
      SAVE: 'Guardar',
      CANCEL: 'Cancelar'
    }
  }
};

const RoomEDITdict: RoomEDITdictInterface = {
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
    METHOD: 'Select Teaching Style',
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
      mxstudent: 'Please set Max students limit for the Classroom.',
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
    TITLE: 'Editar Aula',
    SUBTITLE: 'Editar información del aula',
    HEADING: 'Información del aula',
    NAME_LABEL: 'Nombre del Aula',
    NAME_PLACEHOLDER: 'Agregar nombre del Aula',
    TEACHER_LABEL: 'Profesor',
    TEACHER_PLACEHOLDER: 'Seleccionar profesor',
    CO_TEACHER_LABEL: 'Co-profesores',
    METHOD: 'Seleccione el Estilo de Enseñanza',
    CO_TEACHER_PLACEHOLDER: 'Seleccionar Co-profesor',
    CLASS_NAME_LABEL: 'Nombre de la Clase',
    CLASS_NAME_PLACEHOLDER: 'Seleccionar Clase',
    CURRICULUM_LABEL: 'Curso',
    ACTIVE_UNIT_LABEL: 'Unidad Activa (Entorno del Aula)',
    ACTIVE_UNIT_PLACEHOLDER: 'Seleccionar Unidad Activa',
    CURRICULUM_PLACEHOLDER: 'Seleccionar Curso',
    STATUS_LABEL: 'Estado',
    STATUS_PLACEHOLDER: 'Seleccionar Estado',
    INSTITUTION_LABEL: 'Institución',
    INSTITUTION_PLACEHOLDER: 'Seleccionar Institución',
    MAXSTUDENT_LABEL: 'Número Máximo de Estudiantes',
    MAXSTUDENT_PLACHOLDER: 'Máximo de estudiantes',
    CONFERENCE_CALL_LINK_LABEL: 'Enlace de llamada',
    CONFERENCE_CALL_LINK_PLACEHOLDER: 'Ingrese el enlace de zoom, teams o meets aquí',
    LOCATION_LABEL: 'Ubicación del Aula',
    LOCATION_PLACEHOLDER: 'Ingrese la ubicación aquí',
    CLASS_DETAILS_TAB_HEADING: 'Detalles de la Clase',
    CLASS_DETAILS_TAB_DESCRIPTION: 'Crea un aula',
    CLASS_STUDENT_TAB_HEADING: 'Estudiantes',
    CLASS_STUDENT_TAB_DESCRIPTION: 'Agregar estudiantes al aula',
    CLASS_DYNAMICS_TAB_HEADING: 'Dinámica de Clase (opcional)',
    CLASS_DYNAMICS_TAB_DESCRIPTION:
      'Administra la competencia de asignaturas y crea compañeros de curso y grupos de estudiantes',
    CLASS_UNIT_PLANNER_TAB_HEADING: 'Planificador de Unidades',
    CLASS_UNIT_PLANNER_TAB_DESCRIPTION:
      'Establece el calendario de tu clase y confirma las fechas de las lecciones',
    TAB_DISABLED_TOOLTIP_TEXT: 'Agrega detalles del aula en el paso 1 para continuar',
    messages: {
      institutebefor: 'Cree una institución antes de crear un aula.',
      unabletofetch:
        'No se puede recuperar la lista de instituciones. Inténtelo de nuevo más tarde.',
      addstaffirst:
        'Agregue primero el miembro del personal para la institución seleccionada o seleccione otra institución.',
      unableteacher:
        'No se pueden recuperar la lista de profesores. Inténtelo de nuevo más tarde.',
      addclassfirst:
        'Agregue primero la clase para la institución seleccionada o seleccione otra institución.',
      unableclass:
        'No se pueden recuperar la lista de clases. Inténtelo de nuevo más tarde.',
      unablecurricular:
        'No se pueden recuperar la lista de cursos. Inténtelo de nuevo más tarde.',
      errorprocess: 'Error al procesar. Inténtelo de nuevo más tarde.',
      classroomrequired:
        'El nombre del aula es obligatorio, por favor ingrese el nombre.',
      selectinstitute: 'Seleccione una institución para agregar un aula.',
      selectteacher: 'Seleccione un profesor para el aula.',
      selectCurriculum: 'Seleccione un curso para el aula.',
      selectclass: 'Seleccione una clase para el aula.',
      mxstudent: 'Establezca el límite máximo de estudiantes para el Aula.',
      oneclass: 'Un Aula puede permitir un máximo de 30 estudiantes.',
      alreadyexist: 'Este nombre de Aula ya existe, por favor agregue otro nombre.',
      classupdate: 'Se han actualizado los detalles del Aula.',
      errupdating: 'Error al actualizar el curso del Aula. Por favor intente más tarde.',
      errprocess: 'Error al procesar. Inténtelo de nuevo más tarde.',
      errupdatingclass:
        'Error al actualizar los detalles del Aula. Por favor intente más tarde.',
      errfetch: 'Error al recuperar los datos del Aula, inténtelo de nuevo más tarde.'
    },
    BUTTON: {
      SAVE: 'Guardar',
      SAVING: 'Guardando...',
      CANCEL: 'Cancelar'
    }
  }
};

const RoomDetailsDict: RoomDetailsDictInterface = {
  EN: {
    COURSE_DETAILS: 'Course Details',
    COURSE_FREQUENCY: 'Course Schedule',
    COURSE_PARTNERS: 'Course Partners',
    SUBJECT_PROFICIENCY: 'Subject Proficiency'
  },
  ES: {
    COURSE_DETAILS: 'Detalles del curso',
    COURSE_FREQUENCY: 'Horario del curso',
    COURSE_PARTNERS: 'Socios del curso',
    SUBJECT_PROFICIENCY: 'Nivel de dominio del tema'
  }
};

const GroupFormDict: GroupFormDictInterface = {
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
    HEADING: 'Detalles del grupo',
    LABELS: {
      GROUP_NAME: 'Nombre del grupo',
      ADVISOR: 'Asesor',
      LOCATION: 'Ubicación',
      STUDENTS: 'Estudiantes'
    },
    PLACEHOLDERS: {
      GROUP_NAME: 'Introduce el nombre del grupo',
      ADVISOR: 'Selecciona un asesor para el grupo',
      LOCATION: 'Introduce la ubicación'
    },
    MESSAGES: {
      GROUP_NAME: 'Nombre del grupo es obligatorio',
      GROUP_ADVISOR: 'Asesor del grupo es obligatorio'
    }
  }
};

const CourseScheduleDict: CourseScheduleDictInterface = {
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
    HEADING: 'Detalles del horario',
    PLACEHOLDERS: {
      START_DATE: 'Fecha de inicio',
      END_DATE: 'Fecha de finalización',
      START_TIME: 'Hora de inicio',
      END_TIME: 'Hora de finalización',
      WEEK_DAY: 'Día de la semana',
      FREQUENCY: 'Frecuencia',
      CONFERENCE_CALL_LINK: 'Enlace de llamada de conferencia',
      LOCATION: 'Ubicación',
      ADDITIONAL_NOTES: 'Notas adicionales sobre el horario'
    },
    MESSAGES: {
      START_DATE: 'Fecha de inicio es obligatoria',
      END_DATE: 'Fecha de finalización es obligatoria',
      START_TIME: 'Hora de inicio es obligatoria',
      END_TIME: 'Hora de finalización es obligatoria',
      SUCCESS_MESSAGE: 'Horario del curso actualizado correctamente'
    }
  }
};

const curricularviewdict: CurricularViewInterface = {
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
    TITLE: 'Constructor de cursos',
    SUBTITLE: 'Construye cursos, unidades y planes de lecciones aquí',
    HEADING: 'INFORMACIÓN GENERAL',
    NAME: 'Nombre del curso',
    OWNER: 'Dueño de la institución',
    DESCRIPTION: 'Descripción',
    DESIGNER: 'Diseñadores',
    LANGUAGE: 'Idiomas',
    OBJECTIVE: 'Objetivo',
    TAB: {
      UNIT: 'Unidades',
      LEARINGOBJECTIVE: 'Objetivos de aprendizaje',
      INFORMATION: 'Demografía e información'
    }
  }
};

const CHECKPOINTSDICT: CHECKPOINTSDICTInterface = {
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
    TITLE: 'Demografía e información del curso',
    INFO: 'Este curso aún no tiene ningún punto de control. Por favor cree uno nuevo.',
    FETCH: 'Recopilando datos Por favor espere...',
    BUTTON: {
      ADDEXISTING: 'Añadir punto de control existente',
      ADDNEW: 'Añadir nuevo punto de control'
    }
  }
};

const LEARINGOBJECTIVEDICT: LEARINGOBJECTIVEDICTInterface = {
  EN: {
    TITLE: 'LEARNING OBJECTIVES',
    INFO: 'This course does not have any learning objectives yet. Please create a new one.',
    FETCH: 'Fetching Data Please wait...',
    BUTTON: {
      ADD: 'Add Learning Objective',
      EDIT: 'Edit Learning Objective'
    }
  },
  ES: {
    TITLE: 'OBJETIVOS DE APRENDIZAJE',
    INFO: 'Este curso aún no tiene ningún objetivo de aprendizaje. Por favor cree uno nuevo.',
    FETCH: 'Recopilando datos Por favor espere...',
    BUTTON: {
      ADD: 'Añadir objetivo de aprendizaje',
      EDIT: 'Editar objetivo de aprendizaje'
    }
  }
};

const SYLLABUS: SYLLABUSInterface = {
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
    TITLE: 'UNIDADES DEL CURSO',
    NO: 'No.',
    NAME: 'Nombre de la unidad',
    ACTION: 'Acciones',
    EDIT: 'Editar',
    INFO: 'Este curso no tiene ninguna unidad. Por favor cree una nueva.',
    FETCH: 'Recopilando detalles...',
    ADDNEW: 'Añadir nueva unidad'
  }
};

const Measurementdict: MeasurementDictInterface = {
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
    NO: 'No.',
    MEASUREMENT: 'Mediciones',
    ACTION: 'Acciones',
    EDIT: 'Editar',
    INFO: 'Este tema no tiene ninguna medición. Por favor cree una nueva.',
    ADDNEW: 'Añadir nueva medición',
    FETCH: 'Recopilando lista de mediciones...'
  }
};

const TOPICLISTDICT: TOPICLISTDICTInterface = {
  EN: {
    TOPIC: 'Topics',
    EDIT: 'Edit',
    INFO: 'This learning objective does not have any topics. Please create a new one.',
    ADD: 'Add Topic',
    ADDNEW: 'Add New Topic',
    FETCH: 'Fetching topics list...'
  },
  ES: {
    TOPIC: 'Temas',
    EDIT: 'Editar',
    INFO: 'Este objetivo de aprendizaje no tiene ningún tema. Por favor cree uno nuevo.',
    ADD: 'Agregar tema',
    ADDNEW: 'Añadir nuevo tema',
    FETCH: 'Recopilando lista de temas...'
  }
};

const ADDLEARINGOBJDICT: ADDLEARINGOBJDICTInterface = {
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
    TITLE: 'Agregar objetivo de aprendizaje',
    SUBTITLE: 'Agregar nuevo objetivo de aprendizaje.',
    HEADING: 'INFORMACIÓN DEL OBJETIVO DE APRENDIZAJE',
    NAME: 'Nombre del objetivo de aprendizaje',
    DESC: 'Descripción',
    SAVE: 'Guardar',
    VALIDATION: 'Se requiere el nombre'
  }
};

const addQuestionDict: addQuestionDictInterface = {
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
    heading: 'AGREGAR NUEVA PREGUNTA DE PUNTO DE CONTROL',
    q: 'Pregunta',
    qlabel: 'Etiqueta de la pregunta',
    selecttype: 'Seleccionar tipo',
    selectpl: 'Tipo',
    selectlang: 'Seleccionar idioma',
    selectlanpl: 'Idioma',
    addOption: 'Agregar opciones:',
    otheropt: "Agregar una opción de respuesta 'Otra' y un campo de comentario",
    nonefabove: "Agregar una opción de respuesta 'Ninguna de las anteriores'",
    messages: {
      qrequired: 'Se requiere la entrada de la pregunta',
      qtyperequired: 'Se requiere el tipo de pregunta',
      qlabelrequired: 'Se requiere la etiqueta de la pregunta',
      qdetailsave: 'Se han guardado los detalles de la pregunta.',
      unabletosave:
        'No se pueden guardar los detalles de la pregunta, Por favor, inténtelo de nuevo más tarde.'
    },
    Button: {
      save: 'Guardar',
      cancel: 'Cancelar'
    }
  }
};

const SelectPreviousQuestionDict: SelectPreviousQuestionDictInterface = {
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
    heading: 'SELECCIONAR NUEVA PREGUNTA DE PUNTO DE CONTROL',
    qselectd: 'Preguntas seleccionadas',
    selection: 'Selección',
    question: 'Pregunta',
    type: 'Tipo',
    language: 'Idioma',
    qempty: 'El banco de preguntas está vacío, por favor cree una nueva pregunta.',
    error:
      'Error al obtener la lista de preguntas, por favor inténtelo de nuevo más tarde.',
    wait: 'Obteniendo detalles de la pregunta, por favor espere...',
    button: {
      save: 'Guardar',
      cancel: 'Cancelar'
    }
  }
};

const AddMeasurementDict: AddMeasurementDictInterface = {
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
    title: 'Agregar Medida',
    subtitle: 'Agregar nueva medida al curso.',
    heading: 'Información de la medida',
    mlabel: 'Nombre de la medida',
    selecttopic: 'Seleccione el tema',
    topic: 'Tema',
    criterialabel: 'Criterios',
    distinlabel: 'Distinguido',
    excell: 'Excelente',
    adequate: 'Adecuado',
    basic: 'Básico',
    button: {
      save: 'Guardar',
      cancel: 'Cancelar'
    },
    messages: {
      namerequired: 'Se requiere el nombre',
      topicrequired: 'Se requiere el tema'
    }
  }
};

const AddProfileCheckpointDict: AddProfileCheckpointDictInterface = {
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
    title: 'Agregar punto de control',
    subtitle: 'Agrega un nuevo punto de control al curso.',
    heading: 'AGREGAR NUEVO PUNTO DE CONTROL',
    label: 'Título',
    checkpointlabel: 'Etiqueta del punto de control',
    selectdesigner: 'Selecciona diseñadores',
    placeholder: 'Diseñadores',
    languageselect: 'Selecciona el idioma',
    typeSelect: 'Selecciona el tipo',
    typePlaceholder: 'Público',
    placeholderlanguage: 'Idioma',
    checkpointq: 'Preguntas del punto de control',
    addquestion: 'Agrega preguntas a este punto de control.',
    no: 'No.',
    question: 'Pregunta',
    type: 'Tipo',
    option: 'Opciones',
    button: {
      existing: 'Agregar preguntas existentes',
      newq: 'Crear nueva pregunta',
      cancel: 'Cancelar',
      save: 'Guardar',
      saving: 'Guardando ...'
    },
    messages: {
      unsave:
        'No se puede guardar los detalles del punto de control. Por favor, inténtalo de nuevo más tarde.',
      titlerequired: 'Se requiere el título del punto de control',
      labelrequired: 'Se requiere la etiqueta del punto de control',
      minone:
        'Necesitas agregar por lo menos una pregunta para crear un punto de control.',
      noquestion: 'Este punto de control no tiene preguntas'
    }
  }
};

const SyllabusDict: SyllabusDictInterface = {
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
      fetcher: 'Error while fetching lessons list data.',
      wantsave: 'Do you want to save changes before moving forward?',
      fetchlist: 'Error while fetching lessons list data.',
      fetchdesign: 'Error while fetching Designers list Please try again later.',
      UPDATE_ERROR: 'Error while updating please try again later.'
    }
  },
  ES: {
    TITLE: 'Constructor de unidades',
    LESSON_PLAN: 'GESTOR DE PLAN DE LECCIÓN',
    ADD_NEW_LESSON: 'Nueva lección',
    ADD_UNIT: 'Agregar unidad',
    SELECT_LESSON: 'Selecciona una lección',
    HEADING: 'INFORMACIÓN DE UNIDAD',
    LESSON_PLAN_HEADING: 'GESTOR DE PLAN DE LECCIÓN',
    TABLE_HEADS: {
      NUMBER: 'No.',
      LESSON_NAME: 'Nombre de la lección',
      MEASUREMENTS: 'Medidas',
      TYPE: 'Tipo',
      ACTION: 'Acciones'
    },
    MESSAGES: {
      fetcher: 'Error al obtener datos de la lista de lecciones.',
      wantsave: '¿Quieres guardar los cambios antes de continuar?',
      fetchlist: 'Error al obtener datos de la lista de lecciones.',
      fetchdesign:
        'Error al obtener la lista de diseñadores. Por favor, inténtalo de nuevo más tarde.',
      UPDATE_ERROR: 'Error al actualizar, por favor inténtalo de nuevo más tarde.'
    }
  }
};

const AddSyllabusDict: AddSyllabusDictInterface = {
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
    title: 'Constructor de unidad',
    subtitle: 'Crea unidades del curso aquí.',
    heading: 'INFORMACIÓN DE UNIDAD',
    unitname: 'Nombre de la unidad',
    designer: 'Seleccionar diseñadores',
    placeholder: 'Diseñadores',
    language: 'Selecciona el idioma',
    placeholderlanguage: 'Idioma',
    description: 'Descripción',
    purpose: 'Pregunta esencial',
    priority: 'Estándares prioritarios',
    secondary: 'Estándares secundarios',
    objective: 'Objetivos de los estudiantes',
    methodology: 'Metodología',
    policy: 'Políticas',
    save: 'Guardar',
    saving: 'Guardando ...',
    messages: {
      fetcherr:
        'Error al obtener la lista de diseñadores. Por favor, inténtalo de nuevo más tarde.',
      unitupdate: 'Se han actualizado los detalles de la unidad.',
      unablesave:
        'No se puede guardar la nueva unidad. Por favor, inténtalo de nuevo más tarde.',
      namerequired: 'El nombre de la unidad es obligatorio. Por favor, ingresa un nombre.'
    }
  }
};

const AddTopicDict: AddTopicDictInterface = {
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
    title: 'Agregar Tema',
    subtitle: 'Agregar un nuevo tema al curso.',
    heading: 'INFORMACIÓN DEL TEMA',
    topicname: 'Nombre del Tema',
    learningobj: 'Seleccionar Objetivo de Aprendizaje',
    learningobjpl: 'Objetivo de Aprendizaje',
    description: 'Descripción',
    button: {
      cancel: 'Cancelar',
      save: 'Guardar'
    },
    messages: {
      namerequired: 'Se requiere el nombre',
      objectiverequired: 'Se requiere el objetivo de aprendizaje'
    }
  }
};

const EditLearningObjectiveDict: EditLearningObjectiveDictInterface = {
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
    title: 'Editar Objetivo de Aprendizaje',
    subtitle: 'Editar el objetivo de aprendizaje del curso.',
    heading: 'INFORMACIÓN DEL OBJETIVO DE APRENDIZAJE',
    learningname: 'Nombre del Objetivo de Aprendizaje',
    description: 'Descripción',
    fetching: 'Obteniendo datos...',
    button: {
      cancel: 'Cancelar',
      save: 'Guardar'
    },
    messages: {
      namerequired: 'Se requiere el nombre'
    }
  }
};

const EditMeasurementDict: EditMeasurementDictInterface = {
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
    title: 'Editar Medición',
    subtitle: 'Editar la medida del curso.',
    heading: 'INFORMACIÓN DE LA MEDICIÓN',
    labelmeasur: 'Nombre de la Medición',
    seltopic: 'Seleccionar Tema',
    topic: 'Tema',
    criteria: 'Criterios',
    distinguished: 'Destacado',
    excell: 'Excelente',
    adequite: 'Adecuado',
    basic: 'Básico',
    fetching: 'Obteniendo datos...',
    button: {
      cancel: 'Cancelar',
      save: 'Guardar'
    },
    messages: {
      namerequierd: 'Se requiere el nombre',
      topicrequired: 'Se requiere el tema'
    }
  }
};

const EditProfileCheckpointDict: EditProfileCheckpointDictInterface = {
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
    title: 'Agregar Punto de Control',
    subtitle: 'Agregar nuevo punto de control al curso.',
    heading: 'AGREGAR NUEVO PUNTO DE CONTROL',
    ltitle: 'Título',
    checklabel: 'Etiqueta de Punto de Control',
    designer: 'Seleccionar Diseñadores',
    language: 'Seleccionar idioma',
    planguage: 'Idioma',
    checkpoint: 'Preguntas del Punto de Control',
    addquestion: 'Por favor agregar preguntas a este punto de control.',
    addexist: 'Agregar Preguntas Existentes',
    addnew: 'Crear Nueva Pregunta',
    no: 'No.',
    question: 'Pregunta',
    type: 'Tipo',
    option: 'Opciones',
    noquestion: 'Este punto de control no tiene preguntas',
    save: 'Guardar',
    saving: 'Guardando...',
    messages: {
      saveerr:
        'No se pueden guardar los detalles del Punto de Control, por favor inténtelo de nuevo más tarde.',
      title: 'Se requiere el título del punto de control',
      label: 'Se requiere la etiqueta del punto de control',
      onequetion:
        'Es necesario agregar al menos una pregunta para crear un punto de control.',
      fetcherr:
        'No se pueden obtener los detalles del Punto de Control, por favor inténtelo de nuevo más tarde.'
    }
  }
};

const EditSyllabusDict: EditSyllabusDictInterface = {
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
    title: 'Constructor de Unidades',
    subtitle: 'Actualizar las unidades del plan de estudios aquí.',
    heading: 'INFORMACIÓN GENERAL',
    unitname: 'Nombre de la Unidad',
    designer: 'Seleccionar Diseñadores',
    pdesigner: 'Diseñadores',
    selectlang: 'Seleccionar Idioma',
    language: 'Idioma',
    desc: 'Descripción',
    purpose: 'Propósito',
    objective: 'Objetivos',
    methodology: 'Metodología',
    policy: 'Políticas',
    lessonplan: 'ADMINISTRADOR DEL PLAN DE CLASES',
    selectlesson: 'Seleccionar Clase',
    no: 'No.',
    name: 'Nombre de la Clase',
    measurement: 'Mediciones',
    type: 'Tipo',
    status: 'Estado',
    action: 'Acciones',
    edit: 'Editar',
    nolesson: 'No se han seleccionado clases',
    createnew: 'Crear Nueva Clase',
    messages: {
      wantsave: '¿Desea guardar los cambios antes de continuar?',
      unitupdate: 'Los detalles de la unidad han sido actualizados.',
      unableupdate:
        'No se puede actualizar los detalles de la unidad, por favor inténtelo de nuevo más tarde.',
      namerequired: 'Se requiere el nombre de la unidad, por favor ingrese un nombre.',
      updateerr:
        'Error al actualizar el estado de la lección, por favor inténtelo más tarde.',
      fetcher: 'Error al obtener los datos de la unidad.',
      fetchlist: 'Error al obtener la lista de clases por favor inténtelo más tarde.',
      fetchdesign:
        'Error al obtener la lista de diseñadores, por favor inténtelo más tarde.'
    }
  }
};

const EditTopicDict: EditTopicDictInterface = {
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
    title: 'Editar Tema',
    subtitle: 'Editar el tema de un curso.',
    heading: 'INFORMACIÓN DEL TEMA',
    topicname: 'Nombre del Tema',
    selectlearning: 'Seleccionar Objetivo de Aprendizaje',
    learningobjective: 'Objetivo de Aprendizaje',
    desc: 'Descripción',
    fetching: 'Obteniendo datos...',
    Distinguished: 'Distinguido',
    Excelled: 'Excelente',
    Adequate: 'Adecuado',
    Basic: 'Básico',
    button: {
      cancel: 'Cancelar',
      save: 'Guardar'
    },
    messages: {
      namerequired: 'Se requiere el nombre',
      learningobj: 'Se requiere el objetivo de aprendizaje'
    }
  }
};

const ProfileCheckpointlookupDict: ProfileCheckpointlookupDictInterface = {
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
    title: 'Seleccionar Punto de Control',
    subtitle: 'Seleccionar punto de control para el curso.',
    heading: 'LISTAS DE PUNTOS DE CONTROL',
    selectcheckpoint: 'Puntos de Control Seleccionados',
    selection: 'Selección',
    checkpoint: 'Título del Punto de Control',
    language: 'Idioma',
    listempty:
      'La otra lista de puntos de control está vacía, por favor cree un nuevo punto de control.',
    errfetch:
      'Error al obtener la lista de puntos de control. Por favor inténtelo de nuevo más tarde.',
    updating: 'Actualizando puntos de control, por favor espere...',
    fetching: 'Obteniendo lista de puntos de control, por favor espere...',
    button: {
      cancel: 'Cancelar',
      save: 'Guardar',
      saving: 'Guardando...'
    }
  }
};

const RegistrationDict: RegistrationDictInterface = {
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
    title: 'Registrar Nuevo Usuario',
    subtitle: 'Agregar nuevo usuario a la lista',
    requiredfield: 'Campos obligatorios',
    firstname: 'Nombre',
    firstplaceholder: 'Juan',
    lastname: 'Apellido',
    lastplaceholder: 'Pérez',
    email: 'Correo electrónico',
    emailplaceholder: 'correo@correo.com',
    GROUP_PLACEHOLDER: 'Seleccionar grupo para el estudiante',
    role: 'Rol',
    roles: {
      sup: 'Super Admin',
      adm: 'Admin',
      bld: 'Constructor',
      flw: 'Compañero',
      crd: 'Coordinador',
      tr: 'Profesor',
      st: 'Estudiante'
    },
    class: 'Clase',
    status: 'Estado',
    statusPlaceholder: 'Elegir Estado',
    paceLabel: 'Elegir Velocidad',
    paceCheckBox: 'Autoestudio',
    button: {
      submit: 'Enviar'
    },
    messages: {
      emailerr:
        'Por favor asegúrese de que el correo electrónico del usuario sea correcto',
      existemail: 'Ya existe una cuenta con este correo electrónico',
      firstname: 'El nombre del usuario no puede estar vacío',
      lastname: 'El apellido del usuario no puede estar vacío',
      email: 'El correo electrónico del usuario no puede estar vacío',
      emailaddress: 'El correo electrónico del usuario no está en el formato esperado',
      userrol: 'El rol del usuario no puede estar vacío',
      loading: 'Cargando...',
      institution: 'La institución no puede estar vacía',
      GROUP_NO_OPTION: 'Seleccionar clase primero',
      GROUP_NO_OPTION_AFTER_FETCH: 'No se encontró ningún grupo',
      ROLE_NO_OPTION: 'Seleccionar rol primero'
    }
  }
};

const UserDict: UserDictInterface = {
  EN: {
    title: 'USER INFORMATION'
  },
  ES: {
    title: 'INFORMACIÓN DE USUARIO'
  }
};

const UserEditDict: UserEditDictInterface = {
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
    heading: 'Editar Información Personal',
    firstname: 'Nombre',
    lastname: 'Apellido',
    nickname: 'Apodo',
    status: 'Estado',
    inactive_date: 'Fecha de Inactividad o Suspensión',
    status_reason: 'Razón de Inactividad o Suspensión',
    role: 'Rol',
    button: {
      save: 'Guardar',
      cancel: 'Cancelar'
    },
    ondemand: 'Autoestudio',
    SUPER_ADMIN: 'Super Admin'
  }
};

const UserInformationDict: UserInformationDictInterface = {
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
    heading: 'Información Personal',
    demographics: 'Datos Demográficos',
    private: 'Privado',
    details: 'Detalles Privados',
    fullname: 'Nombre Completo',
    nickname: 'Apodo',
    role: 'Rol',
    status: 'Estado',
    email: 'Correo electrónico',
    account: 'Cuenta Creada',
    ondemand: 'Autoestudio',

    LOCATION: 'Ubicación',
    SUPER_ADMIN: 'Super Admin',
    RESET_PASSWORD: 'Restablecer contraseña',
    RESETTING_PASSWORD: 'Restableciendo contraseña',
    MESSAGE: {
      RESET_PASSWORD_SUCCESS: 'Contraseña restablecida correctamente',
      RESET_PASSWORD_FAILURE: 'Error al restablecer la contraseña'
    }
  }
};

const UserLookupDict: UserLookupDictInterface = {
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
    title: 'GESTIÓN DE USUARIOS',
    subtitle: 'Lista de Personas',
    sortby: 'Ordenar por',
    name: 'Nombre',
    role: 'Rol',
    location: 'Ubicación',
    flow: 'Flow',
    status: 'Estado',
    action: 'Acciones',
    noresult: 'Sin resultados',
    button: {
      add: 'Agregar Nuevo Usuario'
    }
  }
};

const UserLookupWithTokenDict: UserLookupDictInterface = {
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
    title: 'GESTIÓN DE USUARIOS',
    subtitle: 'Lista de Personas',
    sortby: 'Ordenar por',
    name: 'Nombre',
    role: 'Rol',
    institution: 'Institución',
    status: 'Estado',
    action: 'Acciones',
    noresult: 'Sin resultados',
    button: {
      add: 'Agregar Nuevo Usuario'
    }
  }
};

const AddQuestionModalDict: AddQuestionModalDictInterface = {
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
    TITLE: 'AGREGAR PREGUNTA',
    HEADING:
      '*Haga clic aquí para agregar preguntas, directamente desde las preguntas creadas anteriormente.',
    QUESTION: 'Pregunta',
    NOTELABEL: 'Notas',
    QUESTIONLABEL: 'Etiqueta de Pregunta',
    LANGUAGE: 'Idioma',
    TYPE: 'Tipo',
    MAKEQUESTIONREQUIRED: 'Hacer que esta pregunta sea obligatoria',
    ADDOPTION: 'Agregar Opciones:',
    ADDOTHEROPTION: 'Agregar una opción de respuesta "Otro" o campo de comentarios',
    ADDNOTEABOVE: 'Agregar una opción de respuesta "Ninguno de los anteriores"',
    BUTTON: {
      NEXT: 'Siguiente Pregunta',
      CANCEL: 'Cancelar',
      SAVE: 'Guardar'
    }
  }
};

const EditQuestionModalDict: EditQuestionModalDictInterface = {
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
    TITLE: 'Editar PREGUNTA',
    HEADING:
      '*Haga clic aquí para agregar preguntas, directamente desde las preguntas creadas anteriormente.',
    QUESTION: 'Pregunta',
    NOTELABEL: 'Notas',
    QUESTIONLABEL: 'Etiqueta de Pregunta',
    LANGUAGE: 'Idioma',
    TYPE: 'Tipo',
    MAKEQUESTIONREQUIRED: 'Hacer que esta pregunta sea obligatoria',
    ADDOPTION: 'Agregar Opciones:',
    ADDOTHEROPTION: 'Agregar una opción de respuesta "Otro" o campo de comentarios',
    ADDNOTEABOVE: 'Agregar una opción de respuesta "Ninguno de los anteriores"',
    BUTTON: {
      NEXT: 'Siguiente Pregunta',
      CANCEL: 'Cancelar',
      SAVE: 'Guardar',
      SAVING: 'Guardando'
    },
    VALIDATION: {
      TITLE: 'El título del checkpoint es obligatorio',
      LABEL: 'La etiqueta del checkpoint es obligatoria',
      ESTIMATE: 'Se requiere un tiempo estimado para el checkpoint',
      ENTERVALIDNUMBER: 'Por favor ingrese un número válido, es decir, 30.',
      MINIMUMONE: 'Debe agregar al menos una pregunta para crear un checkpoint'
    },
    MESSAGES: {
      UNABLESAVE:
        'No se pudo guardar los detalles del checkpoint, por favor inténtelo de nuevo más tarde.'
    }
  }
};

const AddNewCheckPointDict: AddNewCheckPointDictInterface = {
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
    BUILDER: 'Constructor',
    CREATENEW: 'Crear Nuevo Checkpoint',
    TITLE: 'Título',
    CHECKPOINTLABEL: 'Etiqueta de Checkpoint',
    SUBTITLE: 'Subtítulo',
    LANGUAGE: 'Seleccionar Idioma',
    DESIGNER: 'Seleccionar Diseñadores',
    ESTIMATE: 'Tiempo Estimado (min) ',
    CHECKPOINTQUESTION: 'Preguntas del Checkpoint:',
    ADDQUESTION: 'Por favor agregue preguntas al constructor de checkpoints',
    NO: 'No.',
    QUESTION: 'Pregunta',
    TYPE: 'Tipo',
    REQUIRED: 'Es Requerido',
    OPTION: 'Opciones',
    NOQUESTION: 'Este checkpoint no tiene preguntas',

    BUTTON: {
      ADDEXIST: 'Agregar Preguntas Existente',
      CREATE: 'Crear Nueva Pregunta',
      CANCEL: 'Cancelar',
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    },
    MESSAGES: {
      UNABLESAVE:
        'No se pudieron guardar los detalles del checkpoint, por favor inténtelo de nuevo más tarde.'
    },
    VALIDATION: {
      TITLE: 'El título del checkpoint es obligatorio',
      LABEL: 'La etiqueta del checkpoint es obligatoria',
      ESTIMATETIME: 'Se requiere un tiempo estimado para el checkpoint',
      VALIDNUMBER: 'Por favor ingrese un número válido, es decir, 30.',
      ONEQUESTION: 'Debe agregar al menos una pregunta para crear un checkpoint'
    }
  }
};
const AddNewQuestionDict: AddNewQuestionDictInterface = {
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
    BUILDER: 'Constructor',
    CHECKPOINT: 'Checkpoints',
    ADDNEWQUESTION: 'Agregar Nueva Pregunta',
    QUESTION: 'Pregunta',
    QUESTIONLABEL: 'Etiqueta de Pregunta',
    SELECTTYPE: 'Seleccione Tipo',
    SELECTLANGUAGE: 'Seleccione Idioma',
    LANGUAGE: 'Idioma',
    MAKEQUESTION: 'Hacer que esta pregunta sea obligatoria',
    ADDOPTION: 'Agregar Opciones:',
    ADDOTHEROPTION: 'Agregar una opción de respuesta "Otro" o campo de comentarios',
    ADDNONOFABOVE: 'Agregar una opción de respuesta "Ninguno de los anteriores"',
    BUTTON: {
      CANCEL: 'Cancelar',
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    },
    VALIDATION: {
      QUESTION: 'Se requiere una pregunta',
      TYPE: 'Se requiere un tipo de pregunta',
      LABEL: 'Se requiere una etiqueta de pregunta'
    },
    MESSAGES: {
      QUESTIONSAVE: 'Los detalles de la pregunta se han guardado.',
      UNABLESAVE:
        'No se pudo guardar los detalles de la pregunta, por favor inténtelo de nuevo más tarde.'
    }
  }
};
const CheckpointLookupDict: CheckpointLookupDictInterface = {
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
    BUILDER: 'Constructor',
    PREVIOUSCHECKPOINT: 'Checkpoints Anteriores',
    CHEKPOINTSELECTED: 'Checkpoints Seleccionados',
    SELECTION: 'Selección',
    CHECKPOINTTITLE: 'Título del Checkpoint',
    LANGUAGE: 'Idioma',
    BUTTON: {
      SAVE: 'Guardar',
      CANCEL: 'Cancelar'
    }
  }
};
const CheckpointQueTableDict: CheckpointQueTableDictInterface = {
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
    NO: 'No.',
    QUESTION: 'Pregunta',
    TYPE: 'Tipo',
    NOQUESTIONCHECKPOINT: 'Este checkpoint no tiene preguntas',
    FETCHERR:
      'Error al recuperar las preguntas del checkpoint, por favor intente más tarde...',
    FETCHING: 'Recuperando preguntas del checkpoint, por favor espere...',

    BUTTON: {
      EDIT: 'Editar Checkpoint',
      REMOVE: 'Eliminar Checkpoint'
    }
  }
};

const EditCheckPointDict: EditCheckPointDictInterface = {
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
    BUILDER: 'Constructor',
    EDITCHECKPOINT: 'Editar Checkpoint',
    TITLE: 'Título',
    CHECKPOINTLABEL: 'Etiqueta de Checkpoint',
    SUBTITLE: 'Subtítulo',
    SELECTLANGUAGE: 'Seleccione Idioma',
    SELECTDESIGNER: 'Seleccione Diseñadores',
    ESTIMATE: 'Tiempo Estimado (min)',
    CHECKPOINTQUE: 'Preguntas del Checkpoint: ',
    ADDQUESTION: 'Por favor agregue preguntas al creador de checkpoint',
    NO: 'No.',
    QUESTION: 'Pregunta',
    TYPE: 'Tipo',
    REQUIRED: 'Es Obligatorio',
    OPTION: 'Opciones',
    NOQUESTION: 'Este checkpoint no tiene preguntas',

    BUTTON: {
      ADDEXIST: 'Agregar Preguntas Existentes',
      CREATE: 'Crear Nueva Pregunta',
      CANCEL: 'Cancelar',
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    },

    VALIDATION: {
      TITLE: 'Se require título de checkpoint',
      LABEL: 'Se requiere una etiqueta de checkpoint',
      ESTIMATE: 'Se requiere el tiempo estimado del checkpoint',
      ENTERVALIDNUMBER: 'Ingrese un número válido p.ej. 30.',
      MINIMUMONE: 'Debe agregar al menos una pregunta para crear un checkpoint.'
    },
    MESSAGES: {
      UNABLESAVE:
        'No se pudo guardar los detalles de checkpoint, por favor inténtelo de nuevo más tarde.'
    }
  }
};
const EditQuestionDict: EditQuestionDictInterface = {
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
    ASSESSMENTBUILDER: 'Constructor de Evaluación',
    CHECKPOINT: 'Checkpoints',
    EDITQUE: 'Editar Pregunta',
    QUESTION: 'Pregunta',
    QUESTIONLABEL: 'Etiqueta de Pregunta',
    SELECTTYPE: 'Seleccione Tipo',
    SELECTLANGUAGE: 'Seleccione Idioma',
    LANGUAGE: 'Idioma',
    QUEREQUIRED: 'Hacer que esta pregunta sea obligatoria',
    ADDOPTION: 'Agregar Opciones:',
    OTHEROPT: 'Agregar una opción de respuesta "Otro" o campo de comentarios',
    NONEOFABOVE: 'Agregar una opción de respuesta "Ninguno de los anteriores"',
    BUTTON: {
      CANCEL: 'Cancelar',
      SAVING: 'Guardando...',
      SAVE: 'Guardar'
    },
    VALIDATION: {
      INPUT: 'Se requiere una pregunta',
      TYPE: 'Se requiere un tipo de pregunta',
      LABEL: 'Se requiere una etiqueta de pregunta'
    },
    MESSAGES: {
      UNABLESAVE:
        'No se pudo guardar los detalles de la pregunta, por favor inténtelo de nuevo más tarde.'
    }
  }
};
const QuestionLookupDict = {
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
    BUILDER: 'Constructor',
    CHECKPOINT: 'Checkpoints',
    PREVQUE: 'Preguntas Anteriores',
    QUESELECT: 'Preguntas Seleccionadas',
    SELECTION: 'Selección',
    QUESTION: 'Pregunta',
    TYPE: 'Tipo',
    LANGUAGE: 'Idioma',
    QUEEMPTY: 'El banco de preguntas está vacío, por favor cree una nueva pregunta.',
    FETCHERR: 'Error al recuperar lista de preguntas, por favor intente más tarde.',
    FETCHING: 'Recuperando detalles de pregunta, por favor espere...',
    BUTTON: {
      CANCEL: 'Cancelar',
      SAVE: 'Guardar'
    }
  }
};

const SelectedCheckPointsListDict: SelectedCheckPointsListDictInterface = {
  EN: {
    BUILDER: 'Builder',
    ADDCHECKPOINT: 'Please add checkpoints to',
    BUTTON: {
      ADDEXIST: 'Add Existing Checkpoint',
      CREATE: 'Create New Checkpoint'
    }
  },
  ES: {
    BUILDER: 'Constructor',
    ADDCHECKPOINT: 'Por favor agrega checkpoints a',
    BUTTON: {
      ADDEXIST: 'Agregar checkpoint existente',
      CREATE: 'Crear nuevo checkpoint'
    }
  }
};

const AddNewLessonFormDict: AddNewLessonFormDictInterface = {
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
    TITLE: 'Descripción de la Lección',
    NAME: 'Nombre de la Lección',
    SELECTTYPE: 'Seleccionar Tipo',
    TYPE: 'Tipo',
    INSTITUTION: 'Institución',
    SELECTINSTITUTION: 'Seleccionar Institución',
    SELECT_TARGET_AUDIENCE: 'Seleccionar Audiencia Objetivo',
    SELECTLANG: 'Seleccionar Idioma',
    TARGET_AUDIENCE: 'Audiencia Objetivo',
    LANGUAGE: 'Idioma',
    SELECTDESIGNER: 'Seleccionar Diseñadores',
    DESIGNER: 'Diseñadores',
    DURATION: 'Duración (Sesiones)',
    MATERIALS: 'Materiales',
    PURPOSE: 'Propósito',
    OBJECTIVE: 'Objetivos de la Lección',
    REMINDERANDNOTES: 'Recordatorios y Notas',
    RESOURCES: 'Recursos',
    NOTES: 'Notas',
    SUMMARY: 'Resumen',
    IMAGE_CAPTION: 'Texto Sobrepuesto de Imagen',
    MEASUREMENTLESSON: 'Medidas de la Lección',
    SELECTMEASURE: 'Seleccionar Medida',
    NO: 'N°',
    MEASUREMENT: 'Medida',
    TOPIC: 'Tema',
    ACTION: 'Acción',

    VALIDATION: {
      NAME: 'El nombre de la lección es requerido',
      TYPE: 'El tipo de la lección es requerido',
      INSTITUTE: 'La institución es un campo requerido.',
      LANGUAGE: 'La selección del idioma es requerida',
      STUDENT_SUMMARY: 'El resumen del estudiante es requerido',
      IMAGE_CAPTION: 'El texto sobrepuesto para la imagen es requerido'
    },
    MESSAGES: {
      REMOVE: '¿Está seguro que desea remover esta medida?',
      ADDERR: 'Error al agregar la medida, por favor intente más tarde.',
      SAVE: 'Los detalles de la lección han sido guardados con éxito.',
      SAVEERR:
        'No fue posible guardar los detalles de la lección, por favor inténtelo más tarde.',
      UPDATE: 'Los detalles de la lección han sido actualizados con éxito.',
      UPDATEERR:
        'No fue posible actualizar los detalles de la lección, por favor inténtelo más tarde.',
      LESSONNOTHAVE:
        'Esta lección no tiene medidas asociadas, por favor agregue una nueva.',
      MEASUREMENTALREADYADDED: 'Esta medida ya ha sido agregada.',
      MEASUREMENTADDSUCCESS:
        'La lista de medidas de la lección ha sido actualizada con éxito.',
      NODESIGNEROPTION: 'Por favor seleccione una institución primero',
      LOADING: 'Cargando...'
    },
    NEXT: 'Siguiente',
    SAVE: 'Guardar',
    SAVING: 'Guardando...'
  }
};

const AssessmentInstuctionsDict: AssessmentInstuctionsDictInterface = {
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
    INSTRUCTION: 'Instrucciones',
    HEADING: 'INSTRUCCIONES: Complete lo siguiente para proveer información acerca de su',
    SAVE: 'Guardar',
    SAVING: 'Guardando...',
    MESSAGES: {
      INSTRUCTIONSAVE: 'Los detalles de las instrucciones han sido guardados con éxito.',
      UPDATEERR: 'Error al actualizar las instrucciones, por favor inténtelo más tarde.'
    }
  }
};

const GeneralInformationDict: GeneralInformationDictInterface = {
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
    HEADING: 'Descripción de la Lección',
    NAME: 'Nombre',
    SELECTDESIGNER: 'Seleccionar Diseñadores',
    DESIGNER: 'Diseñadores',
    LANGUAGE: 'Idioma',
    PURPOSE: 'Propósito',
    OBJECTIVE: 'Objetivo',
    SELECTTYPE: 'Seleccionar Tipo',
    TYPE: 'Tipo',
    INSTITUTION: 'Institución',
    SELECTINSTITUTION: 'Seleccionar Institución',
    SELECTLANG: 'Seleccionar Idioma',
    LESSONMEASUREMENT: 'Medidas de la Lección',
    SELECTMEASUREMENT: 'Seleccionar Medida',
    NO: 'N°',
    MEASUREMENT: 'Medida',
    TOPIC: 'Tema',
    ACTION: 'Acción',
    BUTTON: {
      ADD: 'Agregar',
      SAVE: 'Guardar',
      SAVING: 'Guardando...'
    },
    MESSAGES: {
      REMOVE: '¿Está seguro que desea remover esta medida?',
      DELETEERR: 'Error al borrar la medida, por favor intente más tarde.',
      ADDERR: 'Error al agregar la medida, por favor intente más tarde.',
      NAME: 'El nombre de la lección es requerido',
      FETCHERR:
        'No se pudo obtener los detalles de la medida, por favor intente más tarde.',
      UPDATESUCCESS: 'Los detalles de la lección han sido actualizados con éxito.',
      UPDATEERR:
        'No fue posible actualizar los detalles de la lección, por favor inténtelo más tarde.',
      LESSONNOTHAVE:
        'Esta lección no tiene medidas asociadas. Por favor agregue uno nuevo.'
    }
  }
};

const PreviousQuestionsDict: PreviousQuestionsDictInterface = {
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
    HEADING: 'Previously Used Questions',
    NO: 'No.',
    QUESTION: 'Pregunta',
    LABEL: 'Etiqueta',
    TYPE: 'Tipo',
    ACTION: 'Acción',
    WHERARE: '¿De dónde eres?',
    WHERYOU: '¿De-donde-eres?',
    TEXTINPUT: 'Entrada de texto',
    ADD: 'Agregar'
  }
};

const QuestionBuilderDict: QuestionBuilderDictInterface = {
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
    HEADING: 'Preguntas de Evaluación',
    NOTE: 'NOTA: Puede arrastrar y soltar las preguntas para cambiar su orden.',
    NO: 'N°',
    QUESTION: 'Pregunta',
    LABEL: 'Etiqueta',
    TYPE: 'Tipo',
    ACTION: 'Acción',
    WHERARE: '¿De dónde eres?',
    WHERYOU: '¿De-donde-eres?',
    TEXTINPUT: 'Entrada de texto'
  }
};

const UnitLookupDict: UnitLookupDictInterface = {
  EN: {
    HEADING: 'Assign Module',
    NOTE: 'NOTE: Please select course and then modules to add current session to that module.',
    NO: 'No.',
    CURRICULUMNAME: 'Course Name',
    NAME: 'Unit Name',
    INSTITUTION_NAME: 'Institution Name',
    UNITNAME: 'Module Name',
    LESSONS: 'Lesson Plan',
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
    HEADING: 'Asignar Módulo',
    NOTE: 'NOTA: Seleccione el curso y luego los módulos para agregar la sesión actual a ese módulo.',
    NO: 'No.',
    CURRICULUMNAME: 'Nombre del Curso',
    NAME: 'Nombre de la Unidad',
    INSTITUTION_NAME: 'Nombre de la Institución',
    UNITNAME: 'Nombre del Módulo',
    LESSONS: 'Plan de Lección',
    STATUS: 'Estado',
    ACTION: 'Acción',
    NOTADDED: 'Esta sesión no está agregada a ningún curso o módulo.',
    NO_UNIT_ADDED: 'Esta lección no está agregada a ninguna unidad.',
    NEW_UNIT: 'Nueva Unidad',
    UNIT_DETAILS: 'Ver detalles de la unidad',
    VIEW: 'Vista',
    INFO: 'Esta institución no tiene ninguna unidad. Por favor, cree una nueva unidad.',
    MESSAGES: {
      ADDED: 'La sesión se ha agregado con éxito.',
      ADDERR:
        'Error al agregar la sesión al módulo, por favor inténtelo de nuevo más tarde.',
      FETCHERR:
        'Error al buscar los datos de los módulos, por favor inténtelo de nuevo más tarde.'
    },
    NO_DELETE: '(Unidad en uso)',
    SELECT_INSTITUTION: 'Seleccionar Institución'
  }
};

const LessonBuilderDict: LessonBuilderDictInterface = {
  EN: {
    TITLE: 'LESSON MANAGER',
    SUBTITLE: 'Build lessons, surveys or assessments here.',
    OVEVIEW_TITLE: 'Overview',
    OVERVIEW_DESCRIPTION: 'Capture core details of lessons & surveys',
    ACTIVITY_TITLE: 'Lesson Plan',
    ACTIVITY_DESCRIPTION: 'Create & edit lesson & survey pages ',
    ACTIVITY_TOOLTIP: 'Add overview details in step 1 to continue',
    UNIT_MANAGER_TITLE: 'Unit Manager',
    UNIT_MANAGER_DESCRIPTION: 'Assign lesson & surveys to course units',
    UNIT_MANAGER_TOOLTIP: 'Create lesson activities in step 2 to continue',
    LEARNING_EVIDENCE_TITLE: 'Apply measurements lessons & surveys',
    LEARNING_EVIDENCE_DESCRIPTION: 'Apply measurements to lessons & surveys',
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
      PAGE_TITLE: 'Page Name',
      PLAN_LABEL: 'Lesson Page Label',
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
      ACTIVITY_LABEL: 'Page Label',
      ACTIVITY_NAME: 'Page Name',
      INTERACTION_TYPE: 'Interaction Type',
      INSTRUCTION: 'Instructions',
      ESTIMATED_TIME: 'Estimated Time',
      ACTION: 'Actions',
      ADD_NEW_ACTIVITY: 'New Page',
      HEADING: 'Lesson Plan Builder'
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
      LEARNING_OBJECTIVE: 'Learning Objectives',
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
    TITLE: 'MANAGER DE LECCIÓN',
    SUBTITLE: 'Construya lecciones, encuestas o evaluaciones aquí.',
    OVEVIEW_TITLE: 'Resumen',
    OVERVIEW_DESCRIPTION:
      'Capture los detalles principales de las lecciones y las encuestas.',
    ACTIVITY_TITLE: 'Plan de Lección',
    ACTIVITY_DESCRIPTION: 'Cree y edite las páginas de lecciones y encuestas.',
    ACTIVITY_TOOLTIP: 'Agregue los detalles principales en el paso 1 para continuar.',
    UNIT_MANAGER_TITLE: 'Manager de Unidad',
    UNIT_MANAGER_DESCRIPTION: 'Asigne lecciones y encuestas a las unidades del curso.',
    UNIT_MANAGER_TOOLTIP: 'Cree actividades de lección en el paso 2 para continuar.',
    LEARNING_EVIDENCE_TITLE: 'Aplicar medidas a las lecciones y encuestas.',
    LEARNING_EVIDENCE_DESCRIPTION: 'Aplicar medidas a las lecciones y encuestas.',
    LEARNING_EVIDENCE_TOOLTIP:
      'Asigne su lección a los cursos en el paso 3 para continuar.',
    BUTTON: {
      ADD_PLAN: 'Agregar nueva página',
      EDIT: 'Editar',
      VIEW: 'Ver',
      PREVIEW: 'Previsualizar',
      SAVE: 'Guardar',
      ADD_ROW: 'Agregar componente',
      DELETE: 'Eliminar',
      ADD_EVIDENCE: 'Agregar evidencia'
    },
    LESSON_PLAN_COLUMN: {
      ID: 'id',
      PAGE_TITLE: 'Nombre de la página',
      PLAN_LABEL: 'Etiqueta de la página de la lección',
      DESCRIPTION: 'Instrucciones',
      TAGS: 'Agregar etiquetas',
      ESTIMATED_TIME: 'Tiempo de lección programado',
      ACTIVITY_TYPE: 'Tipo de actividad',
      INTERACTION_TYPE: 'Tipo de interacción',
      ACTIVITY_INSTRUCTIONS: 'Instrucciones de la actividad',
      ACTION: 'Acciones',
      BUTTON: 'Crear plan de lección'
    },
    LESSON_CLASSROOM_ACTIVITY_TABLE: {
      ACTIVITY_LABEL: 'Etiqueta de la actividad',
      ACTIVITY_NAME: 'Nombre de la actividad',
      INTERACTION_TYPE: 'Tipo de interacción',
      INSTRUCTION: 'Instrucciones',
      ESTIMATED_TIME: 'Tiempo estimado',
      ACTION: 'Acciones',
      ADD_NEW_ACTIVITY: 'Nueva página',
      HEADING: 'Crea y edita Páginas de Lección / Encuesta'
    },
    LESSON_HOMEWORK_ACTIVITY_TABLE: {
      ACTIVITY_LABEL: 'Etiqueta de la actividad',
      ACTIVITY_NAME: 'Nombre de la actividad',
      INSTRUCTION: 'Instrucciones',
      ESTIMATED_TIME: 'Tiempo estimado',
      ACTION: 'Acciones',
      ADD_NEW_ACTIVITY: 'Nuevo Tarea',
      HEADING: 'Tareas/Desafíos'
    },
    LESSON_COURSES_UNIT_DETAIL_VIEW: {
      INSTITUTION: 'Institución',
      CLASSROOM: 'Aula',
      LEAD_INSTRUCTOR: 'Instructor Líder'
    },
    LEARNING_EVIDENCE_COLUMNS: {
      LEARNING_OBJECTIVE: 'Objetivos de aprendizaje',
      TOPICS: 'Temas',
      MEASUREMENTS: 'Medidas',
      EVIDENCE_ACTIVITY: 'Actividad de evidencia (página)',
      EVIDENCE_PLACE: 'Lugar de evidencia',
      ACTION: 'Acción',
      MEASURED: 'Medido',
      ADD_EVIDENCE: {
        OBJECTIVE: 'Objetivo',
        TOPICS: 'Temas',
        MEASUREMENTS: 'Medidas',
        ACTIVITY: 'Página de actividad'
      }
    },
    LESSON_PLAN_FORM: {
      DESCRIPTION: 'Descripción',
      ESTIMATED_TIME: 'Tiempo estimado',
      HEADING: 'Crea un nuevo plan de lección',
      ID: 'Id',
      LABEL: 'Etiqueta del plan de la lección',
      TITLE: 'Título de la página'
    },
    MESSAGES: {
      UNSAVE: 'Tiene cambios no guardados, ¿desea continuar?',
      PUBLISH_DISABLED_INFO:
        'Complete el resumen de la lección y las pestañas del plan para continuar'
    },
    INFORMATION_HEADING: 'Información General',
    NAME: 'Nombre de la Lección',
    OWNER: 'Propietario de la Institución',
    DESCRIPTION: 'Descripción',
    DESIGNER: 'Diseñadores',
    DURATION: 'Duración',
    LANGUAGE: 'Idiomas',
    LESSON_PLAN_LABEL: 'Etiqueta del plan de lección',
    OBJECTIVE: 'Objetivo',
    PURPOSE: 'Propósito',
    RESOURCES: 'Recursos',
    NOTES: 'Notas y reflexiones',
    SUMMARY: 'Resumen del alumno'
  }
};

const LessonEditDict: LessonEditDictInterface = {
  EN: {
    TITLE: 'LESSON PLAN BUILDER',
    SUBTITLE: 'Build lessons, surveys or assessments here.',
    MESSAGES: {
      UNSAVE: 'You have unsaved changes, do you still want to continue?'
    }
  },
  ES: {
    TITLE: 'CONSTRUCTOR DE PLAN DE LECCIÓN',
    SUBTITLE: 'Construye lecciones, encuestas o evaluaciones aquí.',
    MESSAGES: {
      UNSAVE: 'Tiene cambios no guardados. ¿Todavía desea continuar?'
    }
  }
};

const LessonsListDict: LessonsListDictInterface = {
  EN: {
    TITLE: 'LESSON LIST',
    HEADING: 'Lesson List',
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
    TITLE: 'LISTA DE LECCIONES',
    HEADING: 'Lista de lecciones',
    SUBTITLE: 'Todas las lecciones',
    SORTBY: 'Ordenar por',
    NO: 'No.',
    LESSONTITLE: 'Título de la lección',
    INSTITUTION_NAME: 'Nombre de la institución',
    SELECT_INSTITUTION: 'Seleccione una institución',
    TARGET_AUDIENCE: 'Público objetivo',
    TYPE: 'Tipo',
    LANGUAGE: 'Idioma',
    ACTION: 'Acciones',
    NORESULT: 'Sin resultados',
    BUTTON: {
      ADD: 'Agregar nueva lección',
      START_CLONING: 'Comenzar clonación',
      CLONING: 'Clonación'
    },
    NO_DELETE: '(Lección en uso)'
  }
};

const UniversalBuilderDict: UniversalBuilderDictInterface = {
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
    FETCHING: 'Recuperando páginas de lecciones...',
    GALLERY: {
      LESSON_PAGES: 'Páginas de lección'
    },
    TEMPLATES: {
      TITLE: 'Plantillas de lecciones'
    },
    FORMS: {
      FILE_UPLOAD_TEXT:
        'Arrastra y suelta {label} aquí, o haz clic para seleccionar {label}',
      VIDEO_URL_LABEL: 'URL de vídeo',
      VIDEO_SIZE_LABEL: 'Tamaño de vídeo',
      VIDEO_SIZE_PLACEHOLDER: 'Selecciona el tamaño de vídeo'
    },
    FORMS_ERROR_MSG: {
      IMAGE_REQUIRED: 'Por favor, sube una imagen',
      IMAGE_WIDTH:
        'Por favor, introduce un ancho válido para la imagen o déjalo en automático',
      IMAGE_HEIGHT:
        'Por favor, introduce una altura válida para la imagen o déjalo en automático',
      VIDEO_REQUIRED: 'Por favor, introduce la URL de vídeo de YouTube',
      VIDEO_INVALID: 'Por favor, introduce una URL de video de YouTube válida'
    }
  }
};

const CsvDict: CsvDictInterface = {
  EN: {
    TITLE: 'Select Survey',
    SELECT_INST: 'Select institute',
    SELECT_CLASSROOM: 'Select classroom',
    SELECT_FILTERS: 'Select Filters',
    SELECT_REASON: 'Select Reason',
    REASON: 'Reason....',
    UPLOAD_MULTIPLE_SURVEY_IMAGES: 'Upload Multipe Survey Images',
    DESCRIBE_REASON: 'Describe Reason'
  },
  ES: {
    TITLE: 'Seleccionar encuesta',
    SELECT_INST: 'Seleccionar institución',
    SELECT_CLASSROOM: 'Seleccionar aula',
    SELECT_FILTERS: 'Seleccionar filtros',
    SELECT_REASON: 'Seleccionar razón',
    REASON: 'Razón...',
    UPLOAD_MULTIPLE_SURVEY_IMAGES: 'Subir imágenes de encuestas múltiples',
    DESCRIBE_REASON: 'Describir razón'
  }
};

const DashboardDict: DashboardDictInterface = {
  EN: {
    YOUR_TEACHERS: 'Your Teachers',
    YOUR_CLASSROOMS: 'Your Classrooms',
    YOUR_STUDENTS: 'Your Students',
    YOUR_CLASSMATES: 'Your Classmates',
    GREETINGS_TEACHER: 'What do you want to teach today?',
    GREETINGS_STUDENT: 'What do you want to learn today?'
  },
  ES: {
    YOUR_TEACHERS: 'Tus profesores',
    YOUR_CLASSROOMS: 'Tus aulas',
    YOUR_STUDENTS: 'Tus estudiantes',
    YOUR_CLASSMATES: 'Tus compañeros de clase',
    GREETINGS_TEACHER: '¿Qué quieres enseñar hoy?',
    GREETINGS_STUDENT: '¿Qué quieres aprender hoy?'
  }
};

const LearningEvidenceDict: LearningEvidenceDictInterface = {
  EN: {
    TITLE: 'Add Measurements to Lesson'
  },
  ES: {
    TITLE: 'Agregar medidas a la lección'
  }
};

const CommonlyUsedDict: CommonlyUsedDictInterface = {
  EN: {
    BACK: 'Back',
    BACK_TO_LIST: 'Back to list',
    NO_SEARCH_RESULT: 'No data found'
  },
  ES: {
    BACK: 'Atrás',
    BACK_TO_LIST: 'Volver a la lista',
    NO_SEARCH_RESULT: 'No se encontraron resultados'
  }
};

const General: GeneralInterface = {
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
      TITLE: '¿Cómo te ha ido?',
      MODAL_TITLE: 'La historia detrás',
      NO_DATA: 'No se encontraron datos de sentimientos',
      EMOJIS: {
        AWFUL: 'terrible',
        BAD: 'malo',
        OKAY: 'normal',
        GOOD: 'bueno',
        GREAT: 'excelente'
      }
    }
  }
};

const StudentDict: StudentDictInterface = {
  EN: {
    NO_STUDENT: 'No Student Found'
  },
  ES: {
    NO_STUDENT: 'No se encontró ningún estudiante'
  }
};

const CommunityDict: CommunityDictInterface = {
  EN: {
    TITLE: 'Community',
    HEADER: 'Here is what is happening today',
    TABS: {
      FRONT_PAGE: 'Front page',
      COMMUNITY_BUILDER: 'Community Builder'
    }
  },
  ES: {
    TITLE: 'Comunidad',
    HEADER: 'Esto es lo que está sucediendo hoy',
    TABS: {
      FRONT_PAGE: 'Portada',
      COMMUNITY_BUILDER: 'Constructor de la comunidad'
    }
  }
};

export {
  AuthDict,
  CommunityDict,
  CsvDict,
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
