import {GlobalContext} from '@contexts/GlobalContext';
import {noop} from 'lodash';
import React, {useContext} from 'react';
import {IFormBlockProps, StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import {IoClose} from 'react-icons/io5';
import Tooltip from '@atoms/Tooltip';
import RequiredMark from '@atoms/RequiredMark';
import useInLessonCheck from '@customHooks/checkIfInLesson';

interface DatePickerProps {
  id: string;
  inputID: string;
  mode?: string;
  themeTextColor?: string;
  lessonPageTheme?: string;
  themePlaceholderColor?: string;
  disabled: boolean;
  handleUpdateStudentData: any;
  value: string;
  onChange: (e: any) => void;
}

const CustomDatePicker = (props: DatePickerProps) => {
  const {
    id,
    inputID,
    mode,
    themeTextColor,
    lessonPageTheme,
    themePlaceholderColor,

    value,
    handleUpdateStudentData,

    onChange,
  } = props;

  return (
    <div className="flex items-center space-x-2">
      <input
        id={inputID}
        disabled={mode === 'building'}
        className={`w-full py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
          lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
        } ${themePlaceholderColor}`}
        name={'datePicker'}
        type={'text'}
        onChange={onChange}
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
        value={value}
        placeholder={'choose a date'}
      />

      {value && value.length > 0 && (
        <Tooltip placement="bottom" text="Clear date">
          <div
            onClick={() => {
              handleUpdateStudentData(inputID, ['']);
            }}
            className="h-6 cursor-pointer w-6 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <IoClose />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

const DatePicker = (props: IFormBlockProps) => {
  const {id, required, numbered, label, mode, index, value, inputID} = props;

  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const gState = gContext.state;
  const {
    user,
    lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {},
  } = gState;

  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const handleUpdateStudentData = (domID: string, input: string[]) => {
    lessonDispatch({
      type: 'UPDATE_STUDENT_DATA',
      payload: {
        pageIdx: lessonState.currentPage,
        data: {
          domID: domID,
          input: input,
        },
      },
    });
  };

  const getStudentDataValue = (domID: string) => {
    const pageData = lessonState.studentData[lessonState.currentPage];
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDataValue = (domID: string) => {
    return getStudentDataValue(domID);
  };

  const onChange = (e: any) => {
    const {id, value} = e.target;

    if (isInLesson) {
      handleUpdateStudentData(id, [value]);
    }
  };
  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';
  return (
    <div id={id} key={id} className={`questionItemChild mb-4 px-4`}>
      <label className={`text-sm ${themeTextColor}`} htmlFor="label">
        {numbered && index} {label} <RequiredMark isRequired={required} />
      </label>

      <div className={`w-auto datePickerWrapper ${lessonPageTheme}`}>
        <CustomDatePicker
          handleUpdateStudentData={handleUpdateStudentData}
          id={inputID}
          inputID={inputID}
          mode={mode}
          themeTextColor={themeTextColor}
          lessonPageTheme={lessonPageTheme}
          themePlaceholderColor={themePlaceholderColor}
          disabled={false}
          onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
          value={isInLesson ? getDataValue(inputID) : value}
        />
      </div>
    </div>
  );
};
export default DatePicker;
