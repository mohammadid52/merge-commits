import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

interface SubSectionTabs {
  isTeacher?: boolean;
  subSection: string;
  subSectionList: string[];
  handleTabClick: (e: React.MouseEvent<Element>) => void;
}

const SubSectionTabs = (props: SubSectionTabs) => {
  const { isTeacher, subSection, subSectionList, handleTabClick } = props;
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);
  const { theme } = useContext(GlobalContext);

  const getTranslation = Object.keys(anthologyDict[userLanguage].TABS).map((key: any) => {
    return anthologyDict[userLanguage].TABS[key];
  })

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
              {getTranslation[index]}
            </h2>
          ))}
      </div>
    </div>
  );
};

export default SubSectionTabs;
