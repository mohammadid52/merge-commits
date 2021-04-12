import React, { Fragment, useContext, useEffect, useState } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';

import Buttons from '../../../Atoms/Buttons';
import useDictionary from '../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { UniversalBuilderDict } from '../../../../dictionary/dictionary.iconoclast';


import PageSelector from '../test_components/PageSelector';



interface ExistingLessonTemplateProps {
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
}


// GRID SHOWING EXISTING TEMPLATES TILES
const BuilderWrapper = (props: ExistingLessonTemplateProps) => {
  const { universalBuilderStep, setUniversalBuilderStep, universalBuilderTemplates } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { BUTTONS, UniversalBuilderDict } = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);

  const [layout, setLayout] = useState<any[]>([]);

const onLayoutChange = (layout: any) => {
    setLayout(layout);
  }


  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <PageSelector universalBuilderDict={UniversalBuilderDict} userLanguage={userLanguage} loading={loading} />

      <div className='px-4 py-5 border-b-0 border-gray-200 sm:px-6 flex flex-row'>
        <Buttons label={'Add New Page'} />
        <Buttons label={'Add New Page From Template'} disabled={true} />
      </div>

      <div className={`bg-darker-gray`}>
        <div className={`w-full max-w-256 mx-auto`}>

        {/* PUT PAGE BUILDER HERE */}

        </div>
      </div>
    </div>
  );
};

export default BuilderWrapper;
