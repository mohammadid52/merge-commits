import RequiredMark from '@components/Atoms/RequiredMark';
import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import useStudentDataValue from '@customHooks/studentDataValue';
import {IFormBlockProps} from '@interfaces/UniversalLessonInterfaces';
import React, {useContext} from 'react';

const TextAreaBlock = (props: IFormBlockProps) => {
  const {id, required, numbered, label, mode, index, value, inputID} = props;

  const gContext = useContext(GlobalContext);
  const gState = gContext.state;
  const {
    user,
    lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {},
  } = gState;

  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const {getDataValue, setDataValue} = useStudentDataValue();

  const onChange = (e: any) => {
    const {id, value} = e.target;

    if (isInLesson) {
      setDataValue(id, [value]);
    }
  };

  return (
    <div id={id} key={id} className={`questionItemChild mb-4 px-4`}>
      <label className={`text-sm ${themeTextColor}`} htmlFor="label">
        {numbered && index} {label} <RequiredMark isRequired={required} />
      </label>
      <textarea
        id={inputID}
        disabled={mode === 'building'}
        className={`w-full h-64 py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
          lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
        } placeholder-gray-800`}
        name="story"
        onChange={isInLesson && isStudent ? (e) => onChange(e) : () => {}}
        value={isInLesson ? getDataValue(inputID) : value}
      />
    </div>
  );
};

export default React.memo(TextAreaBlock);
