import {filter, map, omit, remove, update} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import ColorPicker from '../ColorPicker/ColorPicker';
import {TABLE} from '../common/constants';
import Toggle from '../Toggle';
import AnimatedContainer from '../UIComponents/Tabs/AnimatedContainer';
import {Tabs3, useTabs} from '../UIComponents/Tabs/Tabs';
import {HiOutlineTrash} from 'react-icons/hi';
import {getMaxWordLenOfHeader} from '@components/Lesson/UniversalLessonBlockComponents/Blocks/TableBlock';

const onDark = (colIndex: number) => (colIndex % 2 !== 0 ? 'bg-gray-700' : 'bg-gray-800');
const onLight = (colIndex: number) => (colIndex % 2 !== 0 ? 'bg-white' : 'bg-gray-100');

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
    classString = 'green-400 || white || light'
  } = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);

  // set all values to local state
  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);

      const modifyRowList = map(inputObj, (row: any) => ({
        ...row,
        col: row.options
      }));

      const tableBg = classString.split(' || ')[0];
      const tableText = classString.split(' || ')[1];
      const theme = classString.split(' || ')[2] || 'light';

      setColors({...colors, tableHeader: tableBg, tableText, dark: theme === 'dark'});

      setRowList([...modifyRowList]);
    }
  }, [inputObj]);

  // table data related stuff here

  const listTitle = [
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), text: ''}]
    },
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), text: ''}]
    },
    {
      id: uuidv4().toString(),
      value: '',
      col: [{id: uuidv4().toString(), text: ''}]
    },
    {id: uuidv4().toString(), value: '', col: [{id: uuidv4().toString(), text: ''}]}
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
      col: getCols(rowList[0].col.length)
    });

    setRowList([...rowList]);
  };

  const addCol = () => {
    let copy = [...rowList];
    for (const row of copy) {
      const newCol = {id: uuidv4().toString(), text: ''};
      row.col.push(newCol);
    }

    setRowList([...copy]);
  };

  const deleteCol = (id: string) => {
    if (rowList.length <= 2) return;
    else {
      let copy = [...rowList];
      remove(copy, (n: any) => n.id === id);
      setRowList([...copy]);
    }
  };

  const duplicateRow = (colIndex: number) => {
    let copy = [...rowList];
    for (const row of copy) {
      const lastColValue = row.col[colIndex].text;
      row.col.push({id: uuidv4().toString(), text: lastColValue});
    }
    setRowList([...copy]);
  };

  const deleteRow = () => {
    let copy = [...rowList];
    for (const row of copy) {
      if (row.col.length === 1) return;
      row.col.pop();
    }
    setRowList([...copy]);
  };

  // All states here
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [rowList, setRowList] = useState(listTitle);
  const [colorPickerActiveBG, setColorPickerActiveBG] = useState<boolean>(false);
  const [colorPickerActiveText, setColorPickerActiveText] = useState<boolean>(false);
  const [colors, setColors] = useState({
    tableHeader: 'green-500',
    tableText: 'white',
    dark: false
  });
  // Filter blank row headers for preview
  const filteredList = filter(rowList, (row: any) => row.value.length > 0);

  // common stuff for adding data to db
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };
    await updateLessonPageToDB(input);
  };
  const dynamicClass = `${colors.tableHeader} || ${colors.tableText} || ${
    colors.dark ? 'dark' : 'light'
  }`;

  const onSubmit = async () => {
    const finalArray = map(rowList, (row: any) => ({
      ...row,
      options: [...row.col]
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
      [type === 'bg' ? 'tableHeader' : 'tableText']: pickedColor
    });
  };

  const tableBg = dynamicClass.split(' || ')[0];
  const tableText = dynamicClass.split(' || ')[1];

  const genThemeClass = (colIndex: number) =>
    colors.dark ? onDark(colIndex) : onLight(colIndex);

  const {curTab, setCurTab, helpers} = useTabs();
  const [onSetupTab, onPreviewTab] = helpers;

  const getLastLen = () => {
    const lastRowIdx = rowList.length - 1;
    const lastColIdx = rowList[lastRowIdx].col.length - 1;

    return lastColIdx;
  };

  return (
    <>
      <Tabs3 curTab={curTab} setCurTab={setCurTab} />
      <AnimatedContainer show={onSetupTab}>
        {onSetupTab && (
          <div style={{maxWidth: '94rem'}}>
            <div
              className={`grid gap-4 table-container gap-y-6 grid-cols-${rowList.length}`}>
              {map(rowList, (rowItem, rowIndex) => {
                return (
                  <div className="flex item-center flex-col">
                    <Buttons
                      redBtn
                      btnClass="mb-4"
                      transparent
                      onClick={() => deleteCol(rowItem.id)}
                      size="small"
                      Icon={rowList.length >= 7 ? HiOutlineTrash : undefined}
                      label={rowList.length >= 7 ? '' : 'Delete this column'}
                    />

                    <FormInput
                      onChange={(e) => onRowChange(e, rowIndex)}
                      id={rowItem.id}
                      value={rowItem.value}
                      maxLength={50}
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
                        </>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="flex  mb-4 justify-between items-center w-auto">
                <div className="w-auto flex items-center gap-x-4">
                  <Buttons
                    label="Add row"
                    disabled={rowList.length === 12}
                    onClick={addRow}
                  />
                  <Buttons label="Add col" onClick={() => addCol()} />
                </div>

                <div className="w-auto flex items-center gap-x-4">
                  <Buttons
                    label="Duplicate last row"
                    disabled={rowList.length === 12}
                    onClick={() => duplicateRow(getLastLen())}
                  />
                  <Buttons
                    redBtn
                    transparent
                    disabled={rowList[0].col.length === 1}
                    label="Delete last row"
                    onClick={() => deleteRow()}
                  />
                </div>
              </div>

              <hr />

              <h3 className="mt-4 text-base text-black font-medium">Customize Table</h3>
              <div className="grid gap-x-4 grid-cols-3">
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
                    <span className="w-auto">
                      Theme: ({colors.dark ? 'dark' : 'light'})
                    </span>
                    <Toggle
                      enabled={colors.dark}
                      setEnabled={() => setColors({...colors, dark: !colors.dark})}
                    />
                  </div>
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
      </AnimatedContainer>
      <AnimatedContainer show={onPreviewTab}>
        {onPreviewTab &&
          (filteredList.length > 0 ? (
            <div style={{maxWidth: '94rem'}}>
              <div
                className={`grid  overflow-hidden  shadow-lg rounded-lg  grid-cols-${filteredList.length}`}>
                {map(filteredList, (rowItem) => {
                  return (
                    <div key={rowItem.id}>
                      <h4
                        style={{
                          minHeight:
                            getMaxWordLenOfHeader(rowList) >= 20 ? '5rem' : 'unset'
                        }}
                        className={`bg-${tableBg} text-${tableText} uppercase border-b-0 border-${tableBg} px-6 py-3 text-left text-xs font-medium  tracking-wider`}>
                        {rowItem.value}
                      </h4>
                      {map(rowItem.col, (colItem, colIndex: number) => {
                        return (
                          <div
                            key={colItem.id}
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
      </AnimatedContainer>
    </>
  );
};

export default TableModal;
