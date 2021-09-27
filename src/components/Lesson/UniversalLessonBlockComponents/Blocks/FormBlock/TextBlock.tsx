import RequiredMark from '@components/Atoms/RequiredMark';
import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import useStudentDataValue from '@customHooks/studentDataValue';
import {IFormBlockProps, StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import {noop} from 'lodash';
import React, {useContext} from 'react';

const TextBlock = (props: IFormBlockProps) => {
  const {id, required, numbered, label, mode, index, value, inputID} = props;
  const {
    lessonState,
    lessonDispatch,

    state: {
      user,
      lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {},
    },
  } = useContext(GlobalContext);
  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const {getDataValue} = useStudentDataValue();

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

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

  const onChange = (e: any) => {
    if (isInLesson) {
      const {id, value} = e.target;

      handleUpdateStudentData(id, [value]);
    }
  };

  return (
    <div id={id} key={id} className={`questionItemChild mb-4 px-4`}>
      <label className={`text-sm ${themeTextColor}`} htmlFor="label">
        {numbered && index} {label} <RequiredMark isRequired={required} />
      </label>
      <input
        id={inputID}
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
