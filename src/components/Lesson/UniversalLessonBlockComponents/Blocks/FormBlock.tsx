import React, {useContext, useRef, useState} from 'react';
import {BiImageAdd} from 'react-icons/bi';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {FORM_TYPES} from '../../UniversalLessonBuilder/UI/common/constants';
import StarRatingBlock from './FormBlock/StarRatingBlock';
import Loader from '../../../Atoms/Loader';
import Tooltip from '../../../Atoms/Tooltip';
import {AiOutlineCheckCircle} from 'react-icons/ai';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import {
  StudentPageInput,
  UniversalLessonStudentData,
} from '../../../../interfaces/UniversalLessonInterfaces';

import EmojiInput from './FormBlock/EmojiInputBlock';

interface FormBlockProps extends RowWrapperProps {
  id?: string;
  value?: {id: string; type: string; label: string; value: string}[];
}

export interface FormControlProps {
  id?: string;
  inputID: string;
  type?: string;
  label?: string;
  value?: any;
  options?: any;
  isInLesson?: boolean;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
  getStudentDataValue?: (domID: string) => string[];
}

export const FormBlock = ({id, mode, value}: FormBlockProps) => {
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

  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';

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
    if (getInput) {
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
    console.log('getInput - ', getInput);
    if (getInput) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDataValue = (domID: string) => {
    const isDisplayData = lessonState.displayData.length > 0;
    if (!isDisplayData) {
      return getStudentDataValue(domID);
    } else {
      return getDisplayDataStudentValue(domID);
    }
  };

  const [fields, setFields] = useState<any>({});
  const onChange = (e: any) => {
    const {id, value} = e.target;
    setFields({...fields, [id]: value});
    if (isInLesson) {
      handleUpdateStudentData(id, [value]);
    }
  };

  // ##################################################################### //
  // ########################## FORM BLOCK TYPES ######################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //
  const Type = ({text, color = 'indigo'}: {color?: string; text: string}) => (
    <span
      className={`py-0.5 px-1 ml-2 text-xs  rounded bg-${color}-200  text-${color}-700`}>
      {text}
    </span>
  );

  // ~~~~~~~~~~~~~~~~~ LINK ~~~~~~~~~~~~~~~~ //
  const LinkInput = ({inputID, label, value}: any) => {
    return (
      <div id={id} key={id} className={`mb-4 p-4`}>
        <label className={`text-sm text-gray-200`} htmlFor="label">
          {label} <Type text="Link" />
        </label>
        <input
          id={inputID}
          disabled={mode === 'building'}
          pattern="https://.*"
          className={`w-full py-2 px-4 mt-2 rounded-xl ${themeTextColor} ${themePlaceholderColor} ${
            lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
          }`}
          name="url"
          type="text"
          defaultValue={value.length > 0 ? value : 'Please input...'}
          onChange={isInLesson && isStudent ? (e) => onChange(e) : undefined}
          value={isInLesson ? getDataValue(inputID) : value}
        />
      </div>
    );
  };

  // ~~~~~~~~~~~~~~ ATTACHMENT ~~~~~~~~~~~~~ //
  const AttachmentBlock = ({inputID, label, value}: any) => {
    const inputOther = useRef(null);

    const openFilesExplorer = () => inputOther.current.click();
    // For Attachments - 31

    const UPLOAD_KEY = 'survey_attachments';
    const [uploading, setUploading] = useState(false);
    const [fileObject, setfileObject] = useState<any>({});
    const [, setUrl] = useState(value);

    const wait = (timeout: number) => {
      return new Promise((resolve) => setTimeout(resolve, timeout));
    };
    const handleFileSelection = async (e: any) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setfileObject(file);
        `${UPLOAD_KEY}/${Date.now().toString()}_${file.name}`;
        setUploading(true);

        // await uploadAttachment(file, id, file.type);
        // const imageUrl: any = await getImageFromS3(id);

        wait(3000).then(() => {
          // addImageUrlToResponse(imageUrl)
          setUploading(false);
        });
        // if (imageUrl) addImageUrlToResponse(imageUrl);
      }
    };
    const iconColor = lessonPageTheme === 'light' ? 'black' : 'white';
    return (
      <div id={id} key={inputID} className={`mb-4 p-4`}>
        <label className={`text-sm ${themeTextColor}`} htmlFor="label">
          {label}
        </label>
        <div className="mt-2">
          <span
            role="button"
            tabIndex={-1}
            onClick={openFilesExplorer}
            className={`border-0 ${
              lessonPageTheme === 'light' ? 'border-dark-gray' : 'border-white'
            } relative z-100 flex items-center justify-center text-base px-4 py-2 ${themeTextColor} hover:text-sea-green hover:border-sea-green transition-all duration-300 rounded-md shadow-sm`}>
            <BiImageAdd className={`w-auto mr-2`} />
            Upload Attachments
          </span>
          <input
            ref={inputOther}
            onChange={isInLesson && isStudent ? handleFileSelection : undefined}
            type="file"
            className="hidden"
            multiple={false}
          />
        </div>
        {fileObject.name && (
          <Tooltip show={!uploading} placement="bottom" text={'View Attachments'}>
            <div className="cursor-pointer flex items-center justify-between border-0 border-sea-green rounded-md shadow-sm mt-2 p-2 px-4">
              <p className={`text-center ${themeTextColor} w-auto truncate`}>
                {uploading ? 'Uploading' : 'Uploaded'} - {fileObject.name}
              </p>

              {uploading ? (
                <div className=" w-auto">
                  <Loader color={iconColor} />
                </div>
              ) : (
                <AiOutlineCheckCircle className={`w-auto ${themeTextColor} text-lg`} />
              )}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  // ~~~~~~~~ SELECTMANY CHECKBOXES ~~~~~~~~ //
  const generateCheckbox = (
    values: {label: string; text: string; id: string}[],
    selectMany: boolean
  ) => {
    if (values && Array.isArray(values)) {
      return (
        <div
          className={`mt-2 flex flex-wrap ${themeTextColor} ${
            lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
          } py-2 px-4 rounded-xl`}>
          {values.map(({label, text, id}, idx: number) =>
            selectMany ? (
              <div
                key={`question_${id}_${idx}`}
                className={`flex my-2 w-auto justify-center items-center mr-8`}>
                <input
                  id={`${label}`}
                  data-key={id}
                  data-value={label}
                  type="checkbox"
                  className={`w-5 h-5 flex-shrink-0 mx-4 rounded-full cursor-pointer border-0 ${themePlaceholderColor} ${
                    false ? 'bg-blueberry border-white' : 'bg-white border-black '
                  }`}
                  checked={false}
                />
                <span className={`ml-2 ${theme.elem.text} ${themeTextColor}`}>
                  {text}
                </span>
              </div>
            ) : (
              <div
                key={`question_${id}_${idx}`}
                className={`w-auto flex justify-center items-center mr-8 `}>
                <span
                  id={label}
                  className={`w-5 h-5 flex-shrink-0 mx-4 rounded-full cursor-pointer  border-0 ${
                    false ? 'bg-blueberry border-white' : 'bg-white border-black '
                  }`}
                  data-value={label}
                  // onClick={(e) => (!isTeacher ? handleRadioSelect(e) : null)}
                />
                <span className={`w-auto`}>{text}</span>
              </div>
            )
          )}
        </div>
      );
    }
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
    getValue?: (domID: string) => any
  ) => {
    switch (type) {
      case FORM_TYPES.TEXT:
      case FORM_TYPES.DATE_PICKER:
        return (
          <div id={id} key={id} className={`mb-4 p-4`}>
            <label className={`text-sm ${themeTextColor}`} htmlFor="label">
              {label}
            </label>
            <input
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full py-2 px-4 ${theme} ${themeTextColor} mt-2 rounded-xl ${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
              } ${themePlaceholderColor}`}
              name="title"
              type={type === FORM_TYPES.DATE_PICKER ? 'date' : 'text'}
              onChange={isInLesson && isStudent ? (e) => onChange(e) : undefined}
              value={isInLesson ? getValue(inputID) : value}
            />
          </div>
        );

      case FORM_TYPES.TEXTAREA:
        return (
          <div id={id} key={id} className={`mb-4 p-4`}>
            <label className={`text-sm ${themeTextColor}`} htmlFor="label">
              {label}
            </label>
            <textarea
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full h-64 py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
              }`}
              name="story"
              onChange={isInLesson && isStudent ? (e) => onChange(e) : undefined}
              value={isInLesson ? getValue(inputID) : value}
            />
          </div>
        );
      case FORM_TYPES.RADIO:
      case FORM_TYPES.MULTIPLE:
        return (
          <div id={id} key={inputID} className={`mb-4 p-4`}>
            <label className={`text-sm ${themeTextColor}`} htmlFor="label">
              {label}
            </label>
            {generateCheckbox(options, type === FORM_TYPES.MULTIPLE ? true : false)}
          </div>
        );

      case FORM_TYPES.EMOJI:
        return (
          <EmojiInput
            id={id}
            inputID={inputID}
            value={value}
            label={label}
            isInLesson={isInLesson}
            handleUpdateStudentData={handleUpdateStudentData}
            getStudentDataValue={getValue}
          />
        );
      case FORM_TYPES.RATING:
        return (
          <StarRatingBlock
            id={id}
            inputID={inputID}
            label={label}
            isInLesson={isInLesson}
            handleUpdateStudentData={handleUpdateStudentData}
            getStudentDataValue={getValue}
          />
        );
      case FORM_TYPES.LINK:
        return <LinkInput id={id} value={value} inputID={inputID} label={label} />;
      case FORM_TYPES.ATTACHMENTS:
        return <AttachmentBlock id={id} value={value} inputID={inputID} label={label} />;

      default:
        return <p>No valid form input type</p>;
    }
  };

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
                getDataValue
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};