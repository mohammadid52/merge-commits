import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';

import Tabs from '@components/Atoms/Tabs';

const HeaderMegaMenu = () => {
  const history = useHistory();
  const {
    clientKey,
    userLanguage,
    state: {user},
  } = useContext(GlobalContext);
  const {Institute_info} = useDictionary(clientKey);

  const baseUrl = user.associateInstitute?.length
    ? `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}`
    : '';

  // ~~~~~~~~~~~~~ MENU SUP/ADM ~~~~~~~~~~~~ //
  const headerMenusForInstitution = [
    {
      title: Institute_info[userLanguage]['TABS']['INSTITUTION_MANAGER'],
      key: 'institution',
      type: 'dropdown',
      children: [
        {
          title: Institute_info[userLanguage]['TABS']['GENERAL_INFORMATION'],
          key: 'general_information',
          redirectionUrl: `${baseUrl}/edit`,
          active: location.pathname.indexOf('/edit') > -1,
        },
        {
          title: Institute_info[userLanguage]['TABS']['STAFF'],
          key: 'staff',
          redirectionUrl: `${baseUrl}/staff`,
          active: location.pathname.indexOf('staff') > -1,
        },
        (user.role === 'SUP' || user.role === 'ADM') && {
          title: 'User registry',
          key: 'user_registry',
          redirectionUrl: `${baseUrl}/manage-users`,
          active: location.pathname.indexOf('manage-users') > -1,
        },
        (user.role === 'ADM' || user.role === 'FLW' || user.role === 'TR') && {
          title: 'Register New User',
          key: 'register',
          redirectionUrl: `${baseUrl}/register-user`,
          active: location.pathname.indexOf('register-user') > -1,
        },
      ].filter(Boolean),
    },
    {
      title: Institute_info[userLanguage]['TABS']['COURSE_MANAGER'],
      key: 'course',
      type: 'dropdown',
      children: [
        {
          title: Institute_info[userLanguage]['TABS']['COURSES'],
          key: 'course',
          redirectionUrl: `${baseUrl}/courses`,
          active: location.pathname.indexOf('course') > -1,
        },
        {
          title: Institute_info[userLanguage]['TABS']['UNITS'],
          key: 'unit',
          redirectionUrl: `${baseUrl}/units`,
          active: location.pathname.indexOf('units') > -1,
        },
        {
          title: Institute_info[userLanguage]['TABS']['LESSONS'],
          key: 'lessons',
          redirectionUrl: `${baseUrl}/lessons`,
          active: location.pathname.indexOf('lessons') > -1,
        },
        {
          title: 'Game Changers ',
        },
      ],
    },
    user.role !== 'BLD' && {
      title: Institute_info[userLanguage]['TABS']['CLASS_MANAGER'],
      key: 'class',
      type: 'dropdown',
      children: [
        // {
        //   title: Institute_info[userLanguage]['TABS']['CLASSES'],
        //   key: 'class',
        //   redirectionUrl: `${baseUrl}/class`,
        //   active: location.pathname.indexOf('class') > -1,
        // },
        {
          title: Institute_info[userLanguage]['TABS']['CLASSROOMS'],
          key: 'class_room',
          redirectionUrl: `${baseUrl}/class-rooms`,
          active: location.pathname.indexOf('room') > -1,
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          title: Institute_info[userLanguage]['TABS']['STUDENT_ROASTER'],
          key: 'roaster',
          redirectionUrl: `${baseUrl}/class-rooms`,
          active: location.pathname.indexOf('room') > -1,
        },
        (user.role === 'FLW' || user.role === 'TR') && {
          title: Institute_info[userLanguage]['TABS']['LIVE_CLASS_ROOM'],
          key: 'live_classroom',
          redirectionUrl: `/dashboard/home`,
          active: location.pathname.indexOf('room') > -1,
        },
      ].filter(Boolean),
    },
    {
      title: Institute_info[userLanguage]['TABS']['COMMUNITY_MANAGER'],
      key: 'community',
      type: 'dropdown',
      children: [
        {
          title: 'New Person Spotlight',
        },
        {
          title: 'Announcements & Events',
        },
        {
          title: 'Front Page',
        },
      ],
    },
    {
      title: Institute_info[userLanguage]['TABS']['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      redirectionUrl: `${baseUrl}/research-and-analytics`,
      active: location.pathname.indexOf('research-and-analytics') > -1,
    },
  ].filter(Boolean);

  // ~~~~~~~~~~~~~ MENU STUDENT ~~~~~~~~~~~~ //
  const headerMenusForStudent = [
    {
      title: Institute_info[userLanguage]['TABS']['HOME'],
      key: 'dashboard',
      redirectionUrl: `${baseUrl}/dashboard/home`,
      active: location.pathname.indexOf('home') > -1,
    },
    {
      title: Institute_info[userLanguage]['TABS']['NOTEBOOK'],
      key: 'notebook',
      redirectionUrl: `${baseUrl}/dashboard/anthology`,
      active: location.pathname.indexOf('anthology') > -1,
    },
  ];

  // ~~~~~~~~~~~~~ SWITCH MENUS ~~~~~~~~~~~~ //
  const getMenuByRole = (role: string) => {
    switch (role) {
      case 'ST':
        return headerMenusForStudent;
      default:
        return headerMenusForInstitution;
    }
  };

  const updateTab = ({key, redirectionUrl}: any) => {
    if (redirectionUrl) {
      history.push(redirectionUrl);
    }
  };

  return (
    <div>
      <Tabs tabsData={getMenuByRole(user?.role)} updateTab={updateTab} tabWithNumbers />
    </div>
  );
};

export default HeaderMegaMenu;
