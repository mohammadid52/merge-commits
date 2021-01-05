import React from 'react';
import Institution from '../components/Dashboard/Admin/Institutons/Institution';

const lessonDict: any = {
    'EN': {
        continue: 'Continue',
        back: 'Back',
        instructions: 'Instructions',
        aboutTheArtist: 'About the Artist',
        story: 'Story',
        lyrics: 'Lyrics',
        poem: 'Poem',
        title: 'Title',
        chooseATitle: 'Choose a title',
        focusQuestions: 'Focus Questions',
        writeYourStoryHere: 'Write your story here!',
        reflectionQuestions: 'Reflection Questions',
        toolbox: 'Toolbox',
        highlighters: 'Highlighters',
        myWordBank: 'My Word Bank',
        search: 'Search',
        linePrompts: 'Line Prompts',
        submit: 'Submit',
        finalEdits: 'Final Edits',
        outroDummyText: 'Congrats! You\'ve completed 1 story and 1 poem!',
    },
    'ES': {
        continue: 'Continuar',
        back: 'Volver',
        instructions: 'Instrucciones',
        aboutTheArtist: 'Sobre el artista',
        story: 'Cuento',
        lyrics: 'Letra',
        poem: 'Poema',
        title: 'Título',
        chooseATitle: 'Escoja un título',
        focusQuestions: 'Focus Questions',
        writeYourStoryHere: 'Escriba tu cuesto aquí!',
        reflectionQuestions: 'Reflection Questions',
        toolbox: 'Toolbox',
        highlighters: 'Marcadores',
        myWordBank: 'My Word Bank',
        search: 'Buscar',
        linePrompts: 'Line Prompts',
        submit: 'Submit',
        finalEdits: 'Final Edits',
        outroDummyText: 'Congrats! You\'ve completed 1 story and 1 poem!',
    }
}
const dashboardDict: any = {
    'EN': {
        fullName: 'Full Name',
        nickname: 'Nickname',
        birthday: 'Birthday',
        language: 'Language Preference',
        email: 'Email Address',
        contact: 'Contact Number',
        personalInfo: 'Personal Information',
        institutionInfo: 'Institution Information',
        institution: 'Institution',
        grade: 'Grade',
        status: 'Status',
        role: 'Role',
        firstName: 'First Name',
        lastName: 'Last Name',
        myProfile: 'My Profile',
        questionnaire: 'Questionnaire',
        vault: 'Vault',
        edit: 'Edit',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        view: 'View',
        active: 'ACTIVE',
        inactive: 'INACTIVE',
        onhold: 'ON HOLD',
        suspended: 'SUSPENDED',
        expired: 'EXPIRED',
        register: 'Registration',
        name: 'Name',
        studentId: 'Student ID',
        notSet: 'Not Set',
        accountCreated: 'Account Created',
        pleaseWaitLoaded: 'Please wait while it is loading',
        logout: 'Log Out',
        login: 'Login',
        forgotPassword: 'forgot password?',
        password: 'Password',
        confirm: 'Confirm',
        confirmationCode: 'Confirmation Code',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        inputPassword: 'Input your email to reset your password',
        checkEmail: 'Check your email for your confirmation code',
        comingSoon: 'Coming soon...'
    },
    'ES': {
        fullName: 'Full Name',
        nickname: 'Nickname',
        birthday: 'Birthday',
        language: 'Language Preference',
        email: 'Email Address',
        contact: 'Contact Number',
        personalInfo: 'Personal Information',
        institutionInfo: 'Institution Information',
        institution: 'Institution',
        grade: 'Grade',
        status: 'Status',
        role: 'Role',
        firstName: 'First Name',
        lastName: 'Last Name',
        myProfile: 'My Profile',
        questionnaire: 'Questionnaire',
        vault: 'Vault',
        edit: 'Edit',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        view: 'View',
        active: 'ACTIVE',
        inactive: 'INACTIVE',
        onhold: 'ON HOLD',
        suspended: 'SUSPENDED',
        expired: 'EXPIRED',
        register: 'Registration',
        name: 'Name',
        studentId: 'Student ID',
        notSet: 'Not Set',
        accountCreated: 'Account Created',
        pleaseWaitLoaded: 'Please wait while it is loading',
        logout: 'Log Out',
        login: 'Login',
        forgotPassword: 'forgot password?',
        password: 'Password',
        confirm: 'Confirm',
        confirmationCode: 'Confirmation Code',
        newPassword: 'New Password',
        setNewPassword: 'Set New Password',
        confirmPassword: 'Confirm Password',
        inputPassword: 'Input your email to reset your password',
        checkEmail: 'Check your email for your confirmation code',
        comingSoon: 'Coming soon...'
    }
}

const dashboardProfileDict: any = {
    'EN': {
        TITLE: 'USER PROFILE',
        SUBTITLE: 'This contains your profile information.',
        PERSONAL_INFO: {
            TITLE: 'Personal Information',
            FULL_NAME: 'Full Name',
            NICKNAME: 'Nickname',
            BIRTHDAY: 'Birthday',
            LANGUAGE: 'Language',
            EMAIL: 'Email address',
            CONTACT: 'Contact Number'
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
        TITLE: 'PERFIL DEL USUARIO',
        SUBTITLE: 'Esto contiene la información de su perfil.',
        PERSONAL_INFO: {
            TITLE: 'Informacion personal',
            FULL_NAME: 'nombre completo',
            NICKNAME: 'apodo',
            BIRTHDAY: 'Cumpleaños',
            LANGUAGE: 'Idioma',
            EMAIL: 'dirección de correo electrónico',
            CONTACT: 'número de contacto'
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
                NOT_MATCH: 'Su nueva contraseña y la contraseña de confirmación no coinciden'
            }
        }
    }
}

const sideBarLinksDict: any = {
    'EN': {
        REGISTRATION: 'Registration',
        INSTITUTIONS: 'Institution',
        PEOPLE: 'People',
        LESSON_PLANNER: 'Lesson Planner',
        CLASSROOM: 'Classroom'
    },
    'ES': {
        REGISTRATION: 'Registro',
        INSTITUTIONS: 'Institución',
        PEOPLE: 'Personas',
        LESSON_PLANNER: 'Planificador de lecciones',
        CLASSROOM: 'Aula'
    }
}
const appDict: any = {
    'EN': {
        LOG_OUT: 'Log Out'
    },
    'ES': {
        LOG_OUT: 'Cerrar sesión'
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

function useDictionary() {
    async function lookUp(word: string) {
        const appId = 'c4ad157e';
        const appKey = 'cc99a6410f78f4d8da7b70e0fcea3254';
        const endpoint = "entries";
        const languageCode = "en-us";
        const wordId = word.toLowerCase()

        const url = "https://od-api.oxforddictionaries.com/api/v2/" + endpoint + "/" + languageCode + "/" + wordId

        const res = await fetch(url, {
            headers: {
                'app_id': appId,
                'app_key': appKey,
            },
        })
        const data = await res.json();
        console.log('dict_res', data)

    }

    return {
        appDict,
        sideBarLinksDict,
        dashboardProfileDict,
        staffBuilderDict,
        editClassDict
    }
}

export default useDictionary;