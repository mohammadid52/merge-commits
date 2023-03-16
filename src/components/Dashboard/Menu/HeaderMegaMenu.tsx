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
      label: TABS['INSTITUTION_MANAGER'],
      key: 'institution',
      type: 'dropdown',
      children: [
        {
          label: TABS['GENERAL_INFORMATION'],
          key: 'general_information',
          redirectionUrl:
            user.role === 'SUP' ? `${baseUrl}?alert=true` : `${baseUrl}/edit`,
          active: location.pathname.indexOf(`${baseUrl}/edit`) > -1
        },
        {
          label: TABS['STAFF'],
          key: 'staff',
          redirectionUrl: `${baseUrl}/staff`,
          active: location.pathname.indexOf('staff') > -1
        },
        (user.role === 'SUP' || user.role === 'ADM') && {
          label: TABS['USER_REGISTRY'],
          key: 'user_registry',
          redirectionUrl: `${baseUrl}/manage-users`,
          active: location.pathname.indexOf('manage-users') > -1
        },
        (user.role === 'ADM' || user.role === 'FLW' || user.role === 'TR') && {
          label: TABS['REGISTER_NEW_USER'],
          key: 'register',
          redirectionUrl: `${baseUrl}/register-user`,
          active: location.pathname.indexOf('register-user') > -1
        }
      ].filter(Boolean)
    },
    {
      label: TABS['COURSE_MANAGER'],
      key: 'course',
      type: 'dropdown',
      children: [
        {
          label: TABS['COURSES'],
          key: 'course',
          redirectionUrl: `${baseUrl}/courses`,
          active: location.pathname.indexOf('course') > -1
        },
        {
          label: TABS['UNITS'],
          key: 'unit',
          redirectionUrl: `${baseUrl}/units`,
          active: location.pathname.indexOf('units') > -1
        },
        {
          label: TABS['LESSONS'],
          key: 'lessons',
          redirectionUrl: `${baseUrl}/lessons`,
          active: location.pathname.indexOf('lessons') > -1
        },
        {
          label: TABS['GAME_CHANGERS'],
          key: 'game-changers',
          redirectionUrl: `/dashboard/game-changers`,
          active: location.pathname.indexOf('game-changers') > -1
        }
      ]
    },
    user.role !== 'BLD' && {
      label: TABS['CLASS_MANAGER'],
      key: 'class',
      type: 'dropdown',
      children: [
        // { user.role !== 'BLD' &&
        //   label: TABS['CLASSES'],
        //   key: 'class',
        //   redirectionUrl: `${baseUrl}/class`,
        //   active: location.pathname.indexOf('class') > -1,
        // },
        {
          label: TABS['CLASSROOMS'],
          key: 'class_room',
          redirectionUrl: `${baseUrl}/class-rooms`,
          active: location.pathname.indexOf('room') > -1
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          label: TABS['STUDENT_ROASTER'],
          key: 'roaster',
          redirectionUrl: `${baseUrl}/students`,
          active: location.pathname.indexOf('room') > -1
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          label: TABS['LIVE_CLASS_ROOM'],
          key: 'live_classroom',
          redirectionUrl: `/dashboard/home`,
          active: location.pathname.indexOf('room') > -1
        }
      ].filter(Boolean)
    },
    user.role !== 'BLD' && {
      label: TABS['COMMUNITY_MANAGER'],
      key: 'community',
      type: 'dropdown',
      children: [
        {
          key: 'community_builder',
          redirectionUrl: `/dashboard/community/builder`,
          active: false,
          label: CommunityDict[userLanguage]['TABS']['COMMUNITY_BUILDER']
        },

        {
          key: 'front_page',
          redirectionUrl: `/dashboard/community/front`,
          active: location.pathname.indexOf('community') > -1,
          label: CommunityDict[userLanguage]['TABS']['FRONT_PAGE']
        }
      ]
    },
    {
      label: TABS['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      type: 'dropdown',
      children: [
        {
          key: 'download_csv',
          redirectionUrl: `${baseUrl}/research-and-analytics`,
          active: false,
          label: TABS['DOWNLOAD_CSV']
        },

        {
          key: 'upload_csv',
          redirectionUrl: `${baseUrl}/research-and-analytics/upload-csv`,
          active: location.pathname.indexOf('research-and-analytics') > -1,
          label: TABS['UPLOAD_CSV']
        }
        // {
        //   key: 'analytics_dashboard',
        //   redirectionUrl: `${baseUrl}/research-and-analytics/analytics-dashboard`,
        //   active: location.pathname.indexOf('research-and-analytics') > -1,
        //   label: TABS['UPLOAD_TO_ATHENA'],
        // },
      ]
    }
  ].filter(Boolean);

  // ~~~~~~~~~~~~~ MENU STUDENT ~~~~~~~~~~~~ //
  const headerMenusForStudent = [
    {
      label: TABS['HOME'],
      key: 'dashboard',
      redirectionUrl: `${baseUrl}/dashboard/home`,
      active:
        location.pathname.indexOf('home') > -1 ||
        location.pathname.indexOf('classroom') > -1
    },
    {
      label: TABS['GAME_CHANGERS'],
      key: 'game-changers',
      redirectionUrl: `${baseUrl}/dashboard/game-changers`,
      active: location.pathname.indexOf('game-changers') > -1
    },
    {
      label: TABS['COMMUNITY'],
      key: 'community',
      redirectionUrl: `${baseUrl}/dashboard/community/front`,
      active: location.pathname.indexOf('community') > -1
    },
    {
      label: TABS['NOTEBOOK'],
      key: 'notebook',
      redirectionUrl: `${baseUrl}/dashboard/anthology`,
      active: location.pathname.indexOf('anthology') > -1
    }
  ];

  // ~~~~~~~~~~~~~ SWITCH MENUS ~~~~~~~~~~~~ //
  const getMenuByRole = (role: string) =>
    role === 'ST' ? headerMenusForStudent : headerMenusForInstitution;

  const [currentTab, setCurrentTab] = useState(
    headerMenusForStudent?.find((d) => d.active)?.label || headerMenusForStudent[0]?.label
  );

  const updateTab = ({redirectionUrl, label}: typeof headerMenusForStudent[0]) => {
    setCurrentTab(label);
    if (redirectionUrl) {
      history.push(redirectionUrl);
    }
  };

  const mappedTabs = getMenuByRole(user?.role).map((tab: any) => {
    if (tab?.children?.length > 0) {
      tab.children = tab.children.map((child: any) => {
        if (child?.redirectionUrl) {
          child.label = <a href={child.redirectionUrl}>{child.label}</a>;
        }
        return child;
      });
    }
    return tab;
  });

  return (
    <Tabs
      currentTab={currentTab}
      tabsData={mappedTabs as ITabElements[]}
      updateTab={updateTab}
      tabWithNumbers
    />
  );
};

export default HeaderMegaMenu;
