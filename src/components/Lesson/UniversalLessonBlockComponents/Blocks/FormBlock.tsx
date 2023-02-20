import ErrorBoundary from '@components/Error/ErrorBoundary';
import DatePicker from '@UlbBlocks/FormBlock/DatePicker';
import TextAreaBlock from '@UlbBlocks/FormBlock/TextAreaBlock';
import TextBlock from '@UlbBlocks/FormBlock/TextBlock';
import NotesBlock from '@UlbBlocks/Notes/NotesBlock';
import {getLocalStorageData} from '@utilities/localStorage';
import {TeachingStyle} from 'API';
import RequiredMark from 'atoms/RequiredMark';
import AttachmentBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/AttachmentBlock';
import OptionBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/OptionBlock';
import StarRatingBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/StarRatingBlock';
import WritingExerciseBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/FormBlock/WritingExerciseBlock';
import ReviewSliderBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/ReviewSliderBlock';
import {GlobalContext, useGlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {map, noop} from 'lodash';
import React, {useContext} from 'react';
import {FORM_TYPES} from '../../UniversalLessonBuilder/UI/common/constants';
import EmojiInput from './FormBlock/EmojiInputBlock';

export const FormLabel = ({
  numbered,
  index,
  label,
  required
}: {
  index: string;
  numbered: boolean;
  label: string;
  required: boolean;
}) => {
  const gContext = useContext(GlobalContext);
  const gState = gContext.state;
  const {lessonPage: {theme: themeTextColor = ''} = {}} = gState;

  return (
    <ErrorBoundary componentName="FormLabel">
      <label className={`text-base ${themeTextColor}`} htmlFor="label">
        {numbered && index}{' '}
        <span dangerouslySetInnerHTML={{__html: label || '<p></p>'}}></span>{' '}
        <RequiredMark isRequired={required} />
      </label>
    </ErrorBoundary>
  );
};

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
  pagePartId
}: FormBlockProps) => {
  const {
    state: {user, lessonPage: {theme: lessonPageTheme = 'dark'} = {}}
  } = useGlobalContext();
  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //
  const getRoomData = getLocalStorageData('room_info');

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const teachingStyle = getRoomData.teachingStyle;

  const isTeacher = user.role !== 'ST';
  const isStudent =
    isTeacher && teachingStyle === TeachingStyle.PERFORMER ? true : user.role === 'ST';

  const isInLesson = isStudent ? useInLessonCheck() : false;

  const onChange = (e: any) => {
    const {id, value} = e.target;

    setDataValue(id, [value]);
  };

  // This function will mark the required field for Attachment component
  /**
   *
   * @param id string - domID
   * @param value - attachmentId
   */
  const onAttachmentUploadSuccess = (id: string, value: string[]) => {
    setDataValue(id, value);
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
    index
  }: FormControlProps) => {
    return (
      <div id={`${inputID}_for_error`} key={id} className={`mb-4 p-4`}>
        <FormLabel label={label} required={required} numbered={numbered} index={index} />
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
      isStudent
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
        return (
          <AttachmentBlock
            onSuccess={(fileKeys: string[]) =>
              onAttachmentUploadSuccess(inputID, fileKeys)
            }
            {...formBlockProps}
          />
        );
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
            } p-4 rounded-2xl bg-component-dark`}>
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

      case FORM_TYPES.POEM:
      case `${FORM_TYPES.POEM}-content`:
        return (
          <div className={`mt-4  rounded-2xl`}>
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
      value: v.value
    }));

    return <NotesBlock grid={{cols: 4, rows: 3}} value={modifiyValues} />;
  }

  return (
    <>
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => {
          return (
            <ErrorBoundary componentName="FormBlock-composeInput">
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
            </ErrorBoundary>
          );
        })}
    </>
  );
};
