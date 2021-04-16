import Buttons from '../../../../Atoms/Buttons';
import React from 'react';
import { VscNewFile } from 'react-icons/vsc';
import { ImInsertTemplate } from 'react-icons/im';

export const PageGalleryControls = () => {
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
        <Buttons Icon={VscNewFile} label="New Page" btnClass="px-4 mx-4" />
        <Buttons Icon={ImInsertTemplate} label="Page From Template" btnClass="px-4 mx-4" />
      </div>
    </>
  );
};
