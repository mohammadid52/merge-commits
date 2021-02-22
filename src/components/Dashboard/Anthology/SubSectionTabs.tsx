import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

interface SubSectionTabs {
  isTeacher?: boolean;
  subSection: string;
  subSectionList: string[];
  handleTabClick: (e: React.MouseEvent<Element>) => void;
  translations?: string[]
}

const SubSectionTabs = (props: SubSectionTabs) => {
  const { isTeacher, subSection, subSectionList, handleTabClick, translations } = props;
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);


  return (
    <div className={`${theme.section} text-xl`}>
      <div id={`subSectionTabs`} className={`flex flex-row`} onClick={handleTabClick}>
        {subSectionList &&
          subSectionList.map((listItem: string, index: number) => (
            <h2
              key={`subSectionTab_${index}`}
              id={listItem}
              className={`w-auto ml-4 cursor-pointer ${theme.dashboard.sectionTitle} ${
                subSection === listItem
                  ? 'text-black'
                  : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out'
              }`}>
              {translations ? translations[index] : listItem}
            </h2>
          ))}
      </div>
    </div>
  );
};

export default SubSectionTabs;
