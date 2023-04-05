import {useState} from 'react';
import {Link} from 'react-router-dom';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import {Menu, MenuProps} from 'antd';

const HeaderMegaMenu = () => {
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
      // icon: <HiOutlineOfficeBuilding />,

      children: [
        {
          label: TABS['GENERAL_INFORMATION'],
          key: 'general_information',
          redirectionUrl:
            user.role === 'SUP' ? `${baseUrl}?alert=true` : `${baseUrl}/edit`
        },
        {
          label: TABS['STAFF'],
          key: 'staff',
          redirectionUrl: `${baseUrl}/staff`
        },
        (user.role === 'SUP' || user.role === 'ADM') && {
          label: TABS['USER_REGISTRY'],
          key: 'user_registry',
          redirectionUrl: `${baseUrl}/manage-users`
        },
        (user.role === 'ADM' || user.role === 'FLW' || user.role === 'TR') && {
          label: TABS['REGISTER_NEW_USER'],
          key: 'register',
          redirectionUrl: `${baseUrl}/register-user`
        }
      ].filter(Boolean)
    },
    {
      label: TABS['COURSE_MANAGER'],
      key: 'course',
      // icon: <MdOutlineLibraryBooks />,
      children: [
        {
          label: TABS['COURSES'],
          key: 'course-list',
          redirectionUrl: `${baseUrl}/courses`
        },
        {
          label: TABS['UNITS'],
          key: 'unit-list',
          redirectionUrl: `${baseUrl}/units`
        },
        {
          label: TABS['LESSONS'],
          key: 'lessons-list',
          redirectionUrl: `${baseUrl}/lessons`
        },
        {
          label: TABS['GAME_CHANGERS'],
          key: 'game-changers',
          redirectionUrl: `/dashboard/game-changers`
        }
      ]
    },
    user.role !== 'BLD' && {
      label: TABS['CLASS_MANAGER'],
      key: 'class',
      // icon: <SiGoogleclassroom />,
      type: 'dropdown',
      children: [
        {
          label: TABS['CLASSROOMS'],
          key: 'class_room',
          redirectionUrl: `${baseUrl}/class-rooms`
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          label: TABS['STUDENT_ROASTER'],
          key: 'roaster',
          redirectionUrl: `${baseUrl}/students`
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          label: TABS['LIVE_CLASS_ROOM'],
          key: 'live_classroom',
          redirectionUrl: `/dashboard/home`
        }
      ].filter(Boolean)
    },
    user.role !== 'BLD' && {
      label: TABS['COMMUNITY_MANAGER'],
      key: 'community',
      // icon: <TbBuildingCommunity />,
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

          label: CommunityDict[userLanguage]['TABS']['FRONT_PAGE']
        }
      ]
    },
    {
      label: TABS['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      type: 'dropdown',
      // icon: <MdOutlineAnalytics />,
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

          label: TABS['UPLOAD_CSV']
        }
      ]
    }
  ].filter(Boolean);

  // ~~~~~~~~~~~~~ MENU STUDENT ~~~~~~~~~~~~ //
  const headerMenusForStudent = [
    {
      label: TABS['HOME'],
      key: 'dashboard',
      redirectionUrl: `${baseUrl}/dashboard/home`
    },
    {
      label: TABS['GAME_CHANGERS'],
      key: 'game-changers',
      redirectionUrl: `${baseUrl}/dashboard/game-changers`
    },
    {
      label: TABS['COMMUNITY'],
      key: 'community',
      redirectionUrl: `${baseUrl}/dashboard/community/front`
    },
    {
      label: TABS['NOTEBOOK'],
      key: 'notebook',
      redirectionUrl: `${baseUrl}/dashboard/anthology`
    }
  ];

  // ~~~~~~~~~~~~~ SWITCH MENUS ~~~~~~~~~~~~ //
  const getMenuByRole = (role: string) =>
    role === 'ST' ? headerMenusForStudent : headerMenusForInstitution;

  const mappedTabs = !user?.role
    ? []
    : getMenuByRole(user?.role).map((tab: any) => {
        if (tab?.children?.length > 0) {
          tab.children = tab.children.map((child: any) => {
            if (child?.redirectionUrl) {
              child.label = <Link to={child.redirectionUrl}>{child.label}</Link>;
            }
            return child;
          });
        } else if (tab?.redirectionUrl) {
          tab.label = <Link to={tab.redirectionUrl}>{tab.label}</Link>;
        }
        return tab;
      });

  const [current, setCurrent] = useState('staff');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      className="w-full justify-around"
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={mappedTabs}
    />
  );
};

export default HeaderMegaMenu;
