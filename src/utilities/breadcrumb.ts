import {BreadCrumb} from '@components/Atoms/BreadcrumbsWithBanner';
import {useQuery} from '@customHooks/urlParam';

export const breadcrumbsRoutes = ({
  breadcrumbsTitles,
  instituteTabTitles,
  pathname,
  baseUrl,
  otherValues
}: any) => {
  const {
    courseData = {},
    lessonData = {},
    roomData = {},
    unitData = {}
  } = otherValues || {};

  let heroSectionTitle,
    breadcrumbPathForSection: BreadCrumb[] = [];

  if (location.search.indexOf('courseName') > -1) {
    const paths = useQuery(location.search);

    breadcrumbPathForSection = [
      {
        title: instituteTabTitles['TABS']['COURSES'],
        href: `${baseUrl}/courses`,
        last: false
      },
      {
        title: paths.get('courseName'),
        href: `${baseUrl}/course-builder/${paths.get('courseId')}`,
        last: false
      },
      {
        title: instituteTabTitles['TABS']['UNITS'],
        href: `${baseUrl}/units`,

        last: false
      },
      unitData && {
        title: unitData?.name,
        href: `${baseUrl}/units/${unitData?.id}/edit?courseId=${paths.get(
          'courseId'
        )}&courseName=${paths.get('courseName')}`,
        last: true,
        goBack: false
      }
    ];
  } else if (pathname.indexOf('unit') > -1) {
    heroSectionTitle = breadcrumbsTitles['UNITS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/units`,
        last: true
      }
    ];
  } else if (pathname.indexOf('staff') > -1) {
    heroSectionTitle = breadcrumbsTitles.STAFF;
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/staff`,
        last: !Boolean(otherValues.user)
      },
      otherValues?.user && {
        title: otherValues.user.name,
        href: `${baseUrl}/manage-users/${otherValues.user.id}/staff`,
        last: Boolean(otherValues.user),
        goBack: false
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
        href: `${baseUrl}/manage-users`,
        last: !Boolean(otherValues.user)
      },
      otherValues?.user && {
        title: otherValues.user.name,
        href: `${baseUrl}/manage-users/${otherValues.user.id}`,
        last: Boolean(otherValues.user),
        goBack: false
      }
    ];
  } else if (pathname.indexOf('course') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['COURSES'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/courses`,
        last: !courseData?.id
      }
    ];
    if (courseData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: courseData?.name,
          href: `${baseUrl}/course-builder/${courseData?.id}`,
          last: true
        }
      ];
    }
  } else if (pathname.indexOf('students') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['STUDENT_ROASTER'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/students`,
        last: true
      }
    ];
  } else if (pathname.indexOf('units') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['UNITS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/units`,
        last: true
      }
    ];
    // for edit
    if (unitData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: unitData?.name,
          href: `${baseUrl}/units/${unitData?.id}/edit`,
          last: !unitData?.id
        }
      ];
    }
  } else if (pathname.indexOf('lessons') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['LESSONS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/lessons`,
        last: lessonData?.id ? false : true
      }
    ];
    // for edit
    if (lessonData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: lessonData?.title,
          href: `${baseUrl}/lessons/${lessonData?.id}`,
          last: true
        }
      ];
    }
  } else if (pathname.indexOf('room') > -1 || pathname.indexOf('room-edit') > -1) {
    heroSectionTitle = instituteTabTitles['TABS']['CLASSROOMS'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/class-rooms`,
        last: !roomData?.id
      }
    ];
    if (roomData?.id) {
      breadcrumbPathForSection = [
        ...breadcrumbPathForSection,
        {
          title: roomData?.name,
          href: `${baseUrl}/room-edit/${roomData?.id}`,
          last: true
        }
      ];
    }
  } else if (pathname.indexOf('research-and-analytics') > -1) {
    heroSectionTitle =
      instituteTabTitles['TABS'][
        pathname.indexOf('upload-csv') > -1 ? 'UPLOAD_SURVEY' : 'DOWNLOAD_SURVEYS'
      ];

    breadcrumbPathForSection = [
      {
        title: instituteTabTitles['TABS']['RESEARCH_AND_ANALYTICS'],
        href: `${baseUrl}/research-and-analytics`,
        last: false
      },
      {
        title: heroSectionTitle,
        href: `${baseUrl}/research-and-analytics`,
        last: true
      }
    ];
  } else if (pathname.indexOf('edit') > -1) {
    heroSectionTitle = breadcrumbsTitles['INSTITUTION_GENERAL_INFO'];
    breadcrumbPathForSection = [
      {
        title: heroSectionTitle,
        href: `${baseUrl}/edit`,
        last: true
      }
    ];
  }
  return {heroSectionTitle, breadcrumbPathForSection};
};
