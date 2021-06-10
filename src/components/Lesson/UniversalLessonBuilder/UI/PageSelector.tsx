import React from 'react';
import {
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {VscFileMedia, VscNewFile} from 'react-icons/vsc';
import Buttons from '../../../Atoms/Buttons';
import {IconContext} from 'react-icons';
import PageTile from './common/PageTile';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface PageSelectorProps extends ULBSelectionProps {
  universalLessonDetails: UniversalLesson;
  universalBuilderDict: any;
  userLanguage: any;
  galleryVisible: boolean;
  loading: boolean;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  hideAllModals?: () => void;
}

const PageSelector = (props: PageSelectorProps) => {
  const {
    universalLessonDetails,
    setSelectedPageID,
    deleteFromULBHandler,
    handleModalPopToggle,
    selectedPageID,
    hideAllModals,
  } = props;
  const pages = universalLessonDetails?.lessonPlan;

  const selectPage = (pageID: string) => {
    const thePageObj = pages?.find((page: UniversalLessonPage) => page.id === pageID);
    if (thePageObj) {
      setSelectedPageID(pageID);
    } else {
      throw 'No page object was found in UniversalLessonPages';
    }
  };

  const handleSelectPage = (pageID: string) => {
    try {
      selectPage(pageID);
      hideAllModals();
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
          {/* <div className="flex items-center" aria-hidden="true">
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
          </div> */}

          <div className="py-4 flex flex-wrap bg-gray-200">
            {pages && pages.length > 0
              ? pages.map((page: UniversalLessonPage, idx: number) => (
                  <div
                    key={`pageSelector_${idx}`}
                    id={`pageThumb_${page.id}`}
                    onClick={() => handleSelectPage(page.id)}
                    className={`${
                      selectedPageID === page.id ? 'bg-gray-300' : ''
                    } w-auto ml-4 flex flex-col cursor-pointer border-0 hover:bg-gray-300 p-2 px-6 rounded-md transition-all duration-300`}>
                    <PageTile />
                    <p className={`text-center text-sm text-gray-600`}>{page.id}</p>
                    <button
                      onClick={() => deleteFromULBHandler(page.id)}
                      className={`text-center text-xs font-semibold text-red-600 bg-red-200 px-2 py-1 cursor-pointer rounded mt-2`}>
                      Delete
                    </button>
                  </div>
                ))
              : null}

            <Buttons
              onClick={() => handleModalPopToggle('NEW_PAGE')}
              Icon={VscNewFile}
              label="New Page"
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            />
          </div>

          {/*<PageGalleryControls handleModalPopToggle={handleModalPopToggle}/>*/}
        </div>
      )}
    </div>
  );
};

export default PageSelector;
