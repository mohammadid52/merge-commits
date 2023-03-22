import FormInput from '@components/Atoms/Form/FormInput';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from 'interfaces/UniversalLessonInterfaces';
import {noop} from 'lodash';
import React from 'react';

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
    <FormInput
      key={id}
      textarea={textarea}
      tooltip={mode === 'building' ? 'Disabled in building mode' : undefined}
      rows={textarea ? 4 : undefined}
      label={label}
      id={inputID}
      className="lesson-form-block "
      type={'text'}
      isRequired={required}
      placeHolder={placeHolder}
      onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
      value={isInLesson ? studentValue : value}
    />
  );
};

export default React.memo(TextBlock);
