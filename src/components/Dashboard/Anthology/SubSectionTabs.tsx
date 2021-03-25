import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import SubSectionTab from '../../Atoms/SubSectionTab';

interface SubSectionTabs {
  isTeacher?: boolean;
  subSection: string;
  subSectionList: string[];
  handleTabClick: (e: React.MouseEvent<Element>) => void;
  translations?: string[];
  widgetTypeCount?: { sidebar: number; topbar: number };
}

const SubSectionTabs = (props: SubSectionTabs) => {
  const { subSection, subSectionList, handleTabClick, widgetTypeCount } = props;
  const { theme} = useContext(GlobalContext);


  return (
    <div className={`${theme.section} text-xl`}>
      <div id={`subSectionTabs`} className={`flex flex-row`} onClick={handleTabClick}>
        {subSectionList &&
          subSectionList.map((listItem: string, index: number) => (
            <SubSectionTab
              key={`subSectionTab_${index}`}
              id={listItem}
              selectedCondition={subSection === listItem}
              label={listItem}
              counter={
                listItem.includes('Side')?
                  widgetTypeCount?.sidebar :
                  widgetTypeCount?.topbar
              }
              />
          ))}
      </div>
    </div>
  );
};

export default SubSectionTabs;
