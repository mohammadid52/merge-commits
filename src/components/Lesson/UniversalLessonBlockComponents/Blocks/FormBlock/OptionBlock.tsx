import {IFormBlockProps, StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import React, {useContext, useState} from 'react';
import RequiredMark from '@components/Atoms/RequiredMark';
import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import {FORM_TYPES} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import useStudentDataValue from '@customHooks/studentDataValue';

const SelectMany = ({
  onChange,
  getCheckValue,

  classString,
  value,
}: {
  onChange: (e: any) => void;

  getCheckValue: (id: string) => boolean;
  classString: string;
  value: any;
}) => {
  const {
    theme,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';

  return (
    <div className={classString}>
      {value.map((item: any) => {
        const {label, text, id} = item;

        return (
          <div className={`flex my-2 w-auto justify-center items-center mr-8 `}>
            <input
              id={id}
              data-key={id}
              data-value={label}
              type="checkbox"
              className={`w-5 h-5 flex-shrink-0 mx-4  cursor-pointer border-0 ${themePlaceholderColor} ${
                getCheckValue(id) ? 'bg-blueberry border-white' : 'bg-white border-black '
              }`}
              onChange={onChange}
              checked={getCheckValue(id)}
            />

            <span className={`ml-2 ${theme.elem.text} ${themeTextColor}`}>{text}</span>
          </div>
        );
      })}
    </div>
  );
};

const SelectOne = ({
  onChange,
  getCheckValue,
  isStudent,
  classString,
  value,
  isInLesson,
}: {
  onChange: (e: any) => void;
  getCheckValue: (id: string) => boolean;
  isStudent: boolean;
  isInLesson: boolean;
  classString: string;
  value: any;
}) => {
  const {
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const [otherOptSel, setOtherOptSel] = useState(false);

  const [other, setOther] = useState('');
  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';
  return (
    <div className={classString}>
      {value.map((item: any) => {
        const {label, text, id} = item;
        return (
          <div key={id} className={`w-auto flex justify-center items-center mr-8 my-2`}>
            <input
              id={id}
              data-key={id}
              data-value={label}
              type="radio"
              className={`w-5 h-5 flex-shrink-0 mx-4 rounded-full cursor-pointer border-0 ${themePlaceholderColor} ${
                getCheckValue(id) ? 'bg-blueberry border-white' : 'bg-white border-black '
              }`}
              onChange={(e) => {
                if (e.target.id.includes('other')) {
                  setOtherOptSel(true);
                } else {
                  setOther('');
                  setOtherOptSel(false);
                }
                onChange(e);
              }}
              checked={getCheckValue(id)}
            />

            <span className={`w-auto`}>{text}</span>
          </div>
        );
      })}

      {otherOptSel && (
        <div key={`question_}`} className={`w-auto ml-4  my-4`}>
          <input
            id={'sdsd'}
            className={`${themePlaceholderColor} ${themeTextColor} ${
              lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
            } w-full rounded-xl`}
            type="text"
            name={'Other'}
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

interface IOptionProps extends IFormBlockProps {
  options: any;
}

const OptionBlock = (props: IOptionProps) => {
  const {
    id,
    required,
    numbered,
    label,
    mode,
    classString,
    index,
    value,
    type,
    options,
    inputID,
  } = props;

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

    const {getDataValue, setDataValue} = useStudentDataValue();

    // ~~~~~~~~ SELECTMANY CHECKBOXES ~~~~~~~~ //
    const generateCheckbox = (
      values: {label: string; text: string; id: string}[],
      selectMany: boolean,
      inputID: string,
      classString: string
    ) => {
      if (values && Array.isArray(values)) {
        const studentDataValue = getDataValue(inputID) || [];
        let selectedOptionList: string[] = [...studentDataValue].filter((d) => d !== '');

        const getCheckValue = (id: string): boolean => studentDataValue.includes(id);
        const onChange = (e: any) => {
          const {id} = e.target;
          if (isInLesson) {
            if (selectMany) {
              if (selectedOptionList.includes(id)) {
                selectedOptionList = selectedOptionList.filter((d) => d !== id);
              } else {
                selectedOptionList.push(id);
              }
            } else {
              selectedOptionList[0] = id;
            }
            setDataValue(inputID, [...selectedOptionList]);
          }
        };
        return (
          <div>
            {selectMany ? (
              <SelectMany
                classString={`mt-2 py-2 flex flex-wrap ${themeTextColor} ${
                  lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
                } px-4 rounded-xl ${classString}`}
                onChange={isStudent && isInLesson ? onChange : () => {}}
                key={`question_${id}`}
                getCheckValue={getCheckValue}
                value={values}
              />
            ) : (
              <SelectOne
                classString={`mt-2 py-2 flex flex-wrap ${themeTextColor} ${
                  lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
                } px-4 rounded-xl ${classString}`}
                onChange={isStudent && isInLesson ? onChange : () => {}}
                key={`question_${id}`}
                isStudent={isStudent}
                getCheckValue={getCheckValue}
                isInLesson={isInLesson}
                value={values}
              />
            )}
          </div>
        );
      }
    };

  return (
    <div id={id} key={inputID} className={`questionItemChild mb-4 px-4`}>
      <label className={`text-sm ${themeTextColor}`} htmlFor="label">
        {numbered && index} {label} <RequiredMark isRequired={required} />
      </label>
      {generateCheckbox(
        options,
        type === FORM_TYPES.MULTIPLE ? true : false,
        inputID,
        classString
      )}
    </div>
  );
};

export default OptionBlock;
