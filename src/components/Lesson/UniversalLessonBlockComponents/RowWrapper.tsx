import React from 'react';
import { RowWrapperProps } from '../../../interfaces/UniversalLessonBuilderInterfaces';

export const RowWrapper = (props: RowWrapperProps) => {
  const {
    mode,
    hasContent,
    dataIdAttribute,
    contentID,
    children,
    pagePart,
    handleMouseOverToggle,
  } = props;

  const viewModeClass = ``;
  const buildModeClass = `ring-2 hover:ring-4`;

  return (
    <div
      id={contentID}
      data-id={dataIdAttribute}
      className={`
      my-4
      ${hasContent ? 'cursor-pointer' : ''}
      `}
      onMouseEnter={
        mode === 'building' && !hasContent ? handleMouseOverToggle : undefined
      }
      onMouseLeave={
        mode === 'building' && !hasContent ? handleMouseOverToggle : undefined
      }>
      <div
        className={`
        ${mode === 'building' ? buildModeClass : viewModeClass}
        overflow-hidden shadow rounded-lg divide-y divide-gray-200`}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
