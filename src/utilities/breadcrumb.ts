export const breadcrumbsRoutes = ({
    breadcrumbsTitles,
    instituteTabTitles,
    lessonData,
    pathname,
    baseUrl
}:any) => {
  let heroSectionTitle, breadcrumbPathForSection;
  
  if (pathname.indexOf('unit') > -1) {
    heroSectionTitle = breadcrumbsTitles['UNITS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/units`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('staff') > -1) {
    heroSectionTitle = breadcrumbsTitles.STAFF;
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/staff`,
        last: true,
      },
    ];
  } else if (
    pathname.indexOf('manage-users') > -1 ||
    pathname.indexOf('register-user') > -1
  ) {
    heroSectionTitle = breadcrumbsTitles.USERS;
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/staff`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('course') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['COURSES'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/courses`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('students') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['STUDENT_ROASTER'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/students`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('units') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['UNITS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/units`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('lessons') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['LESSONS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/lessons`,
        last: lessonData?.id ? false : true,
      },
    ];
    // for edit
    if (lessonData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: lessonData?.title,
          url: `${baseUrl}/lessons/${lessonData?.id}`,
          last: true,
        },
      ];
    }
  }
  else if (pathname.indexOf('room') > -1 || pathname.indexOf('room-edit') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['CLASSROOMS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/class-rooms`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('research-and-analytics') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['RESEARCH_AND_ANALYTICS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/research-and-analytics`,
        last: true,
      },
    ];
  } else if (pathname.indexOf('edit') > -1) {
    heroSectionTitle = breadcrumbsTitles['INSTITUTION_GENERAL_INFO'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        url: `${baseUrl}/edit`,
        last: true,
      },
    ];
  }
  return {heroSectionTitle, breadcrumbPathForSection}
}

