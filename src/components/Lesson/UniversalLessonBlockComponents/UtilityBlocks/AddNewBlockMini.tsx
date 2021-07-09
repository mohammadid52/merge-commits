import React, {useContext} from 'react';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {PlusSmIcon} from '@heroicons/react/outline';
export const AddNewBlockMini = (props: RowWrapperProps) => {
  const {idx, handleModalPopToggle} = props;
  const {setNewBlockSeqId} = useULBContext();
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-0 border-gray-300 border-opacity-30" />
      </div>
      <div className="relative flex justify-center">
        <button
          onClick={() => {
            handleModalPopToggle('ADD_CONTENT');
            setNewBlockSeqId(idx);
          }}
          type="button"
          className="inline-flex w-auto items-center shadow-sm px-4 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-400 bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusSmIcon className="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>{LessonBuilderDict[userLanguage]['BUTTON']['ADD_ROW']}</span>
        </button>
      </div>
    </div>
  );
};
