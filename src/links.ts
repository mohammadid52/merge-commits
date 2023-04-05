// this file is for back links of all pages

const baseLinkForInstitution = '/dashboard/manage-institutions/institution';

const links = {
  home: '/dashboard', // home page
  profile: '/profile', // profile page
  changePassword: '/change-password', // change password page
  rooms: (instId: string) => `${baseLinkForInstitution}/${instId}/class-rooms`,
  staff: (instId: string) => `${baseLinkForInstitution}/${instId}/staff`,
  users: (instId: string) => `${baseLinkForInstitution}/${instId}/manage-users`,
  courses: (instId: string) => `${baseLinkForInstitution}/${instId}/courses`,
  units: (instId: string) => `${baseLinkForInstitution}/${instId}/units`,
  lessons: (instId: string) => `${baseLinkForInstitution}/${instId}/lessons`
};
