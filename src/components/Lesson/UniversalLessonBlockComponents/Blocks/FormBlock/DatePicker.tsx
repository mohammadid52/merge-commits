import Tooltip from "atoms/Tooltip";
import { useGlobalContext } from "contexts/GlobalContext";
import useInLessonCheck from "customHooks/checkIfInLesson";
import useStudentDataValue from "customHooks/studentDataValue";
import { IFormBlockProps } from "interfaces/UniversalLessonInterfaces";
import { noop } from "lodash";
import { IoClose } from "react-icons/io5";
import { FormLabel } from "../FormBlock";

interface DatePickerProps {
  id: string;
  inputID: string;
  mode?: string;
  themeTextColor?: string;
  lessonPageTheme?: string;
  themePlaceholderColor?: string;
  disabled: boolean;
  setDataValue: any;
  value: any;
  onChange: (e: any) => void;
}

const CustomDatePicker = (props: DatePickerProps) => {
  const {
    inputID,
    mode,
    themeTextColor,
    lessonPageTheme,
    themePlaceholderColor,
    value,
    setDataValue,
    onChange,
  } = props;

  return (
    <div className="flex items-center space-x-2">
      <input
        id={inputID}
        disabled={mode === "building"}
        className={`w-full py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
          lessonPageTheme === "light" ? "bg-gray-200" : "bg-darker-gray"
        } ${themePlaceholderColor}`}
        name={"datePicker"}
        type={"text"}
        onChange={onChange}
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => (e.target.type = "text")}
        value={value}
        placeholder={"choose a date"}
      />

      {value && value.length > 0 && (
        <Tooltip placement="bottom" text="Clear date">
          <div
            onClick={() => {
              setDataValue(inputID, [""]);
            }}
            className="h-6 cursor-pointer w-6 bg-blue-500 text-white flex items-center justify-center rounded-full"
          >
            <IoClose />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

const DatePicker = (props: IFormBlockProps) => {
  const {
    id,
    required = false,
    numbered = false,
    isStudent,
    label = "",
    mode,
    index = "",
    value,
    inputID = "",
  } = props;

  const gContext = useGlobalContext();
  const gState = gContext.state;

  const {
    lessonPage: { theme: lessonPageTheme = "dark", themeTextColor = "" } = {},
  } = gState;

  const isInLesson = useInLessonCheck();

  const { getDataValue, setDataValue } = useStudentDataValue();

  const onChange = (e: any) => {
    const { id, value } = e.target;

    if (isInLesson) {
      setDataValue(id, [value]);
    }
  };
  const themePlaceholderColor =
    lessonPageTheme === "light" ? "placeholder-gray-800" : "text-gray-400";
  return (
    <div
      id={`${inputID}_for_error`}
      key={id}
      className={`questionItemChild mb-4 p-4 bg-component-dark rounded-2xl border-0 border-gray-700`}
    >
      <FormLabel
        label={label}
        required={required}
        numbered={numbered}
        index={index}
      />

      <div className={`w-auto datePickerWrapper ${lessonPageTheme}`}>
        <CustomDatePicker
          setDataValue={setDataValue}
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
