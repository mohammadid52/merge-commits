const getStudentDataUploadKey = (userId: string, lessonId: string) =>
  `ULB/studentdata/${userId}/${lessonId}`;

export const UPLOAD_KEYS = {
  TEACHER_UPLOAD: 'ULB/teachers_upload/',
  getStudentDataUploadKey,
  COMMUNITY: 'community/',
  ULB: 'ulb/'
};

export const SEARCH_LIMIT = 2000;
