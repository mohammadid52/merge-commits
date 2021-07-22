import React, {useEffect, useState} from 'react';
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import API, {graphqlOperation} from '@aws-amplify/api';
import orderBy from 'lodash/orderBy';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import * as queries from '../../../../graphql/queries';

import Loader from '../../../Atoms/Loader';

const pad = (num: any) => {
  return `0${num}`.slice(-2);
};

const Attendance = ({id}: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [focused, setFocused] = useState(false);
  const [date, setDate] = useState(null);
  const [sortConfig, setSortConfig] = useState<{
    fieldName: string;
    order: boolean | 'desc' | 'asc';
  }>({
    fieldName: '',
    order: false,
  });

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
  }, [id]);

  const fetchAttendance = async (date?: Date | null) => {
    try {
      setLoading(true);
      let payload: any = {
        studentID: id,
        sortDirection: 'ASC',
        date
      };
      if (date) {
        const dayNumber = date.getDate();
        const monthNumber = date.getMonth();
        const year = date.getFullYear();
        
        payload.date = {
          eq: `${year}-${pad(monthNumber + 1)}-${pad(dayNumber)}`,
        };
      }
      const list: any = await API.graphql(
        graphqlOperation(queries.attendanceByStudent, payload)
      );
      setAttendanceList(list?.data.attendanceByStudent?.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    fetchAttendance(date);
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

  return (
    <div className="">
      <div className="flex justify-end mb-2">
        <div className="w-64 relative">
          <DatePicker
            dateFormat={'dd/MM/yyyy'}
            selected={date}
            placeholderText={'Search by date'}
            onChange={handleDateChange}
            className="text-dark-gray"
            isClearable={true}
          />

          {/* <SingleDatePicker
                  date={date}
                  displayFormat={'DD/MM/YYYY'}
                  focused={focused}
                  id={id}
                  readOnly={true}
                  // isOutsideRange={(day) => !isInclusivelyAfterDay(day, new Date())}
                  numberOfMonths={1}
                  onDateChange={(date) => console.log(date, 'date')}
                  onFocusChange={({focused}) => setFocused(focused)}
                /> */}
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
                          'curriculum',
                          sortConfig.fieldName === 'curriculum'
                            ? sortConfig.order === 'desc'
                              ? 'asc'
                              : 'desc'
                            : 'desc'
                        )
                      }>
                      {withOrderBy('Curriculum', 'curriculum')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        handleOrderBy(
                          'syllabus',
                          sortConfig.fieldName === 'syllabus'
                            ? sortConfig.order === 'desc'
                              ? 'asc'
                              : 'desc'
                            : 'desc'
                        )
                      }>
                      {withOrderBy('Syllabus', 'syllabus')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      onClick={() =>
                        handleOrderBy(
                          'lesson',
                          sortConfig.fieldName === 'lesson'
                            ? sortConfig.order === 'desc'
                              ? 'asc'
                              : 'desc'
                            : 'desc'
                        )
                      }>
                      {withOrderBy('Lesson', 'lesson')}
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
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-4">
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    attendanceList.map((item: any, idx: number) => {
                      return (
                        <tr
                          key={`${item.class?.name}_${idx}`}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm font-medium text-gray-900">
                            {item.curriculum?.name || '-'}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {item.syllabus?.name || '-'}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {item.lesson?.title || '-'}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                            {moment(item?.time, 'HH:mm:ss').format("hh:mm A")}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
