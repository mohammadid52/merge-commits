import React from 'react';
import {RowWrapperProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';

export const RowWrapper = (props: RowWrapperProps) => {
  const {mode, hasContent, dataIdAttribute, contentID, children, pagePart} = props;

  const viewModeClass = ``;
  const buildModeClass = `ring-2 hover:ring-4`;

  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`
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
