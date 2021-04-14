import React from 'react';
import { PagePart } from '../../../interfaces/UniversalLessonInterfaces';

interface RowWrapperProps {
  mode?: 'building' | 'viewing';
  children?: React.ReactNode;
  pagePart?: PagePart;
}

export const RowWrapper = (props: RowWrapperProps) => {
  const { mode, children, pagePart } = props;

  const viewModeClass = ``;
  const buildModeClass = `ring-2 hover:ring-4`;

  return (
    <div className={`m-4`}>
      <div
        className={`
        ${mode === 'building' ? buildModeClass : viewModeClass}
        overflow-hidden shadow rounded-lg divide-y divide-gray-200`}>
        {/*<div>*/}
        {/*  <p>Builder Info:</p>*/}
        {/*  <div className="flex flex-row px-4 py-5 sm:px-6 bg-mustard bg-opacity-20">*/}
        {/*    <span className={`mx-2`}>ID: {pagePart?.id}</span>*/}
        {/*    <span className={`mx-2`}>PARTTYPE: {pagePart?.partType}</span>*/}
        {/*    <span className={`mx-2`}>CLASS: {pagePart?.class}</span>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
