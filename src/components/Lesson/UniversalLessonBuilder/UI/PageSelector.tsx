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
           z-50
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
              {/* Header */}
              <div className="relative p-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative mx-2 flex items-center justify-start">
                  <p className="w-auto bg-white text-lg font-medium text-gray-900">
                    Lesson Pages
                  </p>
                  <Buttons
                    onClick={() => handleModalPopToggle('NEW_PAGE')}
                    Icon={VscNewFile}
                    label="New Page"
                    overrideClass={true}
                    btnClass="w-auto text-white bg-gray-400 mx-2 w-16"
                  />
                </div>
              </div>

              <div className="py-4 flex flex-wrap bg-gray-200">
                {pages && pages.length > 0
                  ? pages.map((page: UniversalLessonPage, idx: number) => (
                      <div
                        key={`pageSelector_${idx}`}
                        id={`pageThumb_${page.id}`}
                        onClick={() => handleSelectPage(page.id)}
                        className={`w-auto ml-4 flex flex-col cursor-pointer`}>
                        <div className="relative w-16 h-24 mb-2 bg-white rounded"/>
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
