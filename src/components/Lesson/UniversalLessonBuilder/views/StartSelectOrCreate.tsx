import React, { Fragment, useContext, useEffect, useState } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';

import Buttons from '../../../Atoms/Buttons';
import useDictionary from '../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { UniversalBuilderDict } from '../../../../dictionary/dictionary.iconoclast';

interface ExistingLessonTemplateProps {
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
}

// GRID SHOWING EXISTING TEMPLATES TILES
const StartSelectOrCreate = (props: ExistingLessonTemplateProps) => {
  const { universalBuilderStep, setUniversalBuilderStep, universalBuilderTemplates } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { BUTTONS, UniversalBuilderDict } = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {UniversalBuilderDict[userLanguage]['GALLERY']['LESSON_PAGES']}
        </h3>
      </div>
      {loading ? (
        <div className="py-20 text-center mx-auto">
          <p>{UniversalBuilderDict[userLanguage]['FETCHING']}</p>
        </div>
      ) : (
        <Fragment>
          <div className="p-4 max-h-screen overflow-y-auto">
            <div className="py-2">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
                <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="flex-1 flex flex-col p-8">Page</div>
                </li>
              </ul>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default StartSelectOrCreate;
