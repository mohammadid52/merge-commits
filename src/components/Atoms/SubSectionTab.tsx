import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

interface SubSectionTab {
  id: string;
  selectedCondition: boolean;
  label: string
  counter?: number;
}

const SubSectionTab = (props: SubSectionTab) => {
  const {id, selectedCondition, label, counter} = props;
  const { theme } = useContext(GlobalContext);
  return (
    <div className={`w-auto flex flex-row`}>
      <h2
        id={id}
        className={`w-auto ml-4 cursor-pointer ${theme.dashboard.sectionTitle} ${
          selectedCondition ? 'text-black' : 'text-gray-400 hover:text-gray-800'
        }`}>
        {label}
      </h2>
      {
        typeof counter !== 'undefined' ? (
          <div className={`w-5 h-5 p-1 mt-4 ml-2 bg-ketchup rounded-full flex justify-center align-center items-center content-center`}>
            <span className={`w-auto h-auto text-xs text-white font-bold`}>{counter}</span>
          </div>
        ) : null
      }

    </div>
  );
};

export default SubSectionTab;
