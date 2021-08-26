import React from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import GroupCard from './GroupCards';

const SubjectProficiency = () => {
  const handleOnDragEnd = () => {
    console.log('handleOnDragEnd');
  };
  return (
    <div>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <div className="w-full flex justify-between mt-4">
            <div className="grid px-2 xl:px-6 gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
              {[
                {name: 'Group 1', students: [{name: 'Alex'}, {name: 'Sam'}]},
                {name: 'Group 2', students: [{name: 'Max'}, {name: 'Dan'}]},
              ].map((group) => (
                <GroupCard group={group} />
              ))}
            </div>
          </div>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="partContent">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <div className="col-span-2">
                  {[{name: 'Student1'}, {name: 'Student2'}].map(
                    (student: any, idx: number) => {
                      return (
                        <Draggable draggableId={`${idx}`} index={idx} key={`${idx}`}>
                          {(provided) => (
                            <div
                              key={`${idx}`}
                              className={`flex justify-between bg-white w-full border-b-0 border-gray-200 ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              {student.name}
                            </div>
                          )}
                        </Draggable>
                      );
                    }
                  )}
                </div>
                {/* {provided.placeholder} */}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default SubjectProficiency;