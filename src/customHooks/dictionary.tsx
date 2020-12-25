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
        TITLE: 'USER PROFILE'
    },
    'ES': {
        TITLE: 'PERFIL DEL USUARIO'
    }
}

const sideBarLinksDict: any = {
    'EN': {
        REGISTRATION: 'Registration',
        INSTITUTIONS: 'Institution',
        PEOPLE: 'People',
        LESSION_PLANNER: 'Lession Planner',
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
        lessonDict, dashboardDict, dashboardProfileDict, sideBarLinksDict
    }
}

export default useDictionary;