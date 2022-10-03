const baseURL = 'http://localhost:8085';
const institutionID = '6539589f-44d2-4749-b0ba-87086b7fe1d8';
const surveyIDs = [
  'de824abb-3f1a-422d-a0f1-002d85de6ccd',
  '7546b398-acea-440e-ad74-3c007922e2e2'
];
const classroomIDs = ['3936fdc3-d36d-43db-b43e-75efa30ea8cc'];

export const loginConfig = {
  student: {
    username: 'jasperprague@yopmail.com', //new username: cypressclassroom@zoiq.io
    password: 'panda123' // new password: admin123
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
  }
};

export const ids = {classroomIDs, institutionID, surveyIDs};

export const urlConfig = {
  baseURL,
  dashboardURL: `${baseURL}/dashboard`,
  registerURL: `${baseURL}/dashboard/manage-institutions/institution/${institutionID}/register-user`,
  simpleSurveURL: `${baseURL}/lesson/${surveyIDs[0]}/0`,
  complexSurveURL: `${baseURL}/lesson/${surveyIDs[1]}/0`
};
