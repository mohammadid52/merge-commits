import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {v4 as uuidv4} from 'uuid';
import {filter, forEach, map, remove, update} from 'lodash';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import Tabs, {useTabs} from '../UIComponents/Tabs';

interface TableProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const TableModal = (props: TableProps) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges,
  } = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const tabs = [
    {name: 'Component Details', current: true},
    {name: 'Preview', current: false},
  ];

  const {curTab, setCurTab} = useTabs(tabs);

  const listTitle = [
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), value: ''}],
    },
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), value: ''}],
    },
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), value: ''}],
    },
    {id: uuidv4().toString(), value: '', col: [{id: uuidv4().toString(), value: ''}]},
  ];

  const onRowChange = (e: any, rowIndex: number) => {
    setUnsavedChanges(true);
    const {value} = e.target;
    update(rowList[rowIndex], 'value', () => value);
    setRowList([...rowList]);
  };

  const onColChange = (e: any, rowIndex: number, colIndex: number) => {
    setUnsavedChanges(true);
    const {value} = e.target;
    update(rowList[rowIndex].col[colIndex], 'value', () => value);
    setRowList([...rowList]);
  };

  const getCols = (len: number) => {
    let empty = [];
    for (let i = 0; i < len; i++) {
      const item = {id: uuidv4().toString(), value: ''};
      empty.push(item);
    }
    return empty;
  };

  const addRow = () => {
    setUnsavedChanges(true);

    rowList.push({
      id: uuidv4().toString(),
      value: '',
      col: getCols(rowList[0].col.length),
    });

    setRowList([...rowList]);
  };

  const addCol = () => {
    for (const row of rowList) {
      row.col.push({id: uuidv4().toString(), value: ''});
    }
  };

  const deleteCol = (id: string) => {
    if (rowList.length === 12 || rowList.length === 2) return;
    else {
      remove(rowList, (n: any) => n.id === id);
      setRowList([...rowList]);
    }
  };

  const duplicateRow = (colIndex: number) => {
    for (const row of rowList) {
      const lastColValue = row.col[colIndex].value;
      row.col.push({id: uuidv4().toString(), value: lastColValue});
    }
  };

  const [rowList, setRowList] = useState(listTitle);

  // Filter blank row headers for preview
  const filteredList = filter(rowList, (row: any) => row.value.length > 0);

  return (
    <>
      <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} />
      {curTab === 'Component Details' && (
        <div style={{maxWidth: '94rem'}}>
          <div
            className={`grid gap-4 table-container gap-y-6 grid-cols-${rowList.length}`}>
            {map(rowList, (rowItem, rowIndex) => {
              return (
                <div className="flex item-center flex-col">
                  <button
                    onClick={() => deleteCol(rowItem.id)}
                    className={`text-center focus:outline-none focus:bg-red-200 focus:border-transparent transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded w-auto mb-1 border-2 hover:text-red-600`}>
                    Delete this column
                  </button>
                  <FormInput
                    onChange={(e) => onRowChange(e, rowIndex)}
                    id={rowItem.id}
                    value={rowItem.value}
                    placeHolder={`Col header ${rowIndex + 1}`}
                    className="mb-2 rows-input"
                  />
                  {map(rowItem.col, (colItem, colIndex: number) => {
                    return (
                      <>
                        <FormInput
                          onChange={(e) => onColChange(e, rowIndex, colIndex)}
                          id={colItem.id}
                          className="mb-2 cols-input"
                          value={colItem.value}
                          placeHolder={`Row ${colIndex + 1}`}
                        />
                        {rowIndex === rowList.length - 1 &&
                          colIndex === rowItem.col.length - 1 && (
                            <button
                              onClick={() => duplicateRow(colIndex)}
                              className={`text-center focus:outline-none self-end mt-2 focus:bg-indigo-200 focus:border-transparent transition-all duration-200 hover:bg-indigo-200 text-xs font-semibold text-indigo-400 border-indigo-200 px-2 py-1 cursor-pointer rounded w-auto mb-1 border-2 hover:text-indigo-600`}>
                              Duplicate this row
                            </button>
                          )}
                      </>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="flex mt-8 justify-between px-6 pl-0 pb-4">
            <div className="flex items-center w-auto">
              <Buttons
                btnClass="py-1 px-4 text-xs mr-2 customBtn row"
                label="Add row"
                disabled={rowList.length === 12}
                onClick={addRow}
              />
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2 customBtn col"
                label="Add col"
                onClick={addCol}
              />
            </div>
            <div className="flex items-center w-auto">
              <Buttons
                btnClass="py-1 px-4 text-xs mr-2"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                onClick={askBeforeClose}
                transparent
              />
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      )}
      {curTab === 'Preview' && (
        <div style={{maxWidth: '94rem'}}>
          <div
            className={`grid border-0 border-gray-300 rounded-lg  grid-cols-${filteredList.length}`}>
            {map(filteredList, (rowItem, rowIndex) => {
              return (
                <div>
                  <h4
                    className={`bg-gray-200 uppercase border-b-0 border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider`}>
                    {rowItem.value}
                  </h4>
                  {map(rowItem.col, (colItem, colIndex: number) => {
                    return (
                      <div
                        style={{backgroundColor: colIndex % 2 !== 0 ? '#F9FAFB' : '#fff'}}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600`}>
                        {colItem.value || '--'}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TableModal;
