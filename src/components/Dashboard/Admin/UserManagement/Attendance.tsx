import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment';
import {useEffect, useState} from 'react';

import {IoMdArrowBack} from 'react-icons/io';

import * as customQueries from 'customGraphql/customQueries';

import Buttons from 'atoms/Buttons';

import Table, {ITableProps} from '@components/Molecules/Table';
import type {DatePickerProps} from 'antd';
import {DatePicker} from 'antd';
import {map} from 'lodash';

const limit: number = 500;

interface IAttendanceProps {
  id: string;
  goToClassroom: () => void;
  selectedRoomId?: string;
  role: string;
}

const Attendance = ({id, goToClassroom, selectedRoomId, role}: IAttendanceProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [date, setDate] = useState<any>(null);

  const [nextToken, setNextToken] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
  }, [id]);

  const dataList = map(attendanceList, (item, idx) => ({
    no: idx + 1,
    onClick: () => {},
    classname: item.roomName,
    curriculum: item.curriculumName,
    lesson: item.lessonName,
    date: new Date(item.date).toLocaleDateString(),
    type: item.lessonType,
    time: moment(item?.time, 'HH:mm:ss').format('hh:mm A')
  }));

  const tableConfig: ITableProps = {
    headers: ['No', 'ClassName', 'Curriculum', 'Lesson', 'Type', 'Date', 'Time'],
    dataList,
    config: {
      dataList: {
        loading
      }
    }
  };

  const fetchAttendance = async (date?: string, fetchNewRecords: boolean = false) => {
    try {
      setLoading(true);
      let payload: any = {
        studentID: id,
        sortDirection: 'DESC',
        date,
        limit
      };
      if (nextToken) {
        payload.nextToken = nextToken;
      }
      if (selectedRoomId) {
        payload.filter = {roomID: {eq: selectedRoomId}};
      }
      if (date) {
        payload.date = {
          eq: date
        };
      }

      const list: any = await API.graphql(
        graphqlOperation(customQueries.attendanceByStudent, payload)
      );
      const temp = list?.data.attendanceByStudent?.items.map((record: any) => ({
        ...record,
        lessonName: record.lesson?.title,
        lessonType: record.lesson?.type,
        curriculumName: record.curriculum?.name,
        roomName: record.room?.name
      }));
      if (fetchNewRecords) {
        setAttendanceList(temp);
      } else {
        setAttendanceList((prevAttendance: any) => [...prevAttendance, ...temp]);
      }
      setNextToken(list?.data.attendanceByStudent?.nextToken);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  //

  const onLoadMore = () => {
    fetchAttendance(date);
  };

  const handleDateChange: DatePickerProps['onChange'] = (_, dateString) => {
    if (!dateString) fetchAttendance();
    else {
      setDate(dateString);
      fetchAttendance(dateString, true);
    }
  };

  return (
    <div className="">
      <div
        className={`flex ${
          role === 'ST' ? 'justify-between' : 'justify-end'
        } items-center mb-4`}>
        {role === 'ST' && (
          <div
            className="theme-text hover:underline hover:theme-text:500 flex cursor-pointer w-auto"
            onClick={goToClassroom}>
            <span className="w-auto inline-flex items-center mr-2">
              <IoMdArrowBack className="w-4 h-4" />
            </span>
            <span>Back to course list</span>
          </div>
        )}

        <DatePicker
          placeholder="Search by date"
          onChange={handleDateChange}
          placement="bottomRight"
        />
      </div>

      <Table {...tableConfig} />
      {nextToken ? (
        <div className="flex justify-center w-full">
          <Buttons
            label={loading ? 'loading' : 'Load more'}
            disabled={loading}
            onClick={onLoadMore}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Attendance;
