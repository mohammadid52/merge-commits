import {useGlobalContext} from '@contexts/GlobalContext';
import SubSectionTab from 'atoms/SubSectionTab';
import React from 'react';

interface SubSectionTabs {
  isTeacher?: boolean;
  subSection: string;
  subSectionList: string[];
  handleTabClick: (e: React.MouseEvent<Element>) => void;
  translations?: string[];
  widgetTypeCount?: {sidebar: number; topbar: number};
}

const SubSectionTabs = (props: SubSectionTabs) => {
  const {subSection, subSectionList, handleTabClick, widgetTypeCount, translations} =
    props;
  const {theme} = useGlobalContext();

  const getLabel = (inputLabel: string, translationIndex: number) => {
    if (inputLabel.includes('Widgets')) {
      if (inputLabel === 'Top Widgets') {
        return 'Topbar Widgets';
      } else {
        return 'Sidebar Widgets';
      }
    } else {
      return translations?.[translationIndex] || 'Topbar Widgets';
    }
  };

  return (
    <div className={`${theme.section} text-xl`}>
      <div id={`subSectionTabs`} className={`flex flex-row`} onClick={handleTabClick}>
        {subSectionList &&
          subSectionList.map((listItem: string, index: number) => (
            <SubSectionTab
              key={`subSectionTab_${listItem}`}
              id={listItem}
              selectedCondition={subSection === listItem}
              label={getLabel(listItem, index)}
              counter={
                listItem.includes('Side')
                  ? widgetTypeCount?.sidebar
                  : widgetTypeCount?.topbar
              }
            />
          ))}
      </div>
    </div>
  );
};

export default SubSectionTabs;
