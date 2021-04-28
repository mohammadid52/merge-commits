import React from 'react';

export const SideMenuSection = (props: {
  menuState?: number;
  setMenuState?: (level: number) => void;
  children?: React.ReactNode;
  sectionLabel?: string;
  sectionTitle?: string;
  setIsolatedSection?: (sectionStr: string) => void;
  focusSection?: string;
  isOpen?: boolean;
  isChatActive?: boolean;
}) => {
  const {
    menuState,
    setMenuState,
    children,
    sectionLabel,
    sectionTitle,
    setIsolatedSection,
    focusSection,
    isOpen,
    isChatActive,
  } = props;
  const thisSectionActive = focusSection === sectionLabel;
  const noSectionActive = focusSection === '';

  return (
    <div
      className={`
      transform transition-all ease-in-out duration-700 
      ${menuState === 0 ? 'scale-x-50 opacity-0 overflow-hidden' : ''}
       ${menuState === 1 ? 'scale-x-100 opacity-100' : ''}
       ${
         menuState === 2 && !thisSectionActive && !noSectionActive
           ? 'h-0 opacity-0 overflow-hidden'
           : ''
       }
       ${
         menuState === 2 && thisSectionActive
           ? 'scale-x-100 opacity-100 flex-grow flex-1'
           : ''
       }
      flex flex-col
    `}>
      <p
        className={`cursor-pointer text-indigo-100 group flex items-center p-2 text-sm font-medium rounded-md`}>
        {sectionTitle || 'Section Title'}
      </p>
      {children ? (
        <div className={`flex flex-col flex-1`}>{children}</div>
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