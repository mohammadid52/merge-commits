import React, { Fragment, useEffect, useState } from 'react';
import { PagePart, PartContent, UniversalLessonPage } from '../../../../../interfaces/UniversalLessonInterfaces';

interface SlideOutTreeViewProps {
  open?: boolean;
  toggleOpen?: (openOrClosed: boolean) => void;
  selectedPageDetails?: UniversalLessonPage;
  selectedPagePartDetails: PagePart;
  setSelectedPagePartDetails: React.Dispatch<React.SetStateAction<PagePart>>;
  selectedPartContentDetails: PartContent;
  setSelectedPartContentDetails: React.Dispatch<React.SetStateAction<PartContent>>;
}

export const SlideOutTreeView = (props: SlideOutTreeViewProps) => {
  const {
    selectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
  } = props;

  useEffect(() => {
    console.log('slideOutTreeView -> ', selectedPageDetails);
  }, []);

  const handleSelectionProcess = (pagePartDetails: PagePart, partContentDetails: PartContent) => {
    //set page part
    setSelectedPagePartDetails(pagePartDetails);
    // set part content state
    setSelectedPartContentDetails(partContentDetails);
  };

  const generatePagePartButtons = (pagePartArr: PagePart[]) => {
    if (pagePartArr.length > 0) {
      return pagePartArr.map((pagePart: PagePart, idx: number) => (
        <div key={`pagePart_tree_${idx}`} className="space-y-1">
          <button
            type="button"
            className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-controls={`sub-menu-${idx}`}
            aria-expanded="false">
            {pagePart.id}
          </button>
          <div className="space-y-1" id={`sub-menu-${idx}`}>
            {pagePart.partContent.length > 0 &&
              pagePart.partContent.map((partContent: PartContent, idx2: number) => (
                <a
                  key={`pagePart_tree_${idx}_${idx2}`}
                  href="#"
                  onClick={() => handleSelectionProcess(pagePart, partContent)}
                  className="group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 bg-gray-300 hover:bg-gray-200">
                  {partContent.id}
                </a>
              ))}
          </div>
        </div>
      ));
    } else {
      return <p>No page parts...</p>;
    }
  };

  return (
    <div className="w-48 flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-gray-600 overflow-y-auto">
      <div className="flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1 bg-gray-600" aria-label="Sidebar">
          {selectedPageDetails &&
            selectedPageDetails.pageContent &&
            generatePagePartButtons(selectedPageDetails.pageContent)}
        </nav>
      </div>
    </div>
  );
};
