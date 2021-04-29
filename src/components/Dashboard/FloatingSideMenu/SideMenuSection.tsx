import React from 'react';

export const SideMenuSection = (props: {
  menuState?: number;
  setMenuState?: (level: number) => void;
  children?: React.ReactNode;
  sectionLabel?: string;
  sectionTitle?: string;
  setIsolatedSection?: (sectionStr: string) => void;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
  isOpen?: boolean;
  isChatActive?: boolean;
}) => {
  const {
    menuState,
    setMenuState,
    children,
    sectionLabel,
    sectionTitle,
    focusSection,
    setFocusSection,
  } = props;
  const thisSectionActive = focusSection === sectionLabel;
  const noSectionActive = focusSection === '';

  return (
    <div
      className={`
      transform  ease-in-out duration-700
      ${menuState === 0 ? 'scale-x-50 opacity-0 overflow-hidden' : ''}
       ${menuState === 1 ? 'scale-x-100 opacity-100' : ''}
       ${
         menuState === 2 && !thisSectionActive && !noSectionActive
           ? 'hidden opacity-0 overflow-hidden'
           : ''
       }
       ${thisSectionActive ? 'scale-x-100 opacity-100 flex-grow flex-1' : ''}
      flex flex-col
    `}>
      {menuState === 2 && thisSectionActive ? (
        <p
          className={`h-12 cursor-pointer text-indigo-800 flex items-center p-2 text-xl font-semibold rounded-md z-100`}>
          {sectionTitle || 'Section Title'}
        </p>
      ) : (
        <p
          className={`h-12 cursor-pointer text-indigo-100 flex items-center p-2 text-sm font-medium rounded-md z-100`}>
          {sectionTitle || 'Section Title'}
        </p>
      )}
      {children ? (
        menuState < 2 ? (
          <div className={`flex flex-col flex-1 bg-gray-600 rounded-lg p-2`}>
            {menuState === 1
              ? thisSectionActive
                ? children
                : noSectionActive
                ? children
                : ''
              : ''}
          </div>
        ) : (
          <div className={`flex flex-col flex-1 p-2`}>{children}</div>
        )
      ) : null}
    </div>
  );
};