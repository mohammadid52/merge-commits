import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment';
import {forwardRef, useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import {IoIosCalendar, IoMdArrowBack} from 'react-icons/io';

import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';

import Buttons from 'atoms/Buttons';

import Table, {ITableProps} from '@components/Molecules/Table';
import {map} from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';

const pad = (num: any) => {
  return `0${num}`.slice(-2);
};

const DateCustomInput = forwardRef(({value, onClick, ...rest}: any) => {
  const {theme} = useGlobalContext();
  return (
    <div
      className={`flex w-auto py-2 px-4 focus:theme-border:500 transition-all rounded-full  ${theme.formSelect} ${theme.outlineNone}`}
      onClick={onClick}>
      <span className="w-6 mr-4 cursor-pointer">
        <IoIosCalendar className="theme-text" size="1.5rem" />
      </span>
      <input
        placeholder={'Search by date...'}
        id="searchInput"
        className={`text-sm ${theme.outlineNone}`}
        value={value}
        {...rest}
      />
    </div>
  );
});

const limit: number = 10;

interface IAttendanceProps {
  id: string;
  goToClassroom: () => void;
  selectedRoomId?: string;
  role: string;
}

const Attendance = ({id, goToClassroom, selectedRoomId, role}: IAttendanceProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [date, setDate] = useState<null | Date>(null);

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

  const fetchAttendance = async (
    date?: Date | null,
    fetchNewRecords: boolean = false
  ) => {
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
        const dayNumber = date.getDate();
        const monthNumber = date.getMonth();
        const year = date.getFullYear();

        payload.date = {
          eq: `${year}-${pad(monthNumber + 1)}-${pad(dayNumber)}`
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

  const onLoadMore = () => {
    fetchAttendance(date);
  };

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    fetchAttendance(date, true);
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
        <div className="w-56 relative ulb-datepicker">
          <DatePicker
            dateFormat={'dd/MM/yyyy'}
            selected={date}
            placeholderText={'Search by date'}
            onChange={handleDateChange}
            customInput={<DateCustomInput />}
            isClearable={true}
          />
        </div>
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
