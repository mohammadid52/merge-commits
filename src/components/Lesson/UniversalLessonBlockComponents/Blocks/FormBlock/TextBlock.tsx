import FormInput from '@components/Atoms/Form/FormInput';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from 'interfaces/UniversalLessonInterfaces';
import {noop} from 'lodash';
import React from 'react';
import {FormLabel} from '../FormBlock';

interface TextBlockProps extends IFormBlockProps {
  textarea?: boolean;
}

const TextBlock = (props: TextBlockProps) => {
  const {
    id,
    required = false,

    label = '',
    mode,
    isStudent,
    numbered,
    index = '',

    value = '',
    inputID,
    textarea
  } = props;

  const isInLesson = useInLessonCheck();

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //

  const onChange = (e: any) => {
    if (isInLesson) {
      const {id, value} = e.target;

      setDataValue(id, [value]);
    }
  };

  const studentValue = getDataValue(inputID || '')[0] || value;
  const placeHolder = value || 'Enter your answer here';

  return (
    <>
      {label && (
        <FormLabel
          label={label}
          required={required}
          numbered={Boolean(numbered)}
          index={index}
        />
      )}
      <FormInput
        key={id}
        inputClassName="mt-2"
        textarea={textarea}
        tooltip={mode === 'building' ? 'Disabled in building mode' : undefined}
        rows={textarea ? 4 : undefined}
        id={inputID}
        className="lesson-form-block "
        type={'text'}
        isRequired={required}
        placeHolder={placeHolder}
        onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
        value={isInLesson ? studentValue : value}
      />
    </>
  );
};

export default React.memo(TextBlock);
