import Buttons from '../../../../Atoms/Buttons';
import React from 'react';
import {VscNewFile} from 'react-icons/vsc';
import {ImInsertTemplate} from 'react-icons/im';

interface PageGalleryControls {
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export const PageGalleryControls = (props: PageGalleryControls) => {
  const {handleModalPopToggle} = props;
  return (
    <>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-0 border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-lg font-medium text-gray-900">Options</span>
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex flex-row justify-center`}>
        <Buttons
          onClick={() => handleModalPopToggle('NEW_PAGE')}
          Icon={VscNewFile}
          label="New Page"
          btnClass="px-4 mx-4"
        />
        <Buttons
          onClick={() => handleModalPopToggle('USE_TEMPLATE')}
          Icon={ImInsertTemplate}
          label="Page From Template"
          btnClass="px-4 mx-4"
        />
      </div>
    </>
  );
};
