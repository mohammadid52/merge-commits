# S3 bucket custom policy
"S3BucketPolicy": {
    "DependsOn": [
        "S3Bucket"
    ],
    "Type" : "AWS::S3::BucketPolicy",
    "Properties" : {
        "Bucket" : {"Ref" : "S3Bucket"},
        "PolicyDocument": {
            "Statement":[{
                "Sid": "PublidReadGetObject",
                "Effect": "Allow",
                "Action": "s3:GetObject",
                "Principal": "*",
                "Resource": [
                    {
                        "Fn::Join": [
                            "",
                            [
                                "arn:aws:s3:::",
                                {
                                    "Ref": "S3Bucket"
                                },
                                "/public/*"
                            ]
                        ]
                    }
                ]
            }]
        }
    }
}

# ################################################ #


# dictionary

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