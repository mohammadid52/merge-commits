const baseURL = 'http://localhost:8085';
const iconoclastURL = 'https://iconoclast.selready.com';
const projectCurateURL = 'https://projectcurate.zoiq.io';
const institutionID = '6539589f-44d2-4749-b0ba-87086b7fe1d8';
const surveyIDs = ['6a27e851-7863-4b45-b04a-09d35ef0af6a'];
const classroomIDs = ['3936fdc3-d36d-43db-b43e-75efa30ea8cc'];

export const loginConfig = {
  student: {
    username: 'cypressclassroom@zoiq.io', //new username: cypressclassroom@zoiq.io
    password: 'admin123' // new password: admin123
  },
  teacher: {
    username: 'cypressfellow@zoiq.io',
    password: 'admin123'
  },
  admin: {
    username: 'cypressadmin@zoiq.io',
    password: 'admin123'
  },
  selfPacedStudent: {
    username: 'cypressselfpaced@zoiq.io',
    password: 'admin123'
  },
  builder: {
    username: 'cypressbuilder@zoiq.io',
    password: 'admin123'
  },

  mike: {
    username: 'michael.russell@zoiq.io',
    password: 'admin123'
  },

  production: {
    student1: {
      username: 'marleyhk@gmail.com', // username: marleyhk@gmail.com
      password: 'Havikoro99' // password: Havikoro99
    },

    student2: {
      username: 'angela@iconoclasttraining.com',
      password: 'admin123'
    }
  }
};

export const ids = {classroomIDs, institutionID, surveyIDs};

export const urlConfig = {
  baseURL,
  dashboardURL: `${baseURL}/dashboard`,
  registerURL: `${baseURL}/dashboard/manage-institutions/institution/${institutionID}/register-user`,
  simpleSurveURL: `${baseURL}/lesson/${surveyIDs[0]}/0`,
  complexSurveURL: `${baseURL}/lesson/${surveyIDs[1]}/0`,
  notebookURL: `${baseURL}/dashboard/anthology`,
  IAProductionUrl: 'https://iconoclast.selready.com/login',
  PCProductionUrl: 'https://projectcurate.zoiq.io/login',
  IADashboardUrl: 'https://iconoclast.selready.com/dashboard'
};
