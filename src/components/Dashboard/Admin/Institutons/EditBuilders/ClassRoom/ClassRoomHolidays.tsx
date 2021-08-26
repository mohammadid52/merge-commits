import React from 'react';
import {HiPencil} from 'react-icons/hi';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

import Loader from '../../../../../Atoms/Loader';
import {DeleteActionBtn} from '../../../../../Atoms/Buttons/DeleteActionBtn';
import AddButton from '../../../../../Atoms/Buttons/AddButton';
import Modal from '../../../../../Atoms/Modal';
import HolidayFormComponent from './HolidayFormComponent';
import { useState } from 'react';

const ClassRoomHolidays = () => {
  const [ formOpen, setFormOpen] = useState<boolean>(false);
  const loading = false;
  const holidayData = [
    {date: '2021-01-01', reason: 'New Year', duration: 1, adjustment: 'Push', id: 1},
    {
      date: '2021-12-25',
      reason: 'Christmas',
      duration: 0.25,
      adjustment: 'Compact',
      id: 2,
    },
  ];
  const handleOnDragEnd = () => {};
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-lg font-medium mb-4">Lesson Impact Logs</div>
        <AddButton
          className="ml-4 py-1 mb-2"
          label={'Add'}
          onClick={() => setFormOpen(true)}
        />
      </div>
      <div>
        <div className="w-full flex justify-between border-b-0 border-gray-200 mt-4">
          <div className="w-2/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Date
          </div>
          <div className="w-4/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Reason
          </div>
          <div className="w-2/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Time Impact
          </div>
          <div className="w-2/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Lesson Adjustment
          </div>
          <div className="w-2/10 flex justify-center px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Action
          </div>
        </div>
        <div className="mb-4 w-full m-auto max-h-88 overflow-y-auto">
          {holidayData.length ? (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="partContent">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {holidayData.map((item: any, idx: number) => {
                      return (
                        <Draggable
                          draggableId={`${item.id}`}
                          index={idx}
                          key={`${item.id}`}>
                          {(provided) => (
                            <div
                              key={`${idx}`}
                              className={`flex justify-between bg-white w-full border-b-0 border-gray-200 ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              <div className="w-2/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                                {new Date(item.date).toLocaleDateString()}
                              </div>
                              <div className="w-4/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                                {item.reason}
                              </div>
                              <div className="w-2/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                                {item.duration * 100}%
                              </div>
                              <div className="w-2/10 flex px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                                {item.adjustment}
                              </div>
                              <div className="w-2/10 flex px-4 py-3 flex justify-center">
                                <span
                                  className="w-auto"
                                  // onClick={() => lessonPagePreview(page.id)}
                                >
                                  <HiPencil className="w-4 h-4" />
                                </span>
                                <span
                                  className="w-auto"
                                  // onClick={() => toggleDeleteModal(true, page.id)}
                                >
                                  <DeleteActionBtn handleClick={() => console.log()} />
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center p-5">No records found</div>
          )}
        </div>
      </div>
      {formOpen && (
        <Modal
          showHeader={true}
          title={'Add holiday'}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={() => setFormOpen(false)}>
          <HolidayFormComponent />
        </Modal>
      )}
    </div>
  );
};

export default ClassRoomHolidays;
