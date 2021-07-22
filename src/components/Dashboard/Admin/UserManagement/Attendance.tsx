import React, {useEffect, useState} from 'react';
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';
import API, {graphqlOperation} from '@aws-amplify/api';
import orderBy from 'lodash/orderBy';

import * as queries from '../../../../graphql/queries';

const Attendance = ({id}: any) => {
  const [AttendanceList, setAttendanceList] = useState<any>([]);
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

  const fetchAttendance = async () => {
    const list: any = await API.graphql(
      graphqlOperation(queries.listAttendances, {
        filter: {
          studentID: {eq: id},
        },
      })
    );
    setAttendanceList(list?.data.listAttendances?.items);
  };

  const handleOrderBy = (fieldName: string, order: boolean | 'desc' | 'asc') => {
    setSortConfig({
      fieldName,
      order,
    });
    setAttendanceList(orderBy(AttendanceList, [fieldName], [order]));
  };

  const withOrderBy = (columnName: string, fieldName: string) => {
    return (
      <span className="flex items-center">
        <span className="w-auto">{columnName}</span>
        <span className="inline-flex items-center ml-1 cursor-pointer">
          <span
            className={`w-2 h-2 ${
              fieldName === sortConfig.fieldName && sortConfig.order === 'desc'
                ? 'text-dark-gray'
                : ''
            }`}>
            <FaArrowDown />
          </span>
          <span
            className={`w-2 h-2 ${
              fieldName === sortConfig.fieldName && sortConfig.order === 'asc'
                ? 'text-dark-gray'
                : ''
            }`}>
            <FaArrowUp />
          </span>
        </span>
      </span>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className=" overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
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
                {AttendanceList.map((item: any, idx: number) => {
                  return (
                    <tr
                      key={`${item.class?.name}_${idx}`}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm font-medium text-gray-900">
                        {item.curriculum}
                      </td>
                      <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                        {'-'}
                      </td>
                      <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                        {'-'}
                      </td>
                      <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 w-auto whitespace-nowrap text-left text-sm text-gray-500">
                        {item?.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
