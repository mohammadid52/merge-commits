// Buttons
const BUTTONS: any = {
    'EN': {
        ADD: 'Add',
        ADD_NEW: 'Add New',
        EDIT: 'Edit',
        SAVE: 'Save',
        CANCEL: 'Cancel'
    },
    'ES': {
        ADD: 'Añadir',
        ADD_NEW: 'Añadir nuevo',
        EDIT: 'Edit',
        SAVE: 'Salvar',
        CANCEL: 'Cancelar'
    }
}

// Breadcrumbs
const BreadcrumsTitles: any = {
    'EN': {
        HOME: 'HOME',
        PROFILE: 'PROFILE',
        PEOPLE: 'PEOPLE',
        INSTITUTION_MANAGEMENT:'Institution Management',
        ADD_INSTITUTION:'Add New Institute',
        INSTITUTION_INFO:'Institute Info',
        Class_Creation:'Class Creation',
        CURRICULARBUILDER:'New Curriculum',
        CLASSROOM_CREATION:'Classroom Creation',
        EDITCLASS:'Edit Class',
        EDITCURRICULUM:'Edit Curriculm',
        EDITCLASSROOM:'Edit Classroom',
        CURRICULUMBUILDER:'Curriculum Builder',
        LEARINGOBJECTIVE:'Add Learning objective',
    },
    'ES': {
        HOME: 'CASA',
        PROFILE: 'PERFIL',
        PEOPLE: 'PERSONAS',
        INSTITUTION_MANAGEMENT:'TBD',
        ADD_INSTITUTION:'TBD',
        INSTITUTION_INFO:'TBD',
        Class_Creation:'TBD',
        CURRICULARBUILDER:'TBD',
        CLASSROOM_CREATION:'TBD',
        EDITCLASS:'TBD',
        EDITCURRICULUM:'TBD',
        EDITCLASSROOM:'TBD',
        CURRICULUMBUILDER:'TBD',
        LEARINGOBJECTIVE:'TBD'
    }
}
// Profile Display and edit section
const dashboardProfileDict: any = {
    'EN': {
        PROFILE: 'Profile',
        TITLE: 'USER PROFILE',
        PROFILE_INSTRUCTON:'Click the circle above to update profile picture.',
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
            ROLE: 'Role'
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
            CONTINUE_BTN:'Continue',
            ERRORS: {
                NO_OLD_PASS: 'Please enter your old password',
                NO_NEW_PASS: 'Please enter your new password',
                NO_CONFIRM_PASS: 'Please enter your confirmation password',
                NOT_MATCH: 'Your new password and confirm password do not match'
            }
        }
    },
    'ES': {
        PROFILE: 'Perfil',
        TITLE: 'PERFIL DEL USUARIO',
        PROFILE_INSTRUCTON:'Haga clic en el círculo de arriba para actualizar la imagen de perfil.',
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
            CONTINUE_BTN:'TBD',
            ERRORS: {
                NO_OLD_PASS: 'Ingrese su contraseña anterior',
                NO_NEW_PASS: 'Ingrese su nueva contraseña',
                NO_CONFIRM_PASS: 'Ingrese su contraseña de confirmación',
                NOT_MATCH: 'Su nueva contraseña y la contraseña de confirmación no coinciden',
            },
        }
    }
}

const anthologyDict: any = {
    'EN': {
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
            CANCEL: 'Cancel'
        },
    },
    'ES': {
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
            CANCEL: 'Cancelar'
        },
    },
};

// People - User management list
const manageusersDict: any = {
    'EN': {
        TITLE: 'USER MANAGEMENT',
        SUBTITLE: 'People\'s List',
        TABLE: {
            NAME: 'Name',
            ROLE: 'Role',
            INST: 'Institution',
            STATUS: 'Status',
            ACTIONS: 'Actions'
        },
        ADD_NEW: 'Add New Person'
    },
    'ES': {
        TITLE: 'GESTIÓN DE USUARIOS',
        SUBTITLE: "Lista de personas",
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
    'EN': {
        REGISTRATION: 'Registration',
        INSTITUTIONS: 'Institutions',
        PEOPLE: 'People',
        LESSON_PLANNER: 'Homeroom',
        CLASSROOM: 'Classroom',
        LESSON_BUILDER: 'Lesson Builder',
        ANTHOLOGY: 'Notebook',
        NOTICEBOARD: 'Noticeboard'
    },
    'ES': {
        REGISTRATION: 'Registro',
        INSTITUTIONS: 'Institución',
        PEOPLE: 'Personas',
        LESSON_PLANNER: 'Pasillo',
        CLASSROOM: 'Aula',
        LESSON_BUILDER: 'Constructor de lecciones',
        ANTHOLOGY: 'Cuaderno',
        NOTICEBOARD: 'Tablón de anuncios'
    }
}

const appDict: any = {
    'EN': {
        LOG_OUT: 'Log Out',
        LOADING: 'Give us one second, this section is loading...'
    },
    'ES': {
        LOG_OUT: 'Cerrar sesión',
        LOADING: 'esta sección se está cargando...'
    }
}

const staffBuilderDict: any = {
    'EN': {
        TITLE: 'STAFF MEMBERS',
        ADD_PLACEHOLDER: 'Add new',
        ADD_BUTTON: 'ADD',
        NO:'No.',
        NAME:'Name',
        ROLE:'Role',
        STATUS:'Status',
        ACTION:'Action',
        UPDATING:'updating...',
        CANCEL:'Cancel',
        INFO:'This institute does not have any staff member. Please add new member.',
        LOADING:'Loading...',
        STATUS_PLACEHOLDER:'Select Status',
        EDIT:'Edit',
        

    },
    'ES': {
        TITLE: 'MIEMBROS DEL PERSONAL',
        ADD_PLACEHOLDER: 'Añadir nuevo',
        ADD_BUTTON: 'Añadir',
        NO:'TBD',
        NAME:'TBD',
        ROLE:'TBD',
        STATUS:'TBD',
        ACTION:'TBD',
        UPDATING:'TBD',
        CANCEL:'TBD',
        INFO:'TBD',
        LOADING:'TBD',
        STATUS_PLACEHOLDER:'TBD',
        EDIT:'TBD',
    }
}

const spBuilderDict: any = {
    'EN': {
        TITLE: 'SERVICE PROVIDERS',
        ADD_PLACEHOLDER: 'Add a new service provider',
        ADD_BUTTON: 'ADD',
        NO:'NO.',
        SERVICE:'Service Providers',
        STATUS:'Status',
        ACTION:'Actions',
        UPDATING:'updating...',
        CANCEL:'Cancel',
        INFO:'This institute does not have any service provider. Please add new service provider.'

    },
    'ES': {
        TITLE: 'PROVEEDORES DE SERVICIO',
        ADD_PLACEHOLDER: 'Agregar un nuevo proveedor de servicios',
        ADD_BUTTON: 'Añadir',
        NO:'TBD',
        SERVICE:'TBD',
        STATUS:'TBD',
        ACTION:'TBD',
        UPDATING:'TBD',
        CANCEL:'TBD',
        INFO:'TBD'
    }
}

const editClassDict: any = {
    'EN': {
        TITLE: 'EDIT CLASS',
        SUBTITLE: 'Edit class information',
        NAME_INPUT_LABEL: 'Class Name',
        STUDENTS: 'STUDENTS',
        ADD_STUDENT_PLACEHOLDER: 'Add new student',
        ADD_STUDENT_BUTTON: 'Add',
        UPDATING:'updating...',
        CANCEL:'Cancel',
        NOSTUDENT:'No students added in the class.',
        LOADING:'Loading class students list...',
        EDIT:'Edit',
        TABLE: {
            SNO: 'No.',
            NAME: 'Student Name',
            STATUS: 'Status',
            ACTIONS: 'Actions'
        }
    },
    'ES': {
        TITLE: 'EDITAR CLASE',
        SUBTITLE: 'Editar la información de la clase',
        NAME_INPUT_LABEL: 'Nombre de la clase',
        STUDENTS: 'ALUMNAS',
        ADD_STUDENT_PLACEHOLDER: 'Agregar nuevo alumno',
        ADD_STUDENT_BUTTON: 'Añadir',
        UPDATING:'TBD',
        CANCEL:'TBD',
        NOSTUDENT:'TBD',
        LOADING:'TBD',
        EDIT:'TBD',
        TABLE: {
            SNO: 'No.',
            NAME: 'nombre del estudiante',
            STATUS: 'estado',
            ACTIONS: 'comportamiento'
        }
    }
}

const InstitutionDict:any={
    'EN':{
        TITLE:'INSTITUTIONS MANAGEMENT',
        SUBTITLE:'Institutions List',
        TABLE:{

            NAME:'Institute Name',
            TYPE:'Type',
            WEBSITE:'Website',
            CONTACT:'Contact No.',
            ACTION:'Actions',
            NORESULT:'No Results'
        },
        SHOWPAGE:'Showing Page',
        OF:'of',
        PAGES:'pages',
        SORTBY:'Sort By',
        
        BUTTON:{
            Add:'Add New Institution'
        }
    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        TABLE:{

            NAME:'TBD',
            TYPE:'TBD',
            WEBSITE:'TBD',
            CONTACT:'TBD',
            ACTION:'TBD',
            NORESULT:'TBD'
        },
        SHOWPAGE:'TBD',
        OF:'TBD',
        PAGES:'TBD',
        SORTBY:'TBD',
        BUTTON:{
            Add:'TBD'
        }

    }
}

const Institute_info:any={
    'EN':{
        TITLE:'General Information',
        ADDRESS:'Address',
        CONTACT:'Contact No',
        INSTITUTION_TYPE:'Institution Type',
        WEBSITE:'Website',
        SERVICE_PROVIDER:'Service Provider',
        TABS:{
            SERVICE_PROVIDER:'Service Providers',
            STAFF:'Staff',
            CLASSES:'Classes',
            CURRICULAR:'Curricular',
            CLASSROOMS:'Classrooms'

        }
    },
    'ES':{
        TITLE:'TBD',
        ADDRESS:'TBD',
        CONTACT:'TBD',
        INSTITUTION_TYPE:'TBD',
        WEBSITE:'TBD',
        SERVICE_PROVIDER:'TBD',
        TABS:{
            SERVICE_PROVIDER:'TBD',
            STAFF:'TBD',
            CLASSES:'TBD',
            CURRICULAR:'TBD',
            CLASSROOMS:'TBD'
        }
    }
}

const InstitutionEdit:any={
    'EN':{
        INFO:'Click the circle above to update institution image.',

        FORM:{

            TITLE:'Edit Information',
            INSTITUTION_TYPE:'Institution Type',
            NAME_INPUT_LABEL:'Institution Name',
            NAME_INPUT_PLACEHOLDER:'i.e. Iconoclast Artist',
            WEBSITE_INPUT_LABEL:'Website(*please enter complete url.) ',
            WEBSITE_INPUT_PLACEHOLDER:'i.e. https://iconoclastartists.org/',
            ADDRESS_INPUT_LABEL:'Address line 1',
            ADDRESS2_INPUT_LABEL:'Address line 2',
            CITY_LABEL:'City',
            STATE_LABEL:'State',
            ZIP_LABEL:'Zip',
            PHONE_LABEL:'Phone',
            SERVICEPROVIDER_LABEL:'Service Provider'

        },
        INSTITUTION_TYPE:{
            SCHOOL:'School',
            AFTERSCHOOL:'After School',
            DAYCAMP:'Day Camp',
            SUMMERCAMP:'Summer Camp',
            C3:'501C3'
        },
        BUTTON:{
            CANCEL:'Cancel',
            SAVE:'Save'
        }
    },
    'ES':{
        INFO:'TBD',
        FORM:{

            TITLE:'TBD',
            INSTITUTION_TYPE:'TBD',
            NAME_INPUT_LABEL:'TBD',
            NAME_INPUT_PLACEHOLDER:'TBD',
            WEBSITE_INPUT_LABEL:'TBD',
            WEBSITE_INPUT_PLACEHOLDER:'TBD',
            ADDRESS_INPUT_LABEL:'TBD',
            ADDRESS2_INPUT_LABEL:'TBD',
            CITY_LABEL:'TBD',
            STATE_LABEL:'TBD',
            ZIP_LABEL:'TBD',
            PHONE_LABEL:'TBD',
            SERVICEPROVIDER_LABEL:'TBD'

        },
        INSTITUTION_TYPE:{
            SCHOOL:'TBD',
            AFTERSCHOOL:'TBD',
            DAYCAMP:'TBD',
            SUMMERCAMP:'TBD',
            C3:'TBD'
        },
        BUTTON:{
            CANCEL:'TBD',
            SAVE:'TBD'
        }


    }

}


const InstitutionAdd:any={
    'EN':{
        INFO:'Click the circle above to update institution image.',
        TITLE:'Add Institution',
        SUBTITLE:'Add new institution to the list',
        FORM:{

            TITLE:'Institute Information',
            INSTITUTION_TYPE:'Institution Type',
            NAME_INPUT_LABEL:'Institution Name',
            NAME_INPUT_PLACEHOLDER:'i.e. Iconoclast Artist',
            WEBSITE_INPUT_LABEL:'Website(*please enter complete url.) ',
            WEBSITE_INPUT_PLACEHOLDER:'i.e. https://iconoclastartists.org/',
            ADDRESS_INPUT_LABEL:'Address line 1',
            ADDRESS2_INPUT_LABEL:'Address line 2',
            CITY_LABEL:'City',
            STATE_LABEL:'State',
            ZIP_LABEL:'Zip',
            PHONE_LABEL:'Phone',
            SERVICEPROVIDER_LABEL:'Service Provider'

        },
        INSTITUTION_TYPE:{
            SCHOOL:'School',
            AFTERSCHOOL:'After School',
            DAYCAMP:'Day Camp',
            SUMMERCAMP:'Summer Camp',
            C3:'501C3'
        },
        BUTTON:{
            CANCEL:'Cancel',
            SAVE:'Save'
        }
    },
    'ES':{
        INFO:'TBD',
        TITLE:'TBD',
        SUBTITLE:'TBD',

        FORM:{

            TITLE:'TBD',
            INSTITUTION_TYPE:'TBD',
            NAME_INPUT_LABEL:'TBD',
            NAME_INPUT_PLACEHOLDER:'TBD',
            WEBSITE_INPUT_LABEL:'TBD',
            WEBSITE_INPUT_PLACEHOLDER:'TBD',
            ADDRESS_INPUT_LABEL:'TBD',
            ADDRESS2_INPUT_LABEL:'TBD',
            CITY_LABEL:'TBD',
            STATE_LABEL:'TBD',
            ZIP_LABEL:'TBD',
            PHONE_LABEL:'TBD',
            SERVICEPROVIDER_LABEL:'TBD'

        },
        INSTITUTION_TYPE:{
            SCHOOL:'TBD',
            AFTERSCHOOL:'TBD',
            DAYCAMP:'TBD',
            SUMMERCAMP:'TBD',
            C3:'TBD'
        },
        BUTTON:{
            CANCEL:'TBD',
            SAVE:'TBD'
        }


    }

}


const Institute_class:any={
    'EN':{
        TITLE:'INSTITUTE CLASSES',
        NO:'No.',
        CLASSNAME:'Class Name',
        ACTION:'Actions',
        EDIT:'edit',
        INFO:'This institute does not have any class. Please create a new class.',
        BUTTON:{
            CREATE:'Create new class'
        }
    },
    'ES':{
        TITLE:'TBD',
        NO:'TBD',
        CLASSNAME:'TBD',
        ACTION:'TBD',
        EDIT:'TBD',
        INFO:'TBD',
        BUTTON:{
            CREATE:'TBD'
        }
    }
    

}
const InstitueCurriculam:any={
    'EN':{
        TITLE:'INSTITUTE CURRICULAR',
        BUTTON:{
            ADD:'Add new Curricular'
        },
        NO:'No.',
        NAME:'Curricular Name',
        ACTION:'Actions',
        VIEW:'View',
        INFO:'This institute does not have any curriculum. Please create a new curriculum.'

    },
    'ES':{
        TITLE:'TBD',
        BUTTON:{
            ADD:'TBD'
        },
        NO:'TBD',
        NAME:'TBD',
        ACTION:'TBD',
        VIEW:'TBD',
        INFO:'TBD'
    }
}

const InstitueRomms:any={
    'EN':{
        TITLE:'CLASSROOMS',
        NO:'No.',
        CLASSROOMS_NAME:'Classroom Name',
        CLASS_NAME:'Class Name',
        TEACHER:'Teacher',
        MXSTUDENTS:'Max. Students',
        ACTION:'Actions',
        EDIT:'edit',
        BUTTON:{
            CREATE:'Create new Classroom'
        },
    },
    'ES':{
        TITLE:'TBD',
        NO:'TBD',
        CLASSROOMS_NAME:'TBD',
        CLASS_NAME:'TBD',
        TEACHER:'TBD',
        MXSTUDENTS:'TBD',
        ACTION:'TBD',
        EDIT:'TBD',
        BUTTON:{
            CREATE:'TBD'
        },

    }
}

const classBuilderdict:any={
    'EN':{
        TITLE:'Create New Class',
        SUBTITLE:'Add new class to the list',
        NAME_LABEL:'Class Name',
        HEADING:'CLASS INFORMATION',
        MEMBER_PLACEHOLDER:'Add new student',

        BUTTON:{
            ADD:'Add',
            SAVE:'Save',
            SAVING:'Saving...',

        }
    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        NAME_LABEL:'TBD',
        HEADING:'TBD',
        MEMBER_PLACEHOLDER:'TBD',

        BUTTON:{
            ADD:'TBD',
            SAVE:'TBD',
            SAVING:'TBD',

        }
    }
}


const CurricularBuilderdict:any={
    'EN':{
        TITLE:'Create New Curriculum',
        SUBTITLE:'Add new curriculum to the list',
        HEADING:'CURRICULUM INFORMATION',
        NAME:'Curriculum Name',
        LANGUAGE:'Select Language',
        DESIGNER:'Select Designers',

        DESCRIPTION:'Description',
        OBJECT:'Objective',
        BUTTON:{
            SAVE:'Save',
            SAVING:'Saving...'
        }
    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        HEADING:'TBD',
        NAME:'TBD',
        LANGUAGE:'TBD',
        DESIGNER:'TBD',
        DESCRIPTION:'TBD',
        OBJECT:'TBD',
        BUTTON:{
            SAVE:'TBD',
            SAVING:'TBD'
        }

    }
}
const RoomBuilderdict:any={
    'EN':{
        TITLE:'Create New Classroom',
        SUBTITLE:'Add new Classroom to the list',
        HEADING:'CLASSROOM INFORMATION',
        NAME_LABEL:'Classroom Name',
        NAME_PLACEHOLDER:'Add Classroom name',
        TEACHER_LABEL:'Teacher',
        TEACHER_PLACEHOLDER:'Select teacher',
        CLASS_NAME_LABEL:'Class Name',
        CLASS_NAME_PLACEHOLDER:'Select Class',
        CURRICULUM_LABEL:'Curriculum',
        CURRICULUM_PLACEHOLDER:'Select Curriculum',
        MAXSTUDENT_LABEL:'Max.Students (Add number between 1 to 30)',
        MAXSTUDENT_PLACHOLDER:'Max students',
        BUTTON:{
            SAVE:'Save',
            SAVING:'Saving...',
        }

    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        HEADING:'TBD',
        NAME_LABEL:'TBD',
        NAME_PLACEHOLDER:'TBD',
        TEACHER_LABEL:'TBD',
        TEACHER_PLACEHOLDER:'TBD',
        CLASS_NAME_LABEL:'TBD',
        CLASS_NAME_PLACEHOLDER:'TBD',
        CURRICULUM_LABEL:'TBD',
        CURRICULUM_PLACEHOLDER:'TBD',
        MAXSTUDENT_LABEL:'TBD',
        MAXSTUDENT_PLACHOLDER:'TBD',
        BUTTON:{
            SAVE:'TBD',
            SAVING:'TBD',
        }

    }
}

const EditCurriculardict:any={
    'EN':{
        TITLE:'Edit Curriculum',
        SUBTITLE:'Update curriculum information',
        HEADING:'CURRICULAR INFORMATION',
        NAME:'Curriculum Name',
        LANGUAGE:'Select Language',
        DESIGNER:'Select Designers',
        DESCRIPTION:'Description',
        OBJECTIVE:'Objective',
        BUTTON:{
            SAVE:'Save',
            CANCEL:'Cancel',
        }
        
    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        HEADING:'TBD',
        NAME:'TBD',
        LANGUAGE:'TBD',
        DESIGNER:'TBD',
        DESCRIPTION:'TBD',
        OBJECTIVE:'TBD',
        BUTTON:{
            SAVE:'TBD',
            CANCEL:'TBD',
        }
    }
}

const RoomEDITdict:any={
    'EN':{
        TITLE:'Edit Classroom',
        SUBTITLE:'Edit Classroom information',
        HEADING:'ROOM INFORMATION',
        NAME_LABEL:'Classroom Name',
        NAME_PLACEHOLDER:'Add Classroom name',
        TEACHER_LABEL:'Teacher',
        TEACHER_PLACEHOLDER:'Select teacher',
        CLASS_NAME_LABEL:'Class Name',
        CLASS_NAME_PLACEHOLDER:'Select Class',
        CURRICULUM_LABEL:'Curriculum',
        CURRICULUM_PLACEHOLDER:'Select Curriculum',
        MAXSTUDENT_LABEL:'Max.Students (Add number between 1 to 30)',
        MAXSTUDENT_PLACHOLDER:'Max students',
        BUTTON:{
            SAVE:'Save',
            SAVING:'Saving...',
            CANCEL:'Cancel',
        }

    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        HEADING:'TBD',
        NAME_LABEL:'TBD',
        NAME_PLACEHOLDER:'TBD',
        TEACHER_LABEL:'TBD',
        TEACHER_PLACEHOLDER:'TBD',
        CLASS_NAME_LABEL:'TBD',
        CLASS_NAME_PLACEHOLDER:'TBD',
        CURRICULUM_LABEL:'TBD',
        CURRICULUM_PLACEHOLDER:'TBD',
        MAXSTUDENT_LABEL:'TBD',
        MAXSTUDENT_PLACHOLDER:'TBD',
        BUTTON:{
            SAVE:'TBD',
            SAVING:'TBD',
            CANCEL:'TBD',
        }

    }
}

const curricularviewdict:any={

    'EN':{
        TITLE:'Curriculum Builder',
        SUBTITLE:'Build curriculum, units and lesson plans here',
        HEADING:'GENERAL INFORMATION',
        NAME:'Curriculum Name',
        OWNER:'Institution Owner',
        DESCRIPTION:'Description',
        DESIGNER:'Designers',
        LANGUAGE:'Languages',
        OBJECTIVE:'Objective',
        TAB:{
            UNIT:'Units',
            LEARINGOBJECTIVE:'Learning objectives',
            INFORMATION:'Demographics & Information'
        }
    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        HEADING:'TBD',
        NAME:'TBD',
        OWNER:'TBD',
        DESCRIPTION:'TBD',
        DESIGNER:'TBD',
        LANGUAGE:'TBD',
        OBJECTIVE:'TBD',
        TAB:{
            UNIT:'TBD',
            LEARINGOBJECTIVE:'TBD',
            INFORMATION:'TBD'
        }

    }
}

const CHECKPOINTSDICT:any={
    'EN':{
        TITLE:'CURRICULAR CHECKPOINTS',
        INFO:'This curricular does not have any checkpoints yet. Please create a new one.',
        FETCH:'Fetching Data Please wait...',
        BUTTON:{
            ADDEXISTING:'Add Existing Checkpoint',
            ADDNEW:'Add New Checkpoint'
        }
    },
    'ES':{
        TITLE:'TBD',
        INFO:'TBD',
        FETCH:'TBD',
        BUTTON:{
            ADDEXISTING:'TBD',
            ADDNEW:'TBD'
        }
    }
}

const LEARINGOBJECTIVEDICT:any={
    'EN':{
        TITLE:'LEARNING OBJECTIVES',
        INFO:'This curricular does not have any learning objectives yet. Please create a new one.',
        FETCH:'Fetching Data Please wait...',
        BUTTON:{
            ADD:'Add New Learning Objective',
        }
    },
    'ES':{
        TITLE:'TBD',
        INFO:'TBD',
        FETCH:'TBD',
        BUTTON:{
            ADD:'TBD',
        }
    }
}

const SYLLABUS:any={
    'EN':{
        TITLE:'CURRICULUM UNITS',
        NO:'No.',
        NAME:'Unit Name',
        ACTION:'Actions',
        EDIT:'edit',
        INFO:'This curricular does not have any units yet. Please create a new one.',
        FETCH:'Fetching details...',
        ADDNEW:'Add new Unit'
    },
    'ES':{
        TITLE:'TBD',
        NO:'TBD',
        NAME:'TBD',
        ACTION:'TBD',
        EDIT:'TBD',
        INFO:'TBD',
        FETCH:'TBD',
        ADDNEW:'TBD'
    }
}

const Measurementdict:any={
    'EN':{
        NO:'No.',
        MEASUREMENT:'Measurements',
        ACTION:'Actions',
        EDIT:'Edit',
        INFO:'This topic does not have any measurement yet. Please create a new one.',
        ADDNEW:'Add New Measurement',
        FETCH:'Fetching measurements list...'
    },
    'ES':{
        NO:'TBD',
        MEASUREMENT:'TBD',
        ACTION:'TBD',
        EDIT:'TBD',
        INFO:'TBD',
        ADDNEW:'TBD',
        FETCH:'TBD'
    }
}

const TOPICLISTDICT:any={
    'EN':{
        TOPIC:'Topics',
        EDIT:'Edit',
        INFO:'This learning objective does not have any topics. Please create a new one.',
        ADDNEW:'Add New Topic',
        FETCH:'Fetching topics list...',
    },
    'ES':{
        TOPIC:'TBD',
        EDIT:'TBD',
        INFO:'TBD',
        ADDNEW:'TBD',
        FETCH:'TBD',
    }
}

const ADDLEARINGOBJDICT:any={
    'EN':{
        TITLE:'Add learning objective',
        SUBTITLE:'Add new learning objective.',
        HEADING:'LEARNING OBJECTIVE INFORMATION',
        NAME:'Learning Objective Name',
        DESC:'Description',
        SAVE:'Save',
        VALIDATION:'Name is required'
    },
    'ES':{
        TITLE:'TBD',
        SUBTITLE:'TBD',
        HEADING:'TBD',
        NAME:'TBD',
        DESC:'TBD',
        SAVE:'TBD',
        VALIDATION:'TBD',
    }
}

function paginationPage(lang: string, page: number, total: number) {
    if (lang === 'EN') return `Showing Page ${page + 1} of ${total} pages`
    if (lang === 'ES') return `Mostrando página ${page + 1} de ${total} páginas`
    return ''
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
    InstitutionDict,
    Institute_info,
    InstitutionEdit,
    InstitutionAdd,
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
    ADDLEARINGOBJDICT
};
