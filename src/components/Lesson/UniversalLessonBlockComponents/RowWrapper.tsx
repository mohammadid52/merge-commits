import React from 'react';
import {PagePart} from '../../../interfaces/UniversalLessonInterfaces';
import {RowWrapperProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';

export const RowWrapper = (props: RowWrapperProps) => {
  const {contentID, mode, children, pagePart, handleMouseOverToggle} = props;

  const viewModeClass = ``;
  const buildModeClass = `ring-2 hover:ring-4`;

  return (
    <div
      id={contentID}
      className={`my-4`}
      onMouseEnter={mode === 'building' ? handleMouseOverToggle : undefined}
      onMouseLeave={mode === 'building' ? handleMouseOverToggle : undefined}>
      <div
        className={`
        ${mode === 'building' ? buildModeClass : viewModeClass}
        overflow-hidden shadow rounded-lg divide-y divide-gray-200`}>
        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
