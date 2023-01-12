import RequiredMark from 'atoms/RequiredMark';
import {GlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from 'interfaces/UniversalLessonInterfaces';
import {noop} from 'lodash';
import React, {useContext} from 'react';
import {FormLabel} from '../FormBlock';

const TextBlock = (props: IFormBlockProps) => {
  const {id, required, numbered, label, mode, index, value, inputID} = props;

  const {
    state: {user, lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}}
  } = useContext(GlobalContext);
  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //

  const onChange = (e: any) => {
    if (isInLesson) {
      const {id, value} = e.target;

      setDataValue(id, [value]);
    }
  };

  const studentValue = getDataValue(inputID) || value;

  return (
    <div
      id={`${inputID}_for_error`}
      key={id}
      className={`questionItemChild mb-4 p-4 bg-component-dark rounded-2xl border-0 border-gray-700`}>
      <FormLabel label={label} required={required} numbered={numbered} index={index} />
      <input
        id={inputID}
        data-cy={inputID}
        disabled={mode === 'building'}
        className={`w-full py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
          lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
        } ${themePlaceholderColor} text-sm`}
        name={'text'}
        type={'text'}
        onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
        value={isInLesson ? studentValue : value}
      />
    </div>
  );
};

export default React.memo(TextBlock);
