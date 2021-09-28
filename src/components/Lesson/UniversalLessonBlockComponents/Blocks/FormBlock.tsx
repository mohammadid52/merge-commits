import RequiredMark from '@components/Atoms/RequiredMark';
import AttachmentBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/AttachmentBlock';
import OptionBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/OptionBlock';
import StarRatingBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/StarRatingBlock';
import WritingExerciseBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/WritingExerciseBlock';
import NotesContainer from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesFab';
import ReviewSliderBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/ReviewSliderBlock';
import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import useStudentDataValue from '@customHooks/studentDataValue';
import {
  StudentPageInput,
  UniversalLessonPage,
} from '@interfaces/UniversalLessonInterfaces';
import DatePicker from '@UlbBlocks/FormBlock/DatePicker';
import TextAreaBlock from '@UlbBlocks/FormBlock/TextAreaBlock';
import TextBlock from '@UlbBlocks/FormBlock/TextBlock';
import NotesBlock from '@UlbBlocks/Notes/NotesBlock';
import {filter, map, noop} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {FORM_TYPES} from '../../UniversalLessonBuilder/UI/common/constants';
import EmojiInput from './FormBlock/EmojiInputBlock';

interface FormBlockProps extends RowWrapperProps {
  id?: string;
  type?: string;
  pagePartId?: string;
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
  pagePartId,
}: FormBlockProps) => {
  const {
    lessonState,
    state: {user, lessonPage: {theme: lessonPageTheme = 'dark'} = {}},
  } = useContext(GlobalContext);
  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  const [activePageData, setActivePageData] = useState<UniversalLessonPage>();

  const notes =
    activePageData && activePageData.pageContent && activePageData.pageContent.length > 0
      ? filter(activePageData.pageContent, (f) => f.id.includes('notes-container'))
      : [];

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //

  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  useEffect(() => {
    if (PAGES) {
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
  }, [lessonState.lessonData, lessonState.currentPage]);

  const onChange = (e: any) => {
    const {id, value} = e.target;

    if (isInLesson) {
      setDataValue(id, [value]);
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
            handleUpdateStudentData={isStudent && isInLesson ? setDataValue : () => {}}
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

  if (formType === 'notes-form' && !isStudent) {
    const modifiyValues = map(value, (v: any) => ({
      class: v.class,
      pagePartId: pagePartId,
      partContentId: id,
      id: v.id,
      value: v.value,
    }));

    return <NotesBlock grid={{cols: 4, rows: 3}} value={modifiyValues} />;
  }

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
                setDataValue,
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
