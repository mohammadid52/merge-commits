import {Tabs3} from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import React from 'react';

interface IUserTabsProps {
  tabs: any[];
  currentTab?: any;
  viewedUser?: any;
  setCurrentTab?: any;
  isTeacher?: boolean;
  isAdmin?: boolean;
  theme?: any;
}

const UserTabs = ({
  tabs,
  currentTab,
  viewedUser,
  setCurrentTab,

  theme
}: IUserTabsProps) => {
  const getTabsData = () => {
    if (viewedUser?.role === 'TR' || viewedUser?.role === 'FLW') {
      return tabs.filter((tabObj: any) => tabObj.name !== 'Notebook');
    } else if (viewedUser?.role === 'ADM' || viewedUser?.role === 'SUP') {
      return tabs.filter((tabObj: any) => tabObj.name === 'User Information');
    } else {
      return tabs;
    }
  };
  // const tabsData = !isTeacher && !isAdmin ? tabs : tabs;

  if (getTabsData().length === 1 && getTabsData()[0].name === 'User Information') {
    return null;
  }

  return <Tabs3 curTab={currentTab} setCurTab={setCurrentTab} tabs={getTabsData()} />;
};

export default UserTabs;
