import {useGlobalContext} from '@contexts/GlobalContext';
import {usePageBuilderContext} from '@contexts/PageBuilderContext';
import {PartContentSub, UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, {Fragment, useEffect, useState} from 'react';
import {BsCircle} from 'react-icons/bs';
import {GoLocation} from 'react-icons/go';
import {IoLocationSharp} from 'react-icons/io5';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {useOverlayContext} from '@contexts/OverlayContext';
import {RowWrapperProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {SPACER} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';

interface IEditOverlayBlockProps extends RowWrapperProps {
  handleEditBlockContent?: () => void;
  section?: string;
  pageContentID?: string;
  partContentID?: string;
  contentType?: string;
  contentValue?: PartContentSub[];
}

const EditOverlayBlock = (props: IEditOverlayBlockProps) => {
  const {
    mode,
    children,
    contentID,
    pageContentID,
    partContentID,
    isComponent,
    section,
    classString,
    contentValue,
    contentType,
    handleModalPopToggle,
    handleEditBlockContent,
  } = props;

  const {previewMode, universalLessonDetails} = useULBContext();
  const {
    showingPin,
    setSelectedComponent,
    selectedComponent,
    actionMode,
    setShowingPin,
    navState,

    setActionMode,
  } = usePageBuilderContext();
  console.log(
    '🚀 ~ file: EditOverlayBlock.tsx ~ line 53 ~ EditOverlayBlock ~ selectedComponent',
    selectedComponent
  );

  const {setAddContentModal} = useOverlayContext();

  const {
    lessonState: {currentPage: pageIdx},
  } = useGlobalContext();

  const currentPage: UniversalLessonPage = get(
    universalLessonDetails,
    `lessonPlan[${pageIdx}]`,
    null
  );

  const onComponentCreateClick = () => {
    if (!isEmpty(selectedComponent)) {
      setAddContentModal({show: true, type: selectedComponent.componentData.type});
      const position = selectedComponent.partContentIdx + 1; // this the position idx where the new component will go
      if (typeof handleModalPopToggle === 'function') {
        handleModalPopToggle(
          '',
          position,
          'partContent',
          selectedComponent?.pageContentID
        );
      }
    }
  };

  const onEditClick = () => {
    handleEditBlockContent();

    setActionMode('init');
  };
  // This function will select component position, for adding new component
  const onComponentSelect = () => {
    if (currentPage) {
      const pageContentIdx = findIndex(
        currentPage?.pageContent,
        (d: any) => d.id === pageContentID
      );

      const pageContent = currentPage.pageContent[pageContentIdx];
      const partContentIdx = findIndex(
        pageContent?.partContent,
        (d) => d.id === partContentID
      );

      // setShowingPin(false);

      const obj = {
        pageContentIdx,
        partContentIdx,
        pageContentID,
        partContentID,
        componentData: {
          type: contentType,
          class: classString,
          value: contentValue,
        },
      };

      setSelectedComponent(obj);

      if (actionMode === 'edit') {
        onEditClick();
      }
    }
  };

  useEffect(() => {
    if (navState === 'addContent') {
      if (!isEmpty(selectedComponent)) {
        onComponentCreateClick();
      }
    }
  }, [navState, selectedComponent]);

  const currentComponentSelected =
    selectedComponent?.pageContentID === pageContentID &&
    selectedComponent?.partContentID === partContentID;

  return (
    <Fragment key={`${contentID}`}>
      {mode === 'building' ? (
        <div
          className={`
        relative  
        ${section === 'partContent' ? 'h-full' : 'h-auto'} 
        flex items-center rowWrapper
        ${
          isComponent && !previewMode
            ? 'border-b-0 border-dashed border-gray-400 pb-1'
            : ''
        }
        `}>
          {isComponent &&
            showingPin &&
            !(actionMode === 'edit' && contentType === SPACER) && (
              <div
                id="editControlsWrapper"
                style={{top: '10%', left: '-6%'}}
                className={`absolute ${
                  true ? 'active' : ''
                } flex flex-row items-center inset-y-0 bg-transparent rounded-lg h-auto w-auto justify-center`}>
                <button
                  onClick={() => onComponentSelect()}
                  // onMouseLeave={() => setShowLocationIcon(false)}
                  // onMouseEnter={() => {
                  //   setShowLocationIcon(true);
                  // }}
                  className={`py-1 px-4 ${
                    currentComponentSelected ? '' : 'border'
                  } transition-all duration-300 cursor-pointer`}>
                  {currentComponentSelected ? (
                    <IoLocationSharp className="text-2xl text-gray-400" />
                  ) : (
                    <div className="w-auto p-2 rounded-full border-0 border-gray-400 hover:bg-gray-400"></div>
                  )}
                </button>
              </div>
            )}
          {/* <EditOverlayControls
            mode={mode}
            contentID={contentID}
            pageContentID={pageContentID}
            classString={classString}
            isActive={contentID === editedID}
            isComponent={isComponent}
            isPagePart={isPagePart}
            updateContent={updateBlockContentULBHandler}
            section={section}
            partContentID={partContentID}
            handleEditBlockContent={handleEditBlockContent}
            handleEditBlockToggle={handleEditBlockToggle}
            createNewBlockULBHandler={createNewBlockULBHandler}
            deleteFromULBHandler={deleteFromULBHandler}
            updateFromULBHandler={updateFromULBHandler}
          /> */}
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </Fragment>
  );
};

export default EditOverlayBlock;
