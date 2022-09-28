const baseURL = 'http://localhost:8085';
const institutionID = '6539589f-44d2-4749-b0ba-87086b7fe1d8';
const surveyIDs = ['de824abb-3f1a-422d-a0f1-002d85de6ccd', '7546b398-acea-440e-ad74-3c007922e2e2'];
const classroomIDs = ['3936fdc3-d36d-43db-b43e-75efa30ea8cc'];

export const loginConfig = {
  student: {
    username: 'jasperprague@yopmail.com',
    password: 'panda123'
  },
  teacher: {
    username: 'testuser2023@yopmail.com',
    password: 'panda123'
  },
  admin: {
    username: 'michael.russell@zoiq.io',
    password: 'panda123'
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
