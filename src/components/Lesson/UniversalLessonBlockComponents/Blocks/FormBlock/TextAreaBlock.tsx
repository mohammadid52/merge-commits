import FormInput from '@components/Atoms/Form/FormInput';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from 'interfaces/UniversalLessonInterfaces';
import {noop} from 'lodash';
import React from 'react';

const TextAreaBlock = (props: IFormBlockProps) => {
  const {
    id = '',
    required = false,

    label = '',

    isStudent,

    value,
    inputID = ''
  } = props;

  const isInLesson = useInLessonCheck();

  const {getDataValue, setDataValue} = useStudentDataValue();

  const onChange = (e: any) => {
    const {id, value} = e.target;
    if (isInLesson) {
      setDataValue(id, [value]);
    }
  };

  const studentValue = getDataValue(inputID)[0] || value;

  const placeHolder = value || 'Enter your answer here';

  return (
    <FormInput
      textarea
      rows={4}
      key={id}
      id={inputID}
      label={label}
      className="lesson-form-block "
      type={'text'}
      isRequired={required}
      placeHolder={placeHolder}
      onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
      value={isInLesson ? studentValue : value}
    />
    // <div
    //   id={`${inputID}_for_error`}
    //   key={id}
    //   className={`questionItemChild mb-4 p-4 dark-blue rounded-2xl border-0 border-gray-700`}
    // >
    //   <FormLabel
    //     label={label}
    //     required={required}
    //     numbered={numbered}
    //     index={index}
    //   />
    //   <textarea
    //     id={inputID}
    //     disabled={mode === "building"}
    //     className={`w-full h-64 py-2 px-4 text-gray-300 text-sm mt-2 rounded-xl ${
    //       lessonPageTheme === "light" ? "bg-gray-200" : "bg-darker-gray"
    //     } placeholder-gray-800`}
    //     name="story"
    //     onChange={isInLesson && isStudent ? (e) => onChange(e) : () => {}}
    //     value={isInLesson ? studentValue : value}
    //   />
    // </div>
  );
};

export default React.memo(TextAreaBlock);
