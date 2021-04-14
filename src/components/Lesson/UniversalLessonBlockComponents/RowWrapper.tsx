import React from 'react';
import { PagePart } from '../../../interfaces/UniversalLessonInterfaces';

interface RowWrapperProps {
  children?: React.ReactNode;
  pagePart?: PagePart;
}

export const RowWrapper = (props: RowWrapperProps) => {
  const { children, pagePart } = props;
  return (
    <div className={`m-4`}>
      <div className="overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        {/**
         *
         **/}

        <div className="px-4 py-5 sm:px-6">
          <p>ID: {pagePart?.id}</p>
          <p>PARTTYPE: {pagePart?.partType}</p>
          <p>CLASS: {pagePart?.class}</p>
        </div>

        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
