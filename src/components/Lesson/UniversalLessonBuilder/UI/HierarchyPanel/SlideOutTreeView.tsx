import React, {useEffect, useState} from 'react';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import {BsLayers, HiPencil, ImParagraphLeft, MdInput} from 'react-icons/all';
import {MdTitle} from 'react-icons/md';
import {IconContext} from 'react-icons';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';

interface SlideOutTreeViewProps {
  open?: boolean;
  toggleOpen?: (openOrClosed: boolean) => void;
  selectedPageDetails?: UniversalLessonPage;
  editMode?: boolean;
  setEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; content: any; editOnlyId: boolean}>
  >;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SlideOutTreeView = (props: SlideOutTreeViewProps) => {
  const {
    selectedPageDetails,

    setEditModal,
    setHierarchyVisible,
    setEditMode,
  } = props;
  const {selectedPageID, updateMovableList, theme, enableDnD} = useULBContext();

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

  const openModal = (content: any) => {
    setEditModal({show: true, content, editOnlyId: true});
    setHierarchyVisible(false);
    setEditMode(false);
  };

  const PagePartButtons = ({pagePartArr}: {pagePartArr: PagePart[]}) => {
    const handleOnDragEnd = (result: any, pageContentId: string, partContent: any) => {
      if (!result.destination) return;
      const items = Array.from(partContent);

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      updateMovableList(items, selectedPageID, pageContentId);
    };

    if (pagePartArr.length > 0) {
      return (
        <div>
          {pagePartArr.map((pagePart: PagePart, idx: number) => {
            const partContent = pagePart.partContent;
            return (
              <div key={`pagePart_tree_${idx}`} className="">
                <button
                  onClick={(e: any) => {
                    e.stopPropagation();

                    window.location.href = `#${pagePart.id}`;
                  }}
                  key={`hierarchy_parent_btn_${idx}`}
                  type="button"
                  className={`${theme.bg} text-white
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
                  <span
                    onClick={(e: any) => {
                      e.stopPropagation();
                      openModal({
                        pageContentId: pagePart.id,
                      });
                    }}
                    className="cursor-pointer w-6 h-6 flex items-center justify-center p-0.5">
                    {' '}
                    <HiPencil className="hover:text-indigo-400 text-white" size={18} />
                  </span>
                </button>

                <DragDropContext
                  onDragEnd={(result) =>
                    handleOnDragEnd(result, pagePart.id, partContent)
                  }>
                  <Droppable isDropDisabled={!enableDnD} droppableId="partContent">
                    {(provided) => {
                      return (
                        <ul
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className=""
                          id={`sub-menu-${idx}`}>
                          {partContent.length > 0 &&
                            partContent.map((partContent: PartContent, idx2: number) => (
                              <Draggable
                                isDragDisabled={!enableDnD}
                                draggableId={`pagePart_tree_${idx}_${idx2}`}
                                index={idx2}
                                key={`pagePart_tree_${idx}_${idx2}`}>
                                {(provided, snapshot) => {
                                  return (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => {
                                        window.location.href = `#${partContent.id}`;
                                      }}
                                      className={`${
                                        snapshot.isDragging ? 'bg-gray-900' : theme.bg
                                      }  group w-full flex items-center p-2 text-sm font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10  my-1`}>
                                      <div
                                        className={`ml-2 flex flex-row justify-start items-center `}>
                                        <IconContext.Provider
                                          value={{
                                            className: 'w-auto mr-2',
                                            size: '24px',
                                          }}>
                                          {getTreeIcon(partContent.type)}
                                        </IconContext.Provider>
                                        <span className={``}>{partContent.id}</span>
                                        <span
                                          onClick={(e: any) => {
                                            e.stopPropagation();
                                            openModal({
                                              partContentId: partContent.id,
                                              pageContentId: pagePart.id,
                                            });
                                          }}
                                          className="cursor-pointer w-6 h-6 flex items-center justify-center p-0.5">
                                          {' '}
                                          <HiPencil
                                            className="hover:text-indigo-400 text-white"
                                            size={18}
                                          />
                                        </span>
                                      </div>
                                    </li>
                                  );
                                }}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </ul>
                      );
                    }}
                  </Droppable>
                </DragDropContext>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <p>No page parts...</p>;
    }
  };

  return (
    <div
      className={` ${theme.bg} min-w-72 max-w-96 flex flex-col flex-grow p-1 overflow-y-auto shadow-lg rounded-b-md`}>
      <div className="flex-grow flex flex-col">
        <nav className="flex-1" aria-label="Sidebar">
          {selectedPageDetails && selectedPageDetails.pageContent && (
            <PagePartButtons pagePartArr={selectedPageDetails.pageContent} />
          )}
        </nav>
      </div>
    </div>
  );
};
