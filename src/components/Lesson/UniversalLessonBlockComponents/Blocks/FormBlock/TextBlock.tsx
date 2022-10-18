import RequiredMark from 'components/Atoms/RequiredMark';
import {GlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from '@interfaces/UniversalLessonInterfaces';
import {noop} from 'lodash';
import React, {useContext} from 'react';

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

  return (
    <div
      id={id}
      key={id}
      className={`questionItemChild mb-4 p-4 bg-component-dark rounded-2xl border-0 border-gray-700`}>
      <label className={`text-sm ${themeTextColor}`} htmlFor="label">
        {numbered && index} {label} <RequiredMark isRequired={required} />
      </label>
      <input
        id={inputID}
        data-cy={inputID}
        disabled={mode === 'building'}
        className={`w-full py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
          lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
        } ${themePlaceholderColor}`}
        name={'text'}
        type={'text'}
        onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
        value={isInLesson ? getDataValue(inputID) : value}
      />
    </div>
  );
};

export default React.memo(TextBlock);
