import React, {useState} from 'react';
import {HiPencil} from 'react-icons/hi';
import {useParams} from 'react-router';
import {API, graphqlOperation} from 'aws-amplify';

import * as mutation from 'graphql/mutations';

import AddButton from 'atoms/Buttons/AddButton';
import {DeleteActionBtn} from 'atoms/Buttons/DeleteActionBtn';
import Loader from 'atoms/Loader';
import Modal from 'atoms/Modal';

import ModalPopUp from 'molecules/ModalPopUp';
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import HolidayFormComponent from './HolidayFormComponent';

export interface IImpactLog {
  impactDate: Date;
  reasonComment: string;
  lessonImpact: number;
  adjustment: string;
}

interface IClassRoomHolidaysProps {
  lessonImpactLogs: IImpactLog[];
  logsLoading: boolean;
  setLessonImpactLogs: React.Dispatch<React.SetStateAction<IImpactLog[]>>;
  setLogsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  sortLogsByDate: (data: IImpactLog[], order?: string) => IImpactLog[] | [];
}

const ClassRoomHolidays = ({
  lessonImpactLogs,
  logsLoading,
  setLessonImpactLogs,
  setLogsChanged,
  sortLogsByDate
}: IClassRoomHolidaysProps) => {
  const {roomId}: any = useParams();

  const [dateOrder, setDateOrder] = useState('asc');
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: '',
    action: () => {}
  });

  const handleEdit = (index: number) => {
    setActiveIndex(index);
    setFormOpen(true);
  };

  const postMutation = (data: any) => {
    setLessonImpactLogs(sortLogsByDate(data));
    setActiveIndex(null);
    setFormOpen(false);
    setLogsChanged(true);
  };

  const closeDeleteModal = () => {
    setWarnModal((prevValues) => ({...prevValues, show: false}));
  };

  const onDelete = (index: number) => {
    const onDrop = async () => {
      setDeleting(true);
      // @ts-ignore
      const dateToUpdate = lessonImpactLogs.filter((i: number) => index !== i);
      const result: any = await API.graphql(
        graphqlOperation(mutation.updateRoom, {
          input: {
            id: roomId,
            lessonImpactLog: dateToUpdate
          }
        })
      );
      setLessonImpactLogs(sortLogsByDate(result?.data?.updateRoom.lessonImpactLog));
      setDeleting(false);
      setLogsChanged(true);
      closeDeleteModal();
    };
    setWarnModal({
      show: true,
      message: `Are you sure you want to remove this log?`,
      action: onDrop
    });
  };

  const handleCancel = () => {
    setFormOpen(false);
    if (activeIndex) {
      setActiveIndex(null);
    }
  };

  const handleDateOrderChange = () => {
    setDateOrder(dateOrder === 'desc' ? 'asc' : 'desc');
    setLessonImpactLogs(
      sortLogsByDate(lessonImpactLogs, dateOrder === 'desc' ? 'asc' : 'desc')
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-lg font-medium mb-4">Schedule Impact Log</div>
        <AddButton className="py-1" label={'Add'} onClick={() => setFormOpen(true)} />
      </div>
      <div>
        <div className="w-full flex justify-between border-b-0 border-gray-200 mt-4">
          <div
            className="w-2/10 flex px-4 py-3 items-center bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal"
            onClick={handleDateOrderChange}>
            Date
            <span className="inline-flex items-center ml-1 cursor-pointer">
              <span className={`w-auto ${dateOrder === 'desc' ? 'text-dark-gray' : ''}`}>
                <FaArrowDown className="w-2" />
              </span>
              <span className={`w-auto ${dateOrder === 'asc' ? 'text-dark-gray' : ''}`}>
                <FaArrowUp className="w-2" />
              </span>
            </span>
          </div>
          <div className="w-4/10 flex items-center px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Reason
          </div>
          <div className="w-2/10 flex items-center px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Time Impact
          </div>
          <div className="w-2/10 flex items-center px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Lesson Adjustment
          </div>
          <div className="w-2/10 flex items-center justify-center px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
            Action
          </div>
        </div>
        {logsLoading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full">
            <div className="items-center flex justify-center flex-col">
              <Loader color="rgba(160, 174, 192, 1)" />
              <p className="mt-2 text-center text-lg text-gray-500">Loading logs</p>
            </div>
          </div>
        ) : (
          <div className="mb-4 w-full m-auto max-h-48 overflow-y-auto">
            {lessonImpactLogs.length ? (
              // <DragDropContext onDragEnd={handleOnDragEnd}>
              //   <Droppable droppableId="partContent">
              //     {(provided) => (
              //       <div {...provided.droppableProps} ref={provided.innerRef}>
              lessonImpactLogs.map(
                (item: IImpactLog, idx: number) => {
                  return (
                    // <Draggable draggableId={`${idx}`} index={idx} key={`${idx}`}>
                    // {(provided) => (
                    <div
                      key={`${item.adjustment}`}
                      className={`flex justify-between bg-white w-full border-b-0 border-gray-200 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                      }`}
                      // ref={provided.innerRef}
                      // {...provided.draggableProps}
                      // {...provided.dragHandleProps}
                    >
                      <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {new Date(item.impactDate).toLocaleDateString()}
                      </div>
                      <div className="w-4/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {item.reasonComment || '-'}
                      </div>
                      <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {item.lessonImpact * 100}%
                      </div>
                      <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {item.adjustment || '-'}
                      </div>
                      <div className="w-2/10  px-4 py-3 flex justify-center">
                        <span
                          className="w-auto cursor-pointer"
                          onClick={() => handleEdit(idx)}>
                          <HiPencil className="w-4 h-4" />
                        </span>
                        <span
                          className="w-auto cursor-pointer"
                          onClick={() => onDelete(idx)}>
                          <DeleteActionBtn handleClick={() => console.log()} />
                        </span>
                      </div>
                    </div>
                  );
                }
                // </Draggable>
              )
            ) : (
              // })}
              // {provided.placeholder}
              // </div>
              // )}
              //   </Droppable>
              // </DragDropContext>
              <div className="text-center p-5">No records found</div>
            )}
          </div>
        )}
      </div>
      {warnModal.show && (
        <ModalPopUp
          closeAction={closeDeleteModal}
          saveAction={warnModal.action}
          saveLabel="Yes"
          message={warnModal.message}
          loading={deleting}
        />
      )}
      {formOpen && (
        <Modal
          showHeader={true}
          title={'Add holiday'}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={handleCancel}>
          <HolidayFormComponent
            activeIndex={activeIndex || 0}
            roomId={roomId}
            lessonImpactLogs={lessonImpactLogs}
            postMutation={postMutation}
            handleCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClassRoomHolidays;
