import React from 'react';
import {AiOutlineRight} from 'react-icons/ai';

import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import {
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';

interface ILessonPlanNavigationProps {
  selectedPageID: string;
  universalLessonDetails: UniversalLesson;
  setSelectedPageID?: React.Dispatch<React.SetStateAction<string>>;
}

const LessonPlanNavigation = ({selectedPageID,setSelectedPageID, universalLessonDetails}: ILessonPlanNavigationProps) => {
  const {lessonPlan = []} = universalLessonDetails || {};
  const {updateMovableList} = useULBContext();

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(lessonPlan);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateMovableList(items, 'page');
  };

  return (
    <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6 bg-gray-200">
      <div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="partContent" direction="horizontal">
            {(provided) => (
              <div
                className={`max-w-full h-12 bg-white flex overflow-x-auto`}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {lessonPlan.map((page: UniversalLessonPage, index: number) => (
                  <Draggable draggableId={`${page.id}`} index={index} key={`${page.id}`}>
                    {(provided) => (
                      <div
                        key={index}
                        className={`my-2 flex items-center justify-between cursor-pointer`}
                        onClick={() => setSelectedPageID(page.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <span
                          className={`inline-flex items-center justify-center font-bold ${
                            selectedPageID === page.id ? 'underline font-bold' : ''
                          }${
                            index == 0
                              ? ' text-blue-500'
                              : index === lessonPlan.length - 1
                              ? ' text-red-600'
                              : ''
                          }`}>
                          {page.label}
                        </span>
                        {index !== lessonPlan.length - 1 ? (
                          <span className="inline-flex items-center justify-end w-auto">
                            <AiOutlineRight size={25} className="w-auto" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default LessonPlanNavigation;
