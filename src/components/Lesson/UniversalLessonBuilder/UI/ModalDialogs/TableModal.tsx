import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {v4 as uuidv4} from 'uuid';
import {filter, forEach, map, omit, remove, update} from 'lodash';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import Tabs, {useTabs} from '../UIComponents/Tabs';
import {TABLE} from '../common/constants';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import ColorPicker from '../ColorPicker/ColorPicker';
import Toggle from '../Toggle';

interface TableProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
  classString?: string;
}
const getColorDensity = (value: string | number) => `${(Number(value) * 10) / 100}%`;

const TableModal = (props: TableProps) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges,
    classString = 'green-400 || white || light',
  } = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);

  // set all values to local state
  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);

      const modifyRowList = map(inputObj, (row: any) => ({
        ...row,
        col: row.options,
      }));

      const tableBg = classString.split(' || ')[0];
      const tableText = classString.split(' || ')[1];
      const theme = classString.split(' || ')[2] || 'light';

      setColors({...colors, tableHeader: tableBg, tableText, dark: theme === 'dark'});

      setRowList([...modifyRowList]);
    }
  }, [inputObj]);

  // Tabs related stuff here
  const tabs = [
    {name: 'Component Details', current: true},
    {name: 'Preview', current: false},
  ];

  const {curTab, setCurTab} = useTabs(tabs);

  // table data related stuff here

  const listTitle = [
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), text: ''}],
    },
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), text: ''}],
    },
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), text: ''}],
    },
    {id: uuidv4().toString(), value: '', col: [{id: uuidv4().toString(), text: ''}]},
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
    update(rowList[rowIndex].col[colIndex], 'text', () => value);
    setRowList([...rowList]);
  };

  const getCols = (len: number) => {
    let empty = [];
    for (let i = 0; i < len; i++) {
      const item = {id: uuidv4().toString(), text: ''};
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
      row.col.push({id: uuidv4().toString(), text: ''});
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
      const lastColValue = row.col[colIndex].text;
      row.col.push({id: uuidv4().toString(), text: lastColValue});
    }
  };

  const deleteRow = () => {
    for (const row of rowList) {
      if (row.col.length === 1) return;
      row.col.pop();
    }
  };

  // All states here
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [rowList, setRowList] = useState(listTitle);
  const [colorPickerActiveBG, setColorPickerActiveBG] = useState<boolean>(false);
  const [colorPickerActiveText, setColorPickerActiveText] = useState<boolean>(false);
  const [colors, setColors] = useState({
    tableHeader: 'green-500',
    tableText: 'white',
    dark: false,
  });
  // Filter blank row headers for preview
  const filteredList = filter(rowList, (row: any) => row.value.length > 0);

  // common stuff for adding data to db
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };
  const dynamicClass = `${colors.tableHeader} || ${colors.tableText} || ${
    colors.dark ? 'dark' : 'light'
  }`;

  const onSubmit = async () => {
    const finalArray = map(rowList, (row: any) => ({
      ...row,
      options: [...row.col],
    }));

    const removeCol = map(finalArray, (row: any) => omit(row, ['col']));

    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        TABLE,
        removeCol,
        0,
        dynamicClass
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        TABLE,
        removeCol,
        0,
        dynamicClass
      );
      await addToDB(updatedList);
    }
  };

  // color picker function
  const handleColorPickerSelect = (pickedColor: string, type: string) => {
    setColors({
      ...colors,
      [type === 'bg' ? 'tableHeader' : 'tableText']: pickedColor,
    });
  };

  const tableBg = dynamicClass.split(' || ')[0];
  const tableText = dynamicClass.split(' || ')[1];

  const genThemeClass = (colIndex: number) =>
    colors.dark
      ? `${colIndex % 2 !== 0 ? 'bg-gray-700' : 'bg-gray-800'}`
      : `${colIndex % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}`;

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
                          value={colItem.text}
                          placeHolder={`Row ${colIndex + 1}`}
                        />
                        {rowIndex === rowList.length - 1 &&
                          colIndex === rowItem.col.length - 1 && (
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => duplicateRow(colIndex)}
                                className={`text-center focus:outline-none self-end mt-2 focus:bg-indigo-200 focus:border-transparent transition-all duration-200 hover:bg-indigo-200 text-xs font-semibold text-indigo-400 border-indigo-200 px-2 py-1 cursor-pointer rounded w-auto border-2 hover:text-indigo-600`}>
                                Duplicate this row
                              </button>
                              <button
                                onClick={() => deleteRow()}
                                className={`text-center focus:outline-none focus:bg-red-200 focus:border-transparent transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded w-auto mt-2 ml-2 border-2 hover:text-red-600`}>
                                Delete this row
                              </button>
                            </div>
                          )}
                      </>
                    );
                  })}
                </div>
              );
            })}
            <div className="flex col-span-3 items-center w-auto">
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

            <h3 className="col-span-4 text-base text-black font-medium">
              Customize Table
            </h3>
            <div className="col-span-1 relative h-full">
              <label
                htmlFor={'bgColor'}
                className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                Select table header background color
              </label>
              <button
                onClick={() => setColorPickerActiveBG(!colorPickerActiveBG)}
                className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
                <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                  {colors.tableHeader?.split('-')[0]}{' '}
                  {getColorDensity(colors.tableHeader?.split('-')[1])}
                </span>

                <span
                  className={`h-4 block w-4 bg-${colors.tableHeader} rounded-full border-3 border-gray-400`}></span>
              </button>
              {colorPickerActiveBG && (
                <ColorPicker
                  isMainPage
                  classString={classString}
                  callbackColor={(pickedColor) => {
                    setColorPickerActiveBG(false);
                    handleColorPickerSelect(pickedColor, 'bg');
                  }}
                  styleString={{top: '100%'}}
                />
              )}
            </div>
            <div className="col-span-1 relative h-full">
              <label
                htmlFor={'bgColor'}
                className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                Select table header text color
              </label>
              <button
                onClick={() => setColorPickerActiveText(!colorPickerActiveText)}
                className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
                <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                  {colors.tableText === 'white'
                    ? 'white'
                    : colors.tableText?.split('-')[0]}{' '}
                  {colors.tableText !== 'white' &&
                    getColorDensity(colors.tableText?.split('-')[1])}
                </span>

                <span
                  className={`h-4 block w-4 bg-${colors.tableText} rounded-full border-3 border-gray-400`}></span>
              </button>
              {colorPickerActiveText && (
                <ColorPicker
                  isMainPage
                  classString={classString}
                  callbackColor={(pickedColor) => {
                    setColorPickerActiveText(false);
                    handleColorPickerSelect(pickedColor, 'text');
                  }}
                  styleString={{top: '100%'}}
                />
              )}
            </div>
            <div className="col-span-1 relative h-full">
              <label
                htmlFor={'bgColor'}
                className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                Select table content theme
              </label>
              <div
                className={`mt-1 flex items-center justify-between w-full sm:text-sm sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm`}>
                <span className="w-auto">Theme: ({colors.dark ? 'dark' : 'light'})</span>
                <Toggle
                  enabled={colors.dark}
                  setEnabled={() => setColors({...colors, dark: !colors.dark})}
                />
              </div>
            </div>
          </div>

          <div className="flex mt-8 justify-end px-6 pl-0 pb-4">
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
                onClick={() => onSubmit()}
              />
            </div>
          </div>
        </div>
      )}
      {curTab === 'Preview' &&
        (filteredList.length > 0 ? (
          <div style={{maxWidth: '94rem'}}>
            <div
              className={`grid border-0 border-gray-300 rounded-lg  grid-cols-${filteredList.length}`}>
              {map(filteredList, (rowItem, rowIndex) => {
                return (
                  <div>
                    <h4
                      className={`bg-${tableBg} text-${tableText} uppercase border-b-0 border-${tableBg} px-6 py-3 text-left text-xs font-medium  tracking-wider`}>
                      {rowItem.value}
                    </h4>
                    {map(rowItem.col, (colItem, colIndex: number) => {
                      return (
                        <div
                          className={`px-6 py-4 ${genThemeClass(
                            colIndex
                          )} whitespace-nowrap text-sm ${
                            colors.dark ? 'text-white' : 'text-gray-600'
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
        ) : (
          <div className="bg-dark-gray h-12 rounded-lg flex items-center justify-center">
            <p className="text-center text-white text-lg">
              Please add data to table to see preview
            </p>
          </div>
        ))}
    </>
  );
};

export default TableModal;
