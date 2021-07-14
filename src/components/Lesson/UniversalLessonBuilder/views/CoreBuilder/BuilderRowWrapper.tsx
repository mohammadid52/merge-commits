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

  const {previewMode} = mode !== 'lesson' ? useULBContext() : true;
  const buildModeClass = `border-0 border-dashed border-gray-400`;
  const {
    state: {lessonPage: {theme = 'dark'} = {}},
  } = useContext(GlobalContext);
  // useEffect(()=>{console.log('row wrappwer ---',children)},[children])
  const themeBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`relative my-4 ${
        previewMode ? `${themeBg}  rounded-xl shadow-lg` : ''
      }`}>
      <div
        className={`${
          mode === 'building' && !previewMode ? buildModeClass : viewModeClass
        } builderWrapper rounded-lg divide-y divide-gray-200 ${
          !previewMode ? 'shadow' : ''
        }`}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
