import React, {Fragment} from 'react';
import {
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {PageGalleryControls} from './PageSelector/PageGalleryControls';
import {VscNewFile} from 'react-icons/vsc';
import Buttons from '../../../Atoms/Buttons';

interface PageSelectorProps {
  universalLessonDetails: UniversalLesson;
  universalBuilderDict: any;
  userLanguage: any;
  galleryVisible: boolean;
  loading: boolean;
  selectedPageDetails?: UniversalLessonPage;
  setSelectedPageDetails?: React.Dispatch<React.SetStateAction<UniversalLessonPage>>;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

const PageSelector = (props: PageSelectorProps) => {
  const {
    universalLessonDetails,
    selectedPageDetails,
    setSelectedPageDetails,
    universalBuilderDict,
    userLanguage,
    galleryVisible,
    loading,
    handleModalPopToggle,
  } = props;
  const pages = universalLessonDetails?.universalLessonPages;

  const selectPage = (pageID: string) => {
    const thePageObj = pages?.find((page: UniversalLessonPage) => page.id === pageID);
    if (thePageObj) {
      setSelectedPageDetails(thePageObj);
    } else {
      throw 'No page object was found in UniversalLessonPages';
    }
  };

  const handleSelectPage = (pageID: string) => {
    try {
      selectPage(pageID);
    } catch (e) {
      console.error('handleSelectPage: ', e);
    }
  };

  return (
    <div
      className={`
           absolute z-50
           ${
             galleryVisible
               ? 'transition ease-out duration-100'
               : 'transition ease-in duration-75'
           }
           ${
             galleryVisible
               ? 'transform opacity-100'
               : 'transform opacity-0 h-0 overflow-hidden'
           }
        `}>
      {/* Page Selection Buttons */}
      {!props.loading && (
        <div className={`bg-white`}>
          <div className="max-h-screen px-4 overflow-y-auto">
            <div className="py-2">
              {/* Header */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-lg font-medium text-gray-900">
                    Lesson Pages
                  </span>
                  <span>
                    <Buttons
                      onClick={() => handleModalPopToggle('NEW_PAGE')}
                      Icon={VscNewFile}
                      label="New Page"
                      btnClass="px-4 mx-4"
                    />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {pages && pages.length > 0
                  ? pages.map((page: UniversalLessonPage, idx: number) => (
                      <button
                        key={`pageSelector_${idx}`}
                        id={`pageThumb_${page.id}`}
                        onClick={() => handleSelectPage(page.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <div className="flex-1 flex flex-col p-2 text-center">
                          {page.id}
                        </div>
                      </button>
                    ))
                  : null}
              </div>

              {/*<PageGalleryControls handleModalPopToggle={handleModalPopToggle}/>*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSelector;
