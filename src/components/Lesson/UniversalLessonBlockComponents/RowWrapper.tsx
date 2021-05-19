import React from 'react';
import {RowWrapperProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';

export const RowWrapper = (props: RowWrapperProps) => {
  const {mode, hasContent, dataIdAttribute, contentID, children, pagePart} = props;

  const viewModeClass = ``;
  const buildModeClass = `border-0 border-dashed border-gray-400`;

  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`
        relative
        my-4
        z-50
      `}>
      <div
        className={`
          ${mode === 'building' ? buildModeClass : viewModeClass}
          shadow rounded-lg divide-y divide-gray-200
          z-50
          `}>
        <div className="relative z-50">{children}</div>
      </div>
    </div>
  );
};
