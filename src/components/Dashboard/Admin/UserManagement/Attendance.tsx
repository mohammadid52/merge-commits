import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import React, {forwardRef, useContext, useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import {IconContext} from 'react-icons';
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import {IoIosCalendar, IoMdArrowBack} from 'react-icons/io';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as customQueries from '../../../../customGraphql/customQueries';
import Buttons from '../../../Atoms/Buttons';
import Loader from '../../../Atoms/Loader';

const pad = (num: any) => {
  return `0${num}`.slice(-2);
};

const limit: number = 10;

interface IAttendanceProps {
  id: string;
  goToClassroom: () => void;
  selectedRoomId?: string;
  role: string;
}

const Attendance = ({id, goToClassroom, selectedRoomId, role}: IAttendanceProps) => {
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [date, setDate] = useState(null);
  const [sortConfig, setSortConfig] = useState<{
    fieldName: string;
    order: boolean | 'desc' | 'asc';
  }>({
    fieldName: '',
    order: false,
  });
  const [nextToken, setNextToken] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
  }, [id]);

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
        limit,
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
          eq: `${year}-${pad(monthNumber + 1)}-${pad(dayNumber)}`,
        };
      }
      const list: any = await API.graphql(
        graphqlOperation(customQueries.attendanceByStudent, payload)
      );
      const temp = list?.data.attendanceByStudent?.items.map((record: any) => ({
        ...record,
        lessonName: record.lesson?.title,
        curriculumName: record.curriculum?.name,
        roomName: record.room?.name,
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

  const handleOrderBy = (fieldName: string, order: boolean | 'desc' | 'asc') => {
    setSortConfig({
      fieldName,
      order,
    });
    setAttendanceList(orderBy(attendanceList, [fieldName], [order]));
  };

  const withOrderBy = (columnName: string, fieldName: string) => {
    return (
      <span className="flex items-center">
        <span className="w-auto">{columnName}</span>
        <span className="inline-flex items-center ml-1 cursor-pointer">
          <span
            className={`w-auto ${
              fieldName === sortConfig.fieldName && sortConfig.order === 'desc'
                ? 'text-dark-gray'
                : ''
            }`}>
            <FaArrowDown className="w-2" />
          </span>
          <span
            className={`w-auto ${
              fieldName === sortConfig.fieldName && sortConfig.order === 'asc'
                ? 'text-dark-gray'
                : ''
            }`}>
            <FaArrowUp className="w-2" />
          </span>
        </span>
      </span>
    );
  };

  const DateCustomInput = forwardRef(({value, onClick, ...rest}: any, ref: any) => (
    <div
      className={`flex w-auto py-3 px-4 rounded  ${theme.formSelect} ${theme.outlineNone}`}
      onClick={onClick}>
      <span className="w-6 mr-4 cursor-pointer">
        <IconContext.Provider
          value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
          <IoIosCalendar />
        </IconContext.Provider>
      </span>
      <input
        placeholder={'Search by date...'}
        id="searchInput"
        className={`${theme.outlineNone}`}
        value={value}
        {...rest}
      />
    </div>
  ));

  return (
    <div className="">
      <div
        className={`flex ${
          role === 'ST' ? 'justify-between' : 'justify-end'
        } items-center mb-4`}>
        {role === 'ST' && (
          <div
            className="text-indigo-400 flex cursor-pointer w-auto"
            onClick={goToClassroom}>
            <span className="w-auto inline-flex items-center mr-2">
              <IoMdArrowBack className="w-4 h-4" />
            </span>
            <span>Back to course list</span>
          </div>
        )}
        <div className="w-64 relative ulb-datepicker">
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
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        handleOrderBy(
                          'roomName',
                          sortConfig.fieldName === 'roomName'
                            ? sortConfig.order === 'desc'
                              ? 'asc'
                              : 'desc'
                            : 'desc'
                        )
                      }>
                      {withOrderBy('ClassName', 'roomName')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        handleOrderBy(
                          'curriculumName',
                          sortConfig.fieldName === 'curriculumName'
                            ? sortConfig.order === 'desc'
                              ? 'asc'
                              : 'desc'
                            : 'desc'
                        )
                      }>
                      {withOrderBy('Curriculum', 'curriculumName')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        handleOrderBy(
                          'lessonName',
                          sortConfig.fieldName === 'lessonName'
                            ? sortConfig.order === 'desc'
                              ? 'asc'
                              : 'desc'
                            : 'desc'
                        )
                      }>
                      {withOrderBy('Lesson', 'lessonName')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && !attendanceList.length ? (
                    <tr>
                      <td colSpan={5} className="py-4">
                        <Loader />
                      </td>
                    </tr>
                  ) : attendanceList.length ? (
                    attendanceList.map((item: any, idx: number) => {
                      return (
                        <tr
                          key={`${item.class?.name}_${idx}`}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm font-bold text-gray-600">
                            {item.roomName || '-'}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {item.curriculumName || '-'}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {item.lessonName || '-'}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {moment(item?.time, 'HH:mm:ss').format('hh:mm A')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-dark-gray text-center">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {nextToken ? (
                <div className="flex justify-center w-full">
                  <Buttons
                    label={loading ? 'loading' : 'Load more'}
                    btnClass="text-center my-2"
                    disabled={loading}
                    onClick={onLoadMore}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
