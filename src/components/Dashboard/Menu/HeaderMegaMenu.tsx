import {useState} from 'react';
import {useHistory} from 'react-router-dom';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import Tabs, {ITabElements} from 'atoms/Tabs';

const HeaderMegaMenu = () => {
  const history = useHistory();
  const {
    userLanguage,
    state: {user}
  } = useGlobalContext();
  const {Institute_info, CommunityDict} = useDictionary();

  const baseUrl =
    user.role === 'SUP'
      ? `/dashboard/manage-institutions`
      : user.associateInstitute?.length
      ? `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}`
      : '';

  const TABS = Institute_info[userLanguage]['TABS'];

  // ~~~~~~~~~~~~~ MENU SUP/ADM ~~~~~~~~~~~~ //
  const headerMenusForInstitution = [
    {
      title: TABS['INSTITUTION_MANAGER'],
      key: 'institution',
      type: 'dropdown',
      children: [
        {
          title: TABS['GENERAL_INFORMATION'],
          key: 'general_information',
          redirectionUrl:
            user.role === 'SUP' ? `${baseUrl}?alert=true` : `${baseUrl}/edit`,
          active: location.pathname.indexOf(`${baseUrl}/edit`) > -1
        },
        {
          title: TABS['STAFF'],
          key: 'staff',
          redirectionUrl: `${baseUrl}/staff`,
          active: location.pathname.indexOf('staff') > -1
        },
        (user.role === 'SUP' || user.role === 'ADM') && {
          title: TABS['USER_REGISTRY'],
          key: 'user_registry',
          redirectionUrl: `${baseUrl}/manage-users`,
          active: location.pathname.indexOf('manage-users') > -1
        },
        (user.role === 'ADM' || user.role === 'FLW' || user.role === 'TR') && {
          title: TABS['REGISTER_NEW_USER'],
          key: 'register',
          redirectionUrl: `${baseUrl}/register-user`,
          active: location.pathname.indexOf('register-user') > -1
        }
      ].filter(Boolean)
    },
    {
      title: TABS['COURSE_MANAGER'],
      key: 'course',
      type: 'dropdown',
      children: [
        {
          title: TABS['COURSES'],
          key: 'course',
          redirectionUrl: `${baseUrl}/courses`,
          active: location.pathname.indexOf('course') > -1
        },
        {
          title: TABS['UNITS'],
          key: 'unit',
          redirectionUrl: `${baseUrl}/units`,
          active: location.pathname.indexOf('units') > -1
        },
        {
          title: TABS['LESSONS'],
          key: 'lessons',
          redirectionUrl: `${baseUrl}/lessons`,
          active: location.pathname.indexOf('lessons') > -1
        },
        {
          title: TABS['GAME_CHANGERS'],
          key: 'game-changers',
          redirectionUrl: `/dashboard/game-changers`,
          active: location.pathname.indexOf('game-changers') > -1
        }
      ]
    },
    user.role !== 'BLD' && {
      title: TABS['CLASS_MANAGER'],
      key: 'class',
      type: 'dropdown',
      children: [
        // { user.role !== 'BLD' &&
        //   title: TABS['CLASSES'],
        //   key: 'class',
        //   redirectionUrl: `${baseUrl}/class`,
        //   active: location.pathname.indexOf('class') > -1,
        // },
        {
          title: TABS['CLASSROOMS'],
          key: 'class_room',
          redirectionUrl: `${baseUrl}/class-rooms`,
          active: location.pathname.indexOf('room') > -1
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          title: TABS['STUDENT_ROASTER'],
          key: 'roaster',
          redirectionUrl: `${baseUrl}/students`,
          active: location.pathname.indexOf('room') > -1
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          title: TABS['LIVE_CLASS_ROOM'],
          key: 'live_classroom',
          redirectionUrl: `/dashboard/home`,
          active: location.pathname.indexOf('room') > -1
        }
      ].filter(Boolean)
    },
    user.role !== 'BLD' && {
      title: TABS['COMMUNITY_MANAGER'],
      key: 'community',
      type: 'dropdown',
      children: [
        {
          key: 'community_builder',
          redirectionUrl: `/dashboard/community/builder`,
          active: false,
          title: CommunityDict[userLanguage]['TABS']['COMMUNITY_BUILDER']
        },

        {
          key: 'front_page',
          redirectionUrl: `/dashboard/community/front`,
          active: location.pathname.indexOf('community') > -1,
          title: CommunityDict[userLanguage]['TABS']['FRONT_PAGE']
        }
      ]
    },
    {
      title: TABS['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      type: 'dropdown',
      children: [
        {
          key: 'download_csv',
          redirectionUrl: `${baseUrl}/research-and-analytics`,
          active: false,
          title: TABS['DOWNLOAD_CSV']
        },

        {
          key: 'upload_csv',
          redirectionUrl: `${baseUrl}/research-and-analytics/upload-csv`,
          active: location.pathname.indexOf('research-and-analytics') > -1,
          title: TABS['UPLOAD_CSV']
        }
        // {
        //   key: 'analytics_dashboard',
        //   redirectionUrl: `${baseUrl}/research-and-analytics/analytics-dashboard`,
        //   active: location.pathname.indexOf('research-and-analytics') > -1,
        //   title: TABS['UPLOAD_TO_ATHENA'],
        // },
      ]
    }
  ].filter(Boolean);

  // ~~~~~~~~~~~~~ MENU STUDENT ~~~~~~~~~~~~ //
  const headerMenusForStudent = [
    {
      title: TABS['HOME'],
      key: 'dashboard',
      redirectionUrl: `${baseUrl}/dashboard/home`,
      active:
        location.pathname.indexOf('home') > -1 ||
        location.pathname.indexOf('classroom') > -1
    },
    {
      title: TABS['GAME_CHANGERS'],
      key: 'game-changers',
      redirectionUrl: `${baseUrl}/dashboard/game-changers`,
      active: location.pathname.indexOf('game-changers') > -1
    },
    {
      title: TABS['COMMUNITY'],
      key: 'community',
      redirectionUrl: `${baseUrl}/dashboard/community/front`,
      active: location.pathname.indexOf('community') > -1
    },
    {
      title: TABS['NOTEBOOK'],
      key: 'notebook',
      redirectionUrl: `${baseUrl}/dashboard/anthology`,
      active: location.pathname.indexOf('anthology') > -1
    }
  ];

  // ~~~~~~~~~~~~~ SWITCH MENUS ~~~~~~~~~~~~ //
  const getMenuByRole = (role: string) =>
    role === 'ST' ? headerMenusForStudent : headerMenusForInstitution;

  const [currentTab, setCurrentTab] = useState(
    headerMenusForStudent?.find((d) => d.active)?.title || headerMenusForStudent[0]?.title
  );

  const updateTab = ({redirectionUrl, title}: typeof headerMenusForStudent[0]) => {
    setCurrentTab(title);
    if (redirectionUrl) {
      history.push(redirectionUrl);
    }
  };

  return (
    <Tabs
      currentTab={currentTab}
      tabsData={getMenuByRole(user?.role) as ITabElements[]}
      updateTab={updateTab}
      tabWithNumbers
    />
  );
};

export default HeaderMegaMenu;
