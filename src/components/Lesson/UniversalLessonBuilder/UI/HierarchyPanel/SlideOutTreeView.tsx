import React, {Fragment, useEffect, useState} from 'react';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import {BsLayers, ImParagraphLeft, MdInput} from 'react-icons/all';
import {MdTitle} from 'react-icons/md';
import {IconContext} from 'react-icons';

interface SlideOutTreeViewProps {
  open?: boolean;
  toggleOpen?: (openOrClosed: boolean) => void;
  selectedPageDetails?: UniversalLessonPage;
}

export const SlideOutTreeView = (props: SlideOutTreeViewProps) => {
  const {selectedPageDetails} = props;

  // const handleSelectionProcess = (
  //   pagePartDetails: PagePart,
  //   partContentDetails: PartContent
  // ) => {
  //   //set page part
  //   setSelectedPagePartDetails(pagePartDetails);
  //   // set part content state
  //   setSelectedPartContentDetails(partContentDetails);
  // };

  const getTreeIcon = (partType: string) => {
    switch (partType) {
      case 'paragraph':
        return <ImParagraphLeft />;
      case 'header-section':
        return <MdTitle />;
      case 'form-numbered':
      case 'form-default':
        return <MdInput />;
      default:
        return <BsLayers />;
    }
  };

  const generatePagePartButtons = (pagePartArr: PagePart[]) => {
    if (pagePartArr.length > 0) {
      return pagePartArr.map((pagePart: PagePart, idx: number) => (
        <div key={`pagePart_tree_${idx}`} className="">
          <button
            key={`hierarchy_parent_btn_${idx}`}
            type="button"
            className={`bg-dark text-white
            hover:bg-white hover:bg-opacity-10
            group w-full flex
            items-center p-2 text-sm
            font-medium text-left
            border-l-4 border-indigo-600 rounded-r-md
            `}
            aria-controls={`sub-menu-${idx}`}
            aria-expanded="false">
            <IconContext.Provider value={{className: 'w-auto mr-2', size: '24px'}}>
              {getTreeIcon('')}
            </IconContext.Provider>
            <span>{pagePart.id}</span>
          </button>
          <div className="" id={`sub-menu-${idx}`}>
            {pagePart.partContent.length > 0 &&
              pagePart.partContent.map((partContent: PartContent, idx2: number) => (
                <a
                  key={`pagePart_tree_${idx}_${idx2}`}
                  href={`#${partContent.id}`}
                  className={`group w-full flex items-center p-2 text-sm font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 bg-dark my-1`}>
                  <div className={`ml-2 flex flex-row justify-start`}>
                    <IconContext.Provider
                      value={{className: 'w-auto mr-2', size: '24px'}}>
                      {getTreeIcon(partContent.type)}
                    </IconContext.Provider>
                    <span className={``}>{partContent.id}</span>
                  </div>
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
    <div className="min-w-72 max-w-96 flex flex-col flex-grow p-1 overflow-y-auto bg-dark shadow-lg rounded-b-md">
      <div className="flex-grow flex flex-col">
        <nav className="flex-1" aria-label="Sidebar">
          {selectedPageDetails &&
            selectedPageDetails.pageContent &&
            generatePagePartButtons(selectedPageDetails.pageContent)}
        </nav>
      </div>
    </div>
  );
};
