import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useEffect, useState} from 'react';

import {useGlobalContext} from 'contexts/GlobalContext';
import {
  getCurriculumBasicDetails,
  getRoomBasicDetails,
  getUniversalLessonBasicDetails,
  getUniversalSyllabusBasicDetails
} from 'customGraphql/customQueries';

import useAuth from '@customHooks/useAuth';
import {Breadcrumb} from 'antd';
import HeroBanner from 'components/Header/HeroBanner';
import useDictionary from 'customHooks/dictionary';
import {logError} from 'graphql-functions/functions';
import {AiOutlineHome} from 'react-icons/ai';
import {NavLink} from 'react-router-dom';
import {breadcrumbsRoutes} from 'utilities/breadcrumb';

export type BreadCrumb = {
  title: string;
  href: string;
  last: boolean;
  goBack?: boolean;
};

interface BreadCrumbProps {
  items?: BreadCrumb[];
  unsavedChanges?: boolean;
  separateGoBackButton?: string;
  toggleModal?: any;
  forInstitution?: boolean;
  institutionId?: string;
  institutionData?: any;
  bannerImage: string;
  title?: string;
}

const BreadcrumbsWithBanner: React.FC<BreadCrumbProps> = (props: BreadCrumbProps) => {
  const {
    forInstitution = false,
    institutionId,
    institutionData,
    items = [],

    bannerImage,
    title
  } = props;
  const {state, userLanguage} = useGlobalContext();

  const user = state.temp.user;

  const {BreadcrumsTitles, Institute_info} = useDictionary();
  const pathname = location.pathname.replace(/\/$/, '');
  const currentPath = pathname.substring(pathname.lastIndexOf('/') + 1);

  const [lessonData, setLessonData] = useState<{
    id?: string;
    title?: string;
  }>({});
  const [roomData, setRoomData] = useState<{
    id?: string;
    name?: string;
  }>({});
  const [courseData, setCourseData] = useState<{
    id?: string;
    name?: string;
  }>({});
  const [unitData, setUnitData] = useState<{
    id?: string;
    name?: string;
  }>({});

  const getLessonData = async () => {
    try {
      // To extract lesson id from path name
      const splitUrl = pathname.split('/lessons/')?.length
        ? pathname.split('/lessons/')[1]
        : '';
      if (splitUrl.indexOf('add') === -1) {
        const result: any = await API.graphql(
          graphqlOperation(getUniversalLessonBasicDetails, {
            id: splitUrl.split('/')[0]
          })
        );
        setLessonData(result.data?.getUniversalLesson);
      }
    } catch (error) {
      logError(
        error,
        {authId: state.user.authId, email: state.user.email},
        'BreadcrumbsWithBanner @getLessonData'
      );
    }
  };

  const getRoomData = async () => {
    try {
      // To extract room id from path name
      const roomId = pathname.split('/room-edit/')?.length
        ? pathname.split('/room-edit/')[1]
        : '';

      if (roomId) {
        const result: any = await API.graphql(
          graphqlOperation(getRoomBasicDetails, {
            id: roomId
          })
        );

        setRoomData(result.data?.getRoom);
      }
    } catch (error) {
      logError(
        error,
        {authId: state.user.authId, email: state.user.email},
        'BreadcrumbsWithBanner @getRoomData'
      );
    }
  };

  const getCourseData = async () => {
    try {
      // To extract course id from path name
      const courseId = pathname.split('/course-builder/')?.length
        ? pathname.split('/course-builder/')[1]
        : '';

      if (courseId) {
        const result: any = await API.graphql(
          graphqlOperation(getCurriculumBasicDetails, {
            id: courseId.split('/')[0]
          })
        );

        setCourseData(result.data?.getCurriculum);
      }
    } catch (error) {
      logError(
        error,
        {authId: state.user.authId, email: state.user.email},
        'BreadcrumbsWithBanner @getCourseData'
      );
    }
  };

  const getUnitData = async () => {
    try {
      // To extract unit id from path name
      const partOfUnitUrl = pathname.split('/units/')[1];
      const unitId =
        partOfUnitUrl && partOfUnitUrl.length > 0
          ? partOfUnitUrl.replace('/edit', '')
          : '';

      if (unitId) {
        const result: any = await API.graphql(
          graphqlOperation(getUniversalSyllabusBasicDetails, {
            id: unitId
          })
        );
        setUnitData(result.data?.getUniversalSyllabus);
      }
    } catch (error) {
      console.error(error);

      logError(
        error,
        {authId: state.user.authId, email: state.user.email},
        'BreadcrumbsWithBanner @getUnitData'
      );
    }
  };

  useEffect(() => {
    if (pathname.indexOf('lessons/') > -1) {
      getLessonData();
    } else if (pathname.indexOf('room') > -1) {
      getRoomData();
    } else if (pathname.indexOf('course') > -1) {
      getCourseData();
    } else if (pathname.indexOf('units') > -1) {
      getUnitData();
    }
  }, [pathname]);

  const {isSuperAdmin} = useAuth();
  const baseUrl = isSuperAdmin
    ? `/dashboard/manage-institutions`
    : `/dashboard/manage-institutions/institution/${institutionId}`;

  const {heroSectionTitle, breadcrumbPathForSection} = breadcrumbsRoutes({
    breadcrumbsTitles: BreadcrumsTitles[userLanguage],
    instituteTabTitles: Institute_info[userLanguage],
    pathname,
    baseUrl,
    otherValues: {
      lessonData,
      roomData,
      courseData,
      unitData,
      user
    }
  });

  const breadCrumbsList: BreadCrumb[] = [
    {
      title: <AiOutlineHome />,
      href: '/dashboard',
      last: false
    },

    institutionId && {
      title: institutionData?.name,
      href:
        currentPath === 'edit'
          ? `${location.pathname}${location.search}`
          : `/dashboard/manage-institutions/institution/${institutionId}/edit`,
      last: false
    },
    ...(breadcrumbPathForSection || [])
  ].filter(Boolean) as BreadCrumb[];

  const finalList = forInstitution ? breadCrumbsList : items;

  const itemRender = (route: any, _: any, routes: string | any[]) => {
    const last = routes.indexOf(route.title as string) === routes.length - 1;

    return last ? (
      <span>{route.title}</span>
    ) : (
      <NavLink to={route.href}>{route.title}</NavLink>
    );
  };

  return (
    <>
      <div className="relative">
        <HeroBanner imgUrl={bannerImage} title={heroSectionTitle || title} />

        <div className={`px-2 md:px-4 pt-8 lg:px-8 mb-[-1rem]`}>
          <Breadcrumb itemRender={itemRender} items={finalList} />
        </div>
      </div>
    </>
  );
};
export default BreadcrumbsWithBanner;
