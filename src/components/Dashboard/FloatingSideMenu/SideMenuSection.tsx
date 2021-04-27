import React from 'react';

export const SideMenuSection = (props: {
  children?: React.ReactNode;
  sectionTitle: string;
}) => {
  return (
    <>
      <p
        className={`cursor-pointer text-indigo-100 group flex items-center p-2 text-sm font-medium rounded-md`}>
        {props.sectionTitle || 'Section Title'}
      </p>
      {props.children ? (
        <div>{props.children}</div>
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
    </>
  );
};