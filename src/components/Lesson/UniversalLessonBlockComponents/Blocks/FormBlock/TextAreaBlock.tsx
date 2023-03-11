import { useGlobalContext } from "contexts/GlobalContext";
import useInLessonCheck from "customHooks/checkIfInLesson";
import useStudentDataValue from "customHooks/studentDataValue";
import { IFormBlockProps } from "interfaces/UniversalLessonInterfaces";
import React from "react";
import { FormLabel } from "../FormBlock";

const TextAreaBlock = (props: IFormBlockProps) => {
  const {
    id = "",
    required = false,
    numbered = false,
    label = "",
    mode,
    isStudent,
    index = "",
    value,
    inputID = "",
  } = props;

  const gContext = useGlobalContext();
  const gState = gContext.state;
  const { lessonPage: { theme: lessonPageTheme = "dark" } = {} } = gState;

  const isInLesson = useInLessonCheck();

  const { getDataValue, setDataValue } = useStudentDataValue();

  const onChange = (e: any) => {
    const { id, value } = e.target;
    if (isInLesson) {
      setDataValue(id, [value]);
    }
  };

  const studentValue = getDataValue(inputID) || value;

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
      <textarea
        id={inputID}
        disabled={mode === "building"}
        className={`w-full h-64 py-2 px-4 text-gray-300 text-sm mt-2 rounded-xl ${
          lessonPageTheme === "light" ? "bg-gray-200" : "bg-darker-gray"
        } placeholder-gray-800`}
        name="story"
        onChange={isInLesson && isStudent ? (e) => onChange(e) : () => {}}
        value={isInLesson ? studentValue : value}
      />
    </div>
  );
};

export default React.memo(TextAreaBlock);
