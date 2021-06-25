import React, { useEffect } from 'react';
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

  useEffect(()=>{console.log('row wrappwer ---',children)},[children])

  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`
        relative
        my-4
      `}>
      <div
        className={`
          ${mode === 'building' && !previewMode ? buildModeClass : viewModeClass}
           rounded-lg divide-y divide-gray-200
          ${!previewMode ? 'shadow' : ''}
          `}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
