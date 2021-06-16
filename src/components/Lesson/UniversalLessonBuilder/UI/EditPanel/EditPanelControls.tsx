import React from 'react';
import Buttons from '../../../../Atoms/Buttons';

interface EditPanelControls {
  updateSelectedPageDetails: () => void;
  discardChanges: () => void;
}

export const EditPanelControls = (props: EditPanelControls) => {
  const { updateSelectedPageDetails, discardChanges } = props;
  return (
    <div className={`w-full flex flex-col justify-center`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-start">
          <span className="pr-2 bg-white text-sm text-gray-500">Controls</span>
        </div>
      </div>

      <button
        id={`editPanel_save`}
        onClick={updateSelectedPageDetails}
        className="inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <div className="flex-1 flex flex-col p-2 text-center">Save Changes</div>
      </button>
      <button
        id={`editPanel_discard`}
        onClick={discardChanges}
        className="inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <div className="flex-1 flex flex-col p-2 text-center">Discard Changes</div>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>
      <button
        id={`editPanel_save`}
        className="inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <div className="flex-1 flex flex-col p-2 text-center">Delete Block</div>
      </button>
    </div>
  );
};
