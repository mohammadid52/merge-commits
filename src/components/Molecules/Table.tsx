import React from 'react';
import map from 'lodash/map';

const Table = ({
  dataList,
  headers,
}: {
  headers: string[];
  dataList: {[key: string]: any}[];
}) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-0 border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y-0 divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  {map(headers, (header) => (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? 'bg-transparent' : 'bg-transparent'}>
                    {map(headers, (header) => (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item[header.toLowerCase()]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;
