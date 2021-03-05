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
        PEOPLE: 'PEOPLE'
    },
    'ES': {
        HOME: 'CASA',
        PROFILE: 'PERFIL',
        PEOPLE: 'PERSONAS'
    }
}
// Profile Display and edit section
const dashboardProfileDict: any = {
    'EN': {
        PROFILE: 'Profile',
        TITLE: 'USER PROFILE',
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
            B: 'Session Work',
            C: 'Session Notes',
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
            B: 'Session Work',
            C: 'Session Notes',
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
        ADD_BUTTON: 'ADD'

    },
    'ES': {
        TITLE: 'MIEMBROS DEL PERSONAL',
        ADD_PLACEHOLDER: 'Añadir nuevo',
        ADD_BUTTON: 'Añadir'
    }
}

const spBuilderDict: any = {
    'EN': {
        TITLE: 'SERVICE PROVIDERS',
        ADD_PLACEHOLDER: 'Add a new service provider',
        ADD_BUTTON: 'ADD'

    },
    'ES': {
        TITLE: 'PROVEEDORES DE SERVICIO',
        ADD_PLACEHOLDER: 'Agregar un nuevo proveedor de servicios',
        ADD_BUTTON: 'Añadir'
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
        TABLE: {
            SNO: 'No.',
            NAME: 'nombre del estudiante',
            STATUS: 'estado',
            ACTIONS: 'comportamiento'
        }
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
};
