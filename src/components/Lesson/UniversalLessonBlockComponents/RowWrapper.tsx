import React from 'react';
import {RowWrapperProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';

export const RowWrapper = (props: RowWrapperProps) => {
  const {mode, hasContent, dataIdAttribute, contentID, classString, children, pagePart} = props;

  const viewModeClass = ``;
  const buildModeClass = `border-0 border-dashed border-gray-400`;

  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`
        ${classString ? classString : ''}
        relative
        my-4
        
      `}>
      <div
        className={`
          ${mode === 'building' ? buildModeClass : viewModeClass}
          shadow rounded-lg divide-y divide-gray-200
          
          `}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
