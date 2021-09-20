import React from 'react';
import map from 'lodash/map';
import camelCase from 'lodash/camelCase';
import '../../style/atoms/_table.scss';

const Table = ({
  dataList,
  headers,
  config = {dark: true},
}: {
  config?: {
    dark?: boolean;
    headers?: {textColor?: string; bgColor?: string};
    dataList?: {
      textColor?: string;
      bgColor?: string;
      pattern?: string;
      patternConfig?: {firstColor?: string; secondColor?: string};
    };
  };
  headers: string[];
  dataList: {[key: string]: any}[];
}) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full">
          <div
            className={`shadow overflow-hidden border-0 ${
              config?.dark ? 'border-gray-700' : 'border-gray-200'
            } sm:rounded-lg`}>
            <table className="min-w-full divide-y-0 divide-gray-700">
              <thead
                className={`${
                  config?.headers?.bgColor || 'iconoclast:bg-main curate:bg-main'
                } `}>
                <tr>
                  {map(headers, (header) => (
                    <th
                      key={header}
                      scope="col"
                      className={`${
                        config?.headers?.textColor || 'text-gray-500'
                      } px-6 py-3  text-left text-xs font-medium  uppercase tracking-wider`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="max-h-88 overflow-y-auto dark-scroll">
                {dataList.map((item, idx) => (
                  <tr
                    key={idx}
                    className={` ${
                      config?.dataList?.bgColor
                        ? config?.dataList?.bgColor
                        : config?.dataList?.pattern === 'striped'
                        ? idx % 2 === 0
                          ? `${config?.dataList?.patternConfig.firstColor}`
                          : `${config?.dataList?.patternConfig.secondColor}`
                        : 'bg-transparent'
                    }`}>
                    {map(headers, (header) => (
                      <td
                        key={item.id + '-' + header}
                        className={`${
                          config?.dataList?.textColor || 'text-gray-500'
                        } px-6 py-4  whitespace-nowrap text-sm`}>
                        {item[camelCase(header.toLowerCase())]}
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
