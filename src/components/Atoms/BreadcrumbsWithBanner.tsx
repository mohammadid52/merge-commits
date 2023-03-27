import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useEffect, useState} from 'react';

import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';

import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {Breadcrumb} from 'antd';
import HeroBanner from 'components/Header/HeroBanner';
import useDictionary from 'customHooks/dictionary';
import {AiOutlineHome} from 'react-icons/ai';
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
          graphqlOperation(customQueries.getUniversalLessonBasicDetails, {
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
          graphqlOperation(customQueries.getRoomBasicDetails, {
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
          graphqlOperation(customQueries.getCurriculumBasicDetails, {
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
      const unitId = pathname.split('/units/')?.length
        ? pathname.split('/units/')[1].replace('/edit', '')
        : '';

      if (unitId) {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalSyllabusBasicDetails, {
            id: unitId
          })
        );
        setUnitData(result.data?.getUniversalSyllabus);
      }
    } catch (error) {
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

  return (
    <>
      <div className="relative">
        <HeroBanner imgUrl={bannerImage} title={heroSectionTitle || title} />
        {/* <div className={`absolute theme-bg w-full bottom-0 z-20`}> */}
        <div className="px-2 pt-8 md:px-4 lg:px-8 mb-[-1rem]">
          <Breadcrumb items={finalList} />
        </div>
        {/* <div
            className={`${
              separateGoBackButton ? 'justify-between' : ''
            } flex flex-row my-0 py-2`}>
            <div
              className={`w-auto ${
                separateGoBackButton ? 'flex items-center' : ''
              } pl-4 ${theme.verticalBorder[themeColor]}`}>
              <nav className="w-full flex">
                <ol className="list-none flex items-center justify-start">
                  {finalList &&
                    finalList?.length > 0 &&
                    finalList?.map((item) => (
                      <li
                        className="flex items-center w-auto mr-1 md:mr-2"
                        style={{minWidth: 'fit-content'}}
                        key={item.title}>
                        {!item.goBack ? (
                          <div
                            onClick={() =>
                              item?.goBack === false ? () => {} : goToUrl(item?.url)
                            }>
                            <span
                              className={`mr-1 md:mr-2 cursor-pointer text-sm 2xl:text-base hover:iconoclast:bg-400 hover:curate:bg-400 rounded-xl px-2 text-white`}>
                              {item.title}
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`mr-1 md:mr-2 cursor-pointer text-sm 2xl:text-base text-white hover:iconoclast:bg-400 hover:curate:bg-400 rounded-xl px-2`}
                            onClick={() =>
                              unsavedChanges ? toggleModal() : history.goBack()
                            }>
                            {item.title}
                          </span>
                        )}
                        {!item.last && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${'text-white'} stroke-current inline-block h-4 w-4`}>
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        )}
                      </li>
                    ))}
                </ol>
              </nav>
            </div>
            <div className="absolute z-100 w-6 right-1 top-0.5">
              <span
                className="w-auto cursor-pointer"
                onClick={() => setOpenWalkThroughModal(true)}>
                <BsFillInfoCircleFill className={`h-5 w-5 text-white`} />
              </span>
            </div>
          </div> */}
      </div>
      {/* </div> */}
      {/* <InformationalWalkThrough
        open={openWalkThroughModal}
        onCancel={() => setOpenWalkThroughModal(false)}
      /> */}
    </>
  );
};
export default BreadcrumbsWithBanner;
