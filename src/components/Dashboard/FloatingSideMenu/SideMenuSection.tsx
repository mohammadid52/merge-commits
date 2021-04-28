import React from 'react';

export const SideMenuSection = (props: {
  children?: React.ReactNode;
  sectionLabel?: string;
  sectionTitle?: string;
  setIsolatedSection?: (sectionStr: string) => void;
  fullSection?: string;
}) => {
  const thisSectionFull = props.sectionTitle.includes(props.fullSection);
  const noSectionFull = props.fullSection === '';

  return (
    <div
      className={`
      transition transition-all transform duration-500 ease-in-out
    ${
      noSectionFull || thisSectionFull
        ? 'h-full scale-y-100 opacity-100'
        : 'h-0 scale-y-0 opacity-0 overflow-hidden'
    }
      flex flex-col
    `}>
      <p
        className={`cursor-pointer text-indigo-100 group flex items-center p-2 text-sm font-medium rounded-md`}>
        {props.sectionTitle || 'Section Title'}
      </p>
      {props.children ? (
        <div className={`flex-1`}>{props.children}</div>
      ) : (
        <div className={`grid grid-cols-3 gap-2 p-2 bg-indigo-600`}>
          <div className="cursor-pointer mx-auto inline-block h-10 w-10 rounded-full bg-gray-700" />
          <div className="cursor-pointer mx-auto inline-block h-10 w-10 rounded-full bg-gray-700" />
          <div className="cursor-pointer mx-auto inline-block h-10 w-10 rounded-full bg-gray-700" />
          <div className="cursor-pointer mx-auto inline-block h-10 w-10 rounded-full bg-gray-700" />
          <div className="cursor-pointer mx-auto inline-block h-10 w-10 rounded-full bg-gray-700" />
          <div className="cursor-pointer mx-auto inline-block h-10 w-10 rounded-full bg-gray-700" />
        </div>
      )}
    </div>
  );
};