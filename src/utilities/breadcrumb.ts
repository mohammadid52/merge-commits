export const breadcrumbsRoutes = ({
  breadcrumbsTitles,
  instituteTabTitles,
  pathname,
  baseUrl,
  otherValues
}: any) => {
  const {courseData = {}, lessonData = {}, roomData = {}, unitData = {}} =
    otherValues || {};
  let heroSectionTitle,
    breadcrumbPathForSection: {
      title: string;
      url?: string;
      last: boolean;
      goBack?: boolean;
    }[] = [];

  if (pathname.indexOf('unit') > -1) {
    heroSectionTitle = breadcrumbsTitles['UNITS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/units`,
        last: true
      }
    ];
  } else if (pathname.indexOf('staff') > -1) {
    heroSectionTitle = breadcrumbsTitles.STAFF;
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/staff`,
        last: true
      }
    ];
  } else if (
    pathname.indexOf('manage-users') > -1 ||
    pathname.indexOf('register-user') > -1
  ) {
    heroSectionTitle = breadcrumbsTitles.USERS;
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/manage-users`,
        last: true
      }
    ];
  } else if (pathname.indexOf('course') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['COURSES'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/courses`,
        last: !courseData?.id
      }
    ];
    if (courseData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: courseData?.name,
          url: `${baseUrl}/course-builder/${courseData?.id}`,
          last: true
        }
      ];
    }
  } else if (pathname.indexOf('students') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['STUDENT_ROASTER'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/students`,
        last: true
      }
    ];
  } else if (pathname.indexOf('units') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['UNITS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/units`,
        last: true
      }
    ];
    // for edit
    if (unitData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: unitData?.title,
          url: `${baseUrl}/units/${unitData?.id}`,
          last: !unitData?.id
        }
      ];
    }
  } else if (pathname.indexOf('lessons') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['LESSONS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/lessons`,
        last: lessonData?.id ? false : true
      }
    ];
    // for edit
    if (lessonData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: lessonData?.title,
          url: `${baseUrl}/lessons/${lessonData?.id}`,
          last: true
        }
      ];
    }
  } else if (pathname.indexOf('room') > -1 || pathname.indexOf('room-edit') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['CLASSROOMS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/class-rooms`,
        last: !roomData?.id
      }
    ];
    if (roomData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: roomData?.name,
          url: `${baseUrl}/room-edit/${roomData?.id}`,
          last: true
        }
      ];
    }
  } else if (pathname.indexOf('research-and-analytics') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['RESEARCH_AND_ANALYTICS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/research-and-analytics`,
        last: true
      }
    ];
  } else if (pathname.indexOf('edit') > -1) {
    heroSectionTitle = breadcrumbsTitles['INSTITUTION_GENERAL_INFO'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/edit`,
        last: true
      }
    ];
  }
  return {heroSectionTitle, breadcrumbPathForSection};
};
