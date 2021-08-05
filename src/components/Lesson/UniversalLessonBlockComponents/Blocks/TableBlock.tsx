import {map} from 'lodash';
import React from 'react';

const TableBlock = ({
  value: rowList,
  classString = 'green-400 || white || light',
}: {
  value: any;
  classString: string;
}) => {
  const tableBg = classString.split(' || ')[0];
  const tableText = classString.split(' || ')[1];
  const theme = classString.split(' || ')[2];

  const dark = theme === 'dark';

  const genThemeClass = (colIndex: number) =>
    dark
      ? `${colIndex % 2 !== 0 ? 'bg-gray-700' : 'bg-gray-800'}`
      : `${colIndex % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`;

  return (
    <div style={{maxWidth: '94rem'}}>
      <div className={`grid overflow-hidden rounded-lg  grid-cols-${rowList.length}`}>
        {map(rowList, (rowItem, rowIndex) => {
          return (
            <div>
              <h4
                className={`bg-${tableBg} text-${tableText} uppercase border-b-0 border-${tableBg} px-6 py-3 text-left text-xs font-medium  tracking-wider`}>
                {rowItem.value}
              </h4>
              {map(rowItem.options, (colItem, colIndex: number) => {
                return (
                  <div
                    className={`px-6 py-4 ${genThemeClass(
                      colIndex
                    )} whitespace-nowrap text-sm ${
                      dark ? 'text-white' : 'text-gray-600'
                    }`}>
                    {colItem.text || '--'}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableBlock;
