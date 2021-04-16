import React, { Fragment } from 'react';
import { UniversalLesson, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';

interface PageSelectorProps {
  universalLessonDetails: UniversalLesson;
  universalBuilderDict: any;
  userLanguage: any;
  galleryVisible: boolean;
  loading: boolean;
  selectedPageDetails?: UniversalLessonPage;
  setSelectedPageDetails?: React.Dispatch<React.SetStateAction<UniversalLessonPage>>;
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
           ${galleryVisible ? 'transition ease-out duration-100' : 'transition ease-in duration-75'}
           ${galleryVisible ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95'}
        `}>
      {!props.loading && (
        <div className={`bg-white`}>
          <div className="max-h-screen px-4 overflow-y-auto">
            <div className="py-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {pages && pages.length > 0
                  ? pages.map((page: UniversalLessonPage, idx: number) => (
                      <button
                        key={`pageSelector_${idx}`}
                        id={`pageThumb_${page.id}`}
                        onClick={() => handleSelectPage(page.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <div className="flex-1 flex flex-col p-2 text-center">{page.id}</div>
                      </button>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSelector;
