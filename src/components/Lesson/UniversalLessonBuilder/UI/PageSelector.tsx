import React, {useState} from 'react';
import {
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {VscFileMedia, VscNewFile} from 'react-icons/vsc';
import Buttons from '../../../Atoms/Buttons';
import {IconContext} from 'react-icons';
import PageTile from './common/PageTile';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {HiPencil} from 'react-icons/hi';
import {AiOutlineDelete} from 'react-icons/ai';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

interface PageSelectorProps extends ULBSelectionProps {
  universalLessonDetails: UniversalLesson;
  universalBuilderDict: any;
  userLanguage: any;
  galleryVisible: boolean;
  loading: boolean;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  hideAllModals?: () => void;
  setEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; content: any; editOnlyId: boolean}>
  >;
}

const PageSelector = (props: PageSelectorProps) => {
  const {
    universalLessonDetails,
    setSelectedPageID,
    deleteFromULBHandler,
    handleModalPopToggle,
    setEditModal,
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

  const DroppablePages = () => {
    const [movablePagesList, setMovablePagesList] = useState(pages);
    const handleOnDragEnd = (result: any) => {
      if (!result.destination) return;
      const items = Array.from(movablePagesList);

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setMovablePagesList(items);
    };
    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="partContent" direction="horizontal">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex w-auto items-center">
              {movablePagesList.map((page: UniversalLessonPage, idx: number) => (
                <Draggable draggableId={page.id} index={idx} key={page.id}>
                  {(provided) => (
                    <li
                      key={`pageSelector_${idx}`}
                      id={`pageThumb_${page.id}`}
                      onClick={() => handleSelectPage(page.id)}
                      className={`${
                        selectedPageID === page.id ? 'bg-gray-300' : ''
                      } w-auto ml-4 flex flex-col cursor-pointer border-0 hover:bg-gray-300 p-2 px-6 rounded-md transition-all duration-300`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <PageTile />
                      <p className={`text-center text-sm text-gray-600`}>{page.id}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => deleteFromULBHandler(page.id)}
                          className={`mr-1 text-center border-red-200 border-3 hover:bg-red-200  text-xs font-semibold  p-1 cursor-pointer rounded mt-2`}>
                          <AiOutlineDelete
                            className="hover:text-red-600 text-red-400"
                            size={18}
                          />
                        </button>
                        <button
                          onClick={(e: any) => {
                            e.stopPropagation();
                            setEditModal({
                              show: true,
                              content: {
                                id: page.id,
                                title: page.title,
                                description: page.description,
                                label: page.label,
                              },
                              editOnlyId: false,
                            });
                          }}
                          className={`text-center text-xs font-semibold border-indigo-200  border-3 hover:bg-indigo-200 p-1 cursor-pointer rounded mt-2`}>
                          <HiPencil
                            className="hover:text-indigo-400 text-indigo-400"
                            size={18}
                          />
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
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

          <div className="py-4 flex  justify-between bg-gray-200">
            <div className="py-4 flex  w-auto bg-gray-200">
              {pages && pages.length > 0 && <DroppablePages />}
            </div>
            <Buttons
              onClick={() => handleModalPopToggle('NEW_PAGE')}
              Icon={VscNewFile}
              label="New Page"
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            />

            {/*<PageGalleryControls handleModalPopToggle={handleModalPopToggle}/>*/}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSelector;
