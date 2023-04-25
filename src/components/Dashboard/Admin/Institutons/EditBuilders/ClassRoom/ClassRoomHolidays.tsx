import {API, graphqlOperation} from 'aws-amplify';
import React, {useState} from 'react';
import {HiPencil} from 'react-icons/hi';
import {useParams} from 'react-router';

import {updateRoom} from 'graphql/mutations';

import AddButton from 'atoms/Buttons/AddButton';
import {DeleteActionBtn} from 'atoms/Buttons/DeleteActionBtn';
import Modal from 'atoms/Modal';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import TableComponent, {ITableProps} from '@components/Molecules/Table';
import ModalPopUp from 'molecules/ModalPopUp';
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
        graphqlOperation(updateRoom, {
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

  // const handleDateOrderChange = () => {
  //   setDateOrder(dateOrder === 'desc' ? 'asc' : 'desc');
  //   setLessonImpactLogs(
  //     sortLogsByDate(lessonImpactLogs, dateOrder === 'desc' ? 'asc' : 'desc')
  //   );
  // };

  const tableConfig: ITableProps = {
    headers: ['Date', 'Reason', 'Time Impact', 'Lesson Adjustment', 'Action'],
    dataList: lessonImpactLogs.map((log: IImpactLog, index: number) => ({
      onClick: () => {},
      date: new Date(log.impactDate).toLocaleDateString(),
      reason: log.reasonComment,
      timeImpact: <>{log.lessonImpact * 100}%</>,
      lessonAdjustment: log.adjustment || '--',
      action: (
        <div className="w-2/10  px-4 py-3 flex justify-center">
          <span className="w-auto cursor-pointer" onClick={() => handleEdit(index)}>
            <HiPencil className="w-4 h-4" />
          </span>
          <span className="w-auto cursor-pointer" onClick={() => onDelete(index)}>
            <DeleteActionBtn handleClick={() => {}} />
          </span>
        </div>
      )
    })),
    config: {
      dataList: {loading: logsLoading}
    }
  };

  return (
    <div>
      <SectionTitleV3
        title={'Schedule Impact Log'}
        withButton={
          <AddButton
            className="py-1"
            label={'Add'}
            onClick={() => {
              setFormOpen(true);
              setActiveIndex(null);
            }}
          />
        }
      />

      <TableComponent {...tableConfig} />

      <ModalPopUp
        open={warnModal.show}
        closeAction={closeDeleteModal}
        saveAction={warnModal.action}
        saveLabel="Yes"
        message={warnModal.message}
        loading={deleting}
      />

      <Modal
        open={formOpen}
        showHeader={true}
        title={'Add holiday'}
        showHeaderBorder={true}
        showFooter={false}
        closeAction={handleCancel}>
        <HolidayFormComponent
          activeIndex={activeIndex}
          roomId={roomId}
          lessonImpactLogs={lessonImpactLogs}
          postMutation={postMutation}
          handleCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default ClassRoomHolidays;
