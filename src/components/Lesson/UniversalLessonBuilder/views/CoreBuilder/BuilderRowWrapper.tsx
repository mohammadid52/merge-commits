import React, {useContext, useEffect} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';

export const BuilderRowWrapper = (props: RowWrapperProps) => {
  const {
    mode,
    hasContent,
    dataIdAttribute,
    contentID,
    classString,
    children,
    pagePart,
  } = props;

  const viewModeClass = ``;

  const {previewMode, selID} = mode !== 'lesson' ? useULBContext() : true;

  const {
    state: {lessonPage: {theme = 'dark'} = {}},
  } = useContext(GlobalContext);

  const themeBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';

  const customBorder =
    selID?.pageContentID === contentID && !selID?.partContentID
      ? 'border-2 border-yellow-400'
      : 'border-0 border-gray-400';

  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`relative my-4 ${
        previewMode ? `${themeBg}  rounded-xl shadow-lg` : ''
      }`}>
      <div
        className={`border-dashed builderWrapper transition-all duration-200 ${
          mode === 'building' && !previewMode ? customBorder : viewModeClass
        } builderWrapper rounded-lg divide-y divide-gray-200 ${
          !previewMode ? 'shadow' : ''
        }`}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};