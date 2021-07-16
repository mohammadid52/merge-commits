import React, {useContext} from 'react';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {PlusSmIcon} from '@heroicons/react/outline';
export const AddNewBlockMini = (props: RowWrapperProps) => {
  const {idx, handleModalPopToggle} = props;
  const {setNewBlockSeqId} = useULBContext();
  const {
    userLanguage,
    clientKey,
    state: {
      lessonPage: {theme = 'dark', themeBackgroundColor = '', themeTextColor = ''} = {},
    },
  } = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const iconColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div
          className={`w-full border-t-0 ${
            theme === 'dark' ? 'border-gray-300' : 'border-gray-700'
          } border-opacity-30`}
        />
      </div>
      <div className="relative flex justify-center">
        <button
          onClick={() => {
            handleModalPopToggle('ADD_CONTENT');
            setNewBlockSeqId(idx);
          }}
          type="button"
          className={`inline-flex w-auto items-center shadow-sm px-4 py-1.5 border ${
            theme === 'dark' ? 'border-gray-300' : 'border-gray-700'
          } text-sm leading-5 font-medium rounded-full ${themeTextColor} ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
          <PlusSmIcon
            className={`-ml-1.5 mr-1 h-5 w-5 ${iconColor}`}
            aria-hidden="true"
          />
          <span>{LessonBuilderDict[userLanguage]['BUTTON']['ADD_ROW']}</span>
        </button>
      </div>
    </div>
  );
};
