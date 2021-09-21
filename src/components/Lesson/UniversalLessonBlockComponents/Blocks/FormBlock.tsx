import RequiredMark from '@components/Atoms/RequiredMark';
import AttachmentBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/AttachmentBlock';
import OptionBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/OptionBlock';
import StarRatingBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/StarRatingBlock';
import WritingExerciseBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/WritingExerciseBlock';
import ReviewSliderBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/ReviewSliderBlock';
import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import DatePicker from '@UlbBlocks/FormBlock/DatePicker';
import TextAreaBlock from '@UlbBlocks/FormBlock/TextAreaBlock';
import TextBlock from '@UlbBlocks/FormBlock/TextBlock';
import NotesBlock from '@UlbBlocks/Notes/NotesBlock';
import {map, noop} from 'lodash';
import React, {useContext, useMemo} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {FORM_TYPES} from '../../UniversalLessonBuilder/UI/common/constants';
import EmojiInput from './FormBlock/EmojiInputBlock';

interface FormBlockProps extends RowWrapperProps {
  id?: string;
  type?: string;
  numbered?: boolean;
  value?: {id: string; type: string; label: string; value: string}[];
}

export interface FormControlProps {
  id?: string;
  inputID: string;
  type?: string;
  label?: string;
  classString?: string;
  value?: any;
  options?: any;
  isInLesson?: boolean;
  required?: boolean;
  numbered?: boolean;
  index?: string;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
  getStudentDataValue?: (domID: string) => string[];
}

export const FormBlock = ({
  id,
  mode,
  numbered,
  type: formType,
  value,
}: FormBlockProps) => {
  const {
    lessonState,
    lessonDispatch,
    controlState,
    theme,
    state: {
      user,
      lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {},
    },
  } = useContext(GlobalContext);

  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

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

  const getStudentDataValue = (domID: string) => {
    const pageData = lessonState.studentData[lessonState.currentPage];
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDisplayDataStudentValue = (domID: string) => {
    const viewingStudentData = lessonState.displayData.reduce((acc: any, obj: any) => {
      if (obj.studentAuthId === controlState.studentViewing) {
        return obj.studentData;
      } else {
        return acc;
      }
    }, []);
    const pageData = viewingStudentData[lessonState.currentPage];
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDataValue = (domID: string) => {
    return getStudentDataValue(domID);
    // const isDisplayData = lessonState.displayData.length > 0;
    // if (!isDisplayData) {
    //   return getStudentDataValue(domID);
    // } else {
    //   return getDisplayDataStudentValue(domID);
    // }
  };

  const onChange = (e: any) => {
    const {id, value} = e.target;

    if (isInLesson) {
      handleUpdateStudentData(id, [value]);
    }
  };

  // ##################################################################### //
  // ########################## FORM BLOCK TYPES ######################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~~~ LINK ~~~~~~~~~~~~~~~~ //
  const LinkInput = ({
    inputID,
    label,
    value,
    required,
    numbered,
    index,
  }: FormControlProps) => {
    return (
      <div id={id} key={id} className={`mb-4 p-4`}>
        <label
          className={`text-sm text-gray-${lessonPageTheme === 'dark' ? '200' : '800'}`}
          htmlFor="label">
          {numbered && index} {label} <RequiredMark isRequired={required} />
        </label>
        <input
          id={inputID}
          disabled={mode === 'building'}
          pattern="https://.*"
          className={`w-full py-2 px-4 mt-2 rounded-xl ${themePlaceholderColor} ${
            lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
          }`}
          name="url"
          type="text"
          defaultValue={value.length > 0 ? value : 'Please input...'}
          onChange={isInLesson && isStudent ? (e) => onChange(e) : () => {}}
          value={isInLesson ? getDataValue(inputID) : value}
        />
      </div>
    );
  };

  // ##################################################################### //
  // ####################### FORM COMPOSER FUNTION ####################### //
  // ##################################################################### //
  const composeInput = (
    inputID: string,
    type?: string,
    label?: string,
    value?: any,
    options?: any,
    isInLesson?: boolean,
    handleUpdateStudentData?: any,
    getValue?: (domID: string) => any,
    numbered?: boolean,
    index?: string,
    required?: boolean,
    classString?: string
  ) => {
    const formBlockProps = {
      id,
      numbered,
      mode,
      type,
      index,
      label,
      value,
      required,
      inputID,
      classString,
    };
    switch (type) {
      case FORM_TYPES.TEXT:
        return <TextBlock {...formBlockProps} />;
      case FORM_TYPES.DATE_PICKER:
        return <DatePicker {...formBlockProps} />;
      case FORM_TYPES.TEXTAREA:
        return <TextAreaBlock {...formBlockProps} />;
      case FORM_TYPES.RADIO:
      case FORM_TYPES.MULTIPLE:
        return <OptionBlock options={options} {...formBlockProps} />;

      case FORM_TYPES.EMOJI:
        return <EmojiInput {...formBlockProps} />;
      case FORM_TYPES.RATING:
        return (
          <StarRatingBlock
            id={id}
            inputID={inputID}
            label={label}
            required={required}
            numbered={numbered}
            index={index}
            isInLesson={isInLesson}
            handleUpdateStudentData={
              isStudent && isInLesson ? handleUpdateStudentData : () => {}
            }
            getStudentDataValue={getValue}
          />
        );
      case FORM_TYPES.LINK:
        return (
          <LinkInput
            numbered={numbered}
            index={index}
            id={id}
            required={required}
            value={value}
            inputID={inputID}
            label={label}
          />
        );
      case FORM_TYPES.ATTACHMENTS:
        return <AttachmentBlock {...formBlockProps} />;
      case FORM_TYPES.REVIEW_SLIDER:
        return (
          <ReviewSliderBlock
            inputID={inputID}
            id={id}
            disabled={mode === 'building'}
            classString={classString}
            label={label}
            onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
            value={isInLesson ? getValue(inputID) : value}
          />
        );
      case FORM_TYPES.WRITING_EXERCISE:
      case `${FORM_TYPES.WRITING_EXERCISE}-content`:
        return (
          <div
            className={`border-0 border-gray-700 ${
              type === FORM_TYPES.WRITING_EXERCISE
                ? 'border-b-none rounded-b-none'
                : 'border-t-none rounded-t-none'
            } rounded-md`}>
            <WritingExerciseBlock
              title={type === FORM_TYPES.WRITING_EXERCISE}
              value={isInLesson ? getValue(inputID) : value}
              onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
              id={id}
              type={type}
              label={label}
              options={options}
              inputID={inputID}
              disabled={mode === 'building'}
              classString={classString}
            />
          </div>
        );

      case `${FORM_TYPES.POEM}-content`:
        return (
          <div className={`border-0 border-gray-700  rounded-md`}>
            <WritingExerciseBlock
              title={false}
              value={isInLesson ? getValue(inputID) : value}
              onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
              id={id}
              type={type}
              label={label}
              options={options}
              inputID={inputID}
              disabled={mode === 'building'}
              classString={classString}
            />
          </div>
        );

      default:
        return <p>No valid form input type</p>;
    }
  };

  // if (formType === 'notes-form') {
  //   const modifiyValues = useMemo(
  //     () =>
  //       map(value, (v: any) => ({
  //         class: v.class,
  //         id: v.id,
  //         value: v.value,
  //       })),
  //     [value]
  //   );

  //   return useMemo(() => <NotesBlock grid={{cols: 4, rows: 3}} value={modifiyValues} />, [
  //     modifiyValues,
  //   ]);
  // }

  return (
    <>
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => {
          return (
            <React.Fragment key={`formBlock_${i}`}>
              {composeInput(
                v.id,
                v.type,
                v.label,
                v.value,
                v.options,
                isInLesson,
                handleUpdateStudentData,
                getDataValue,
                numbered,
                `${i + 1}.`,
                v.isRequired,
                v.class
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};
