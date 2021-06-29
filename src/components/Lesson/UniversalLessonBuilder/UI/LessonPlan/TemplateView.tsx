import React, { useContext } from 'react';
import { useHistory } from 'react-router';

import Buttons from '../../../../Atoms/Buttons';

import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import { getAsset } from '../../../../../assets';
import { useQuery } from '../../../../../customHooks/urlParam';
import PageTile from '../common/PageTile';

const TemplateView = ({ universalLessonDetails }: any) => {
  const history = useHistory();
  const { theme, clientKey, userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { LessonBuilderDict } = useDictionary(clientKey);
  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');
  const pages = universalLessonDetails ?.lessonPlan;
  return (
    <div className="w-full m-auto">
      <div className="overflow-hidden mb-4">
        <div className="relative flex items-center justify-between mb-2">
          {/* <h2 className="w-auto bg-white text-lg font-semibold  text-gray-900 truncate">
            Use Existing Page
          </h2> */}
          {/* <Buttons
            onClick={() => handleToggleFocussed('existing_page')}
            Icon={VscNewFile}
            label={`${focussed === 'existing_page' ? 'Less' : 'More'}`}
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-indigo-400 rounded-lg hover:bg-indigo-500 transition-all"
          /> */}
        </div>
        <div className="px-4">
          <div className={`w-full bg-gray-200 rounded py-2`}>
            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              Style 1
            </p>
            <div className="mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200">
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            </div>

            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              Style 2
            </p>
            <div className="mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200">
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={LessonBuilderDict[userLanguage]['BUTTON']['SAVE']}
                type="submit"
                // onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateView;
