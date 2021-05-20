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
  hideAllModals?: () => void;
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
    hideAllModals,
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
    <div className={` z-50 `}>
      {/* Page Selection Buttons */}
      {!props.loading && (
        <div className={`bg-white`}>
          {/* Header */}
          <div className="flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex items-center justify-start">
            <p className="w-auto bg-white text-lg font-medium text-gray-900">
              Lesson Pages
            </p>
            <Buttons
              onClick={() => handleModalPopToggle('NEW_PAGE')}
              Icon={VscNewFile}
              label="New Page"
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            />
          </div>

          <div className="mt-4 py-4 flex flex-wrap bg-gray-200">
            {pages && pages.length > 0
              ? pages.map((page: UniversalLessonPage, idx: number) => (
                  <div
                    key={`pageSelector_${idx}`}
                    id={`pageThumb_${page.id}`}
                    onClick={() => handleSelectPage(page.id)}
                    className={`w-auto ml-4 flex flex-col cursor-pointer`}>
                    <div className="relative w-16 h-24 mb-2 bg-white rounded" />
                    <p className={`text-center text-sm text-gray-600`}>{page.id}</p>
                  </div>
                ))
              : null}
          </div>

          {/*<PageGalleryControls handleModalPopToggle={handleModalPopToggle}/>*/}
        </div>
      )}
    </div>
  );
};

export default PageSelector;
