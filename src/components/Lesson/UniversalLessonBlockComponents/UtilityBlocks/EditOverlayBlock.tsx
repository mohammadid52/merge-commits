import {
  GAME_CHANGERS,
  SPACER
} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useOverlayContext} from 'contexts/OverlayContext';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub, UniversalLessonPage} from 'interfaces/UniversalLessonInterfaces';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import React, {Fragment, useEffect, useState} from 'react';
import {IoLocationSharp} from 'react-icons/io5';

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
    handleEditBlockContent
  } = props;

  const {universalLessonDetails} = useULBContext();
  const {
    showingPin,
    setSelectedComponent,
    selectedComponent,
    actionMode,
    navState,
    selectedType,
    showingBlockPin
  } = usePageBuilderContext();

  const {setAddContentModal} = useOverlayContext();

  const deleteMode = actionMode === 'delete';

  const {
    lessonState: {currentPage: pageIdx}
  } = useGlobalContext();

  const currentPage: UniversalLessonPage = get(
    universalLessonDetails,
    `lessonPlan[${pageIdx}]`,
    null
  );
  const [$currentPage, setCurrentPage] = useState(currentPage);

  useEffect(() => {
    const currentPage: UniversalLessonPage = get(
      universalLessonDetails,
      `lessonPlan[${pageIdx}]`,
      null
    );
    setCurrentPage(currentPage);
  }, [pageIdx]);

  const onComponentCreateClick = () => {
    if (!isEmpty(selectedComponent)) {
      setAddContentModal({show: true, type: selectedType});

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
    handleEditBlockContent?.();

    // setActionMode('init');
  };
  // This function will select component position, for adding new component
  const onComponentSelect = (block = false) => {
    if ($currentPage && currentPage?.pageContent) {
      const pageContentIdx = findIndex(
        $currentPage?.pageContent,
        (d: any) => d.id === pageContentID
      );

      const pageContent = $currentPage?.pageContent?.[pageContentIdx];
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
        block: block,
        componentData: {
          type: contentType,
          class: classString,
          value: contentValue
        },
        isEmotionComponentSelected:
          contentType === GAME_CHANGERS && contentValue?.[0]?.value === 'emotion'
      };

      if (deleteMode) {
        let extras: any[] = selectedComponent?.extras || [];
        const exists = extras.findIndex(
          (p: any) =>
            p.pageContentID === pageContentID && p.partContentID === partContentID
        );
        if (exists === -1) {
          extras.push({
            pageContentIdx,
            partContentIdx,
            pageContentID,
            partContentID
          });
        } else {
          extras.splice(exists, 1);
        }
        setSelectedComponent({
          ...obj,
          extras,
          pageContentID: null,
          partContentID: null
        });
      } else {
        setSelectedComponent({...obj, extras: null});
      }

      if (actionMode === 'edit') {
        onEditClick();
      }
    }
  };

  useEffect(() => {
    if (navState === 'addContent' && actionMode !== 'replace') {
      if (!isEmpty(selectedComponent)) {
        onComponentCreateClick();
      }
    }
  }, [navState, selectedComponent, actionMode]);

  const currentComponentSelected =
    !selectedComponent?.block &&
    selectedComponent?.pageContentID === pageContentID &&
    selectedComponent?.partContentID === partContentID;

  const currentBlockSelected =
    selectedComponent?.block && selectedComponent?.pageContentID === pageContentID;

  const deleteModeCurrentComponentSelected = selectedComponent?.extras || [];

  return (
    <Fragment key={`${contentID}`}>
      {mode === 'building' ? (
        <div
          className={`
        relative  
        ${section === 'partContent' ? 'h-full' : 'h-auto'} 
        flex items-center rowWrapper
        ${isComponent ? '  pb-1' : ''}
        `}>
          {!deleteMode &&
            isComponent &&
            showingPin &&
            !(actionMode === 'edit' && contentType === SPACER) && (
              <div
                id="editControlsWrapper"
                style={{top: '10%', left: '-6%'}}
                className={`absolute ${
                  true ? 'active' : ''
                } flex flex-row items-center inset-y-0 bg-transparent rounded-lg h-auto w-auto justify-center`}>
                <button
                  title="Select this component"
                  onClick={() => onComponentSelect()}
                  className={`py-1 px-2 ${
                    currentComponentSelected ? '' : ''
                  } transition-all duration-300 cursor-pointer`}>
                  {currentComponentSelected ? (
                    <IoLocationSharp className="text-2xl text-light " />
                  ) : (
                    <div className="w-auto p-2 2xl:p-3 rounded-full border-2 border-green-300 bg-green-500 hover:bg-green-300 bg-opacity-50"></div>
                  )}
                </button>
              </div>
            )}
          {deleteMode &&
            isComponent &&
            showingPin &&
            !(actionMode === 'edit' && contentType === SPACER) && (
              <div
                id="editControlsWrapper"
                style={{top: '10%', left: '-6%'}}
                className={`absolute ${
                  true ? 'active' : ''
                } flex flex-row items-center inset-y-0 bg-transparent rounded-lg h-auto w-auto justify-center`}>
                <button
                  title="Select this component"
                  onClick={() => onComponentSelect()}
                  className={`py-1 px-2 ${
                    deleteModeCurrentComponentSelected.find(
                      (p: any) =>
                        p.pageContentID === pageContentID &&
                        p.partContentID === partContentID
                    )
                      ? ''
                      : ''
                  } transition-all duration-300 cursor-pointer`}>
                  {deleteModeCurrentComponentSelected.find(
                    (p: any) =>
                      p.pageContentID === pageContentID &&
                      p.partContentID === partContentID
                  ) ? (
                    <IoLocationSharp className="text-2xl text-light " />
                  ) : (
                    <div className="w-auto p-2 2xl:p-3 rounded-full border-2 border-green-300 bg-green-500 hover:bg-green-300 bg-opacity-50"></div>
                  )}
                </button>
              </div>
            )}
          {showingBlockPin &&
            !isComponent &&
            !(actionMode === 'edit' && contentType === SPACER) && (
              <div
                id="editControlsWrapper"
                style={{top: '10%', right: '-6%'}}
                className={`absolute ${
                  true ? 'active' : ''
                } flex flex-row items-center inset-y-0 bg-transparent rounded-lg h-auto w-auto justify-center`}>
                <button
                  title="Select this block"
                  onClick={() => onComponentSelect(true)}
                  className={`py-1 px-2 ${
                    currentBlockSelected ? '' : ''
                  } transition-all duration-300 cursor-pointer`}>
                  {currentBlockSelected ? (
                    <IoLocationSharp className="text-2xl text-light " />
                  ) : (
                    <div className="w-auto p-2 2xl:p-3 rounded-full border-2 border-green-300 bg-green-500 hover:bg-green-300 bg-opacity-50"></div>
                  )}
                </button>
              </div>
            )}

          <div className="w-full">{children}</div>
        </div>
      ) : (
        children
      )}
    </Fragment>
  );
};

export default EditOverlayBlock;
