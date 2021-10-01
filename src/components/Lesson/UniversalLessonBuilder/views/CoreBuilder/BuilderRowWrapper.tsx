import React, {useContext} from 'react';
import {getAsset} from 'assets';
import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '@interfaces/UniversalLessonBuilderInterfaces';

export const BuilderRowWrapper = (props: RowWrapperProps) => {
  const {
    mode,

    dataIdAttribute,
    contentID,

    children,
  } = props;

  const viewModeClass = ``;

  const {previewMode, selID} = mode !== 'lesson' ? useULBContext() : true;

  const {
    clientKey,
    state: {lessonPage: {theme = 'dark'} = {}},
  } = useContext(GlobalContext);

  const themeColor = getAsset(clientKey, 'themeClassName');

  const getColorBorder = (theme = 'indigo') => {
    return `border-${theme}-400`;
  };
  // const themeBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'; // disable for now
  // ${
  //   previewMode ? `${themeBg}  rounded-xl shadow-lg` : ''
  // }
  const themeBorder =
    theme === 'dark'
      ? 'border-yellow-400'
      : getColorBorder(themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue');

  const customBorder =
    selID?.pageContentID === contentID && !selID?.partContentID
      ? `border-0 ${themeBorder}`
      : 'border-0 border-gray-400 border-dashed';

  return (
    <div id={contentID} data-id={dataIdAttribute} className={`relative my-8`}>
      <div
        className={` builderWrapper transition-all duration-200 ${
          mode === 'building' && !previewMode ? customBorder : viewModeClass
        } builderWrapper rounded-lg divide-y divide-gray-200 ${
          !previewMode ? 'shadow' : ''
        }`}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
