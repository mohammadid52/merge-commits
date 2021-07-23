import EmojiPicker from 'emoji-picker-react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {BiImageAdd} from 'react-icons/bi';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {FORM_TYPES} from '../../UniversalLessonBuilder/UI/common/constants';
import StarRatingBlock from './FormBlock/StarRatingBlock';
import Loader from '../../../Atoms/Loader';
import Tooltip from '../../../Atoms/Tooltip';
import {AiOutlineCheckCircle} from 'react-icons/ai';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import {StudentPageInput} from '../../../../interfaces/UniversalLessonInterfaces';
import EmojiInput from './FormBlock/EmojiInputBlock';
import Storage from '@aws-amplify/storage';
import {getImageFromS3} from '../../../../utilities/services';
import noop from 'lodash/noop';

interface FormBlockProps extends RowWrapperProps {
  id?: string;
  numbered?: boolean;
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
  numbered?: boolean;
  index?: string;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
  getStudentDataValue?: (domID: string) => string[];
}

const SelectMany = ({
  item,

  getCheckValue,
  onChange,
}: {
  getCheckValue: (id: string) => boolean;
  onChange: (e: any) => void;

  item: {text: string; label: string; id: string};
}) => {
  const {label, text, id} = item;
  const {
    theme,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';
  return (
    <div className={`flex my-2 w-auto justify-center items-center mr-8`}>
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
};

const SelectOne = ({
  item,

  onChange,
  getCheckValue,
}: {
  onChange: (e: any) => void;
  getCheckValue: (id: string) => boolean;

  item: {text: string; label: string; id: string};
}) => {
  const {label, text, id} = item;
  const {
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';
  return (
    <div className={`w-auto flex justify-center items-center mr-8 `}>
      <input
        id={id}
        data-key={id}
        data-value={label}
        type="radio"
        className={`w-5 h-5 flex-shrink-0 mx-4 rounded-full cursor-pointer border-0 ${themePlaceholderColor} ${
          getCheckValue(id) ? 'bg-blueberry border-white' : 'bg-white border-black '
        }`}
        onChange={onChange}
        checked={getCheckValue(id)}
      />

      <span className={`w-auto`}>{text}</span>
    </div>
  );
};
export const FormBlock = ({id, mode, numbered, value}: FormBlockProps) => {
  const {
    lessonState,
    lessonDispatch,
    theme,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
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
    const pageData = lessonState?.studentData[lessonState.currentPage];
    if (pageData) {
      const getInput = pageData.find(
        (inputObj: StudentPageInput) => inputObj.domID === domID
      );

      if (getInput) {
        return getInput.input;
      } else {
        return [''];
      }
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
  const LinkInput = ({inputID, label, value, numbered, index}: FormControlProps) => {
    return (
      <div id={id} key={id} className={`mb-4 p-4`}>
        <label
          className={`text-sm text-gray-${lessonPageTheme === 'dark' ? '200' : '800'}`}
          htmlFor="label">
          {numbered && index} {label}
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
          placeholder={value.length > 0 ? value : 'Please input...'}
          onChange={isInLesson ? (e) => onChange(e) : noop}
          value={isInLesson ? getStudentDataValue(inputID) : value}
        />
      </div>
    );
  };

  // ~~~~~~~~~~~~~~ ATTACHMENT ~~~~~~~~~~~~~ //
  const AttachmentBlock = ({
    inputID,
    label,
    value,
    numbered,
    index,
  }: FormControlProps) => {
    const inputOther = useRef(null);

    const openFilesExplorer = () => inputOther.current.click();
    // For Attachments - 31

    const UPLOAD_KEY = 'survey_attachments';
    const [uploading, setUploading] = useState(false);
    const [fileObject, setfileObject] = useState<any>({});
    const [, setUrl] = useState(value);

    const handleFileSelection = async (e: any) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setfileObject(file);
        `${UPLOAD_KEY}/${Date.now().toString()}_${file.name}`;
        setUploading(true);

        await uploadImageToS3(file, id, file.type);
        const imageUrl: any = await getImageFromS3(id);
        if (isInLesson) {
          handleUpdateStudentData(inputID, [imageUrl]);
          setUploading(false);
        }
      }
    };

    const uploadImageToS3 = async (file: any, id: string, type: string) => {
      // Upload file to s3 bucket

      return new Promise((resolve, reject) => {
        Storage.put(`ULB/studentdata_${id}`, file, {
          contentType: type,
          ContentEncoding: 'base64',
        })
          .then((result) => {
            console.log('File successfully uploaded to s3', result);
            resolve(true);
          })
          .catch((err) => {
            console.log('Error in uploading file to s3', err);
            reject(err);
          });
      });
    };

    const iconColor = lessonPageTheme === 'light' ? 'black' : 'white';
    return (
      <div id={id} key={inputID} className={`mb-4 p-4`}>
        <label className={`text-sm ${themeTextColor}`} htmlFor="label">
          {numbered && index} {label}
        </label>
        <div className="mt-2">
          <span
            role="button"
            tabIndex={-1}
            onClick={isInLesson ? openFilesExplorer : noop}
            className={`border-0 ${
              lessonPageTheme === 'light' ? 'border-gray-500' : 'border-white'
            } flex items-center justify-center ${
              lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
            } text-base px-4 py-2 ${themeTextColor} hover:text-sea-green hover:border-sea-green transition-all duration-300 rounded-xl shadow-sm`}>
            <BiImageAdd className={`w-auto mr-2`} />
            Upload Attachments
          </span>
          <input
            ref={inputOther}
            onChange={isInLesson ? (e) => handleFileSelection(e) : noop}
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
    selectMany: boolean,
    inputID: string
  ) => {
    if (values && Array.isArray(values)) {
      const studentDataValue = getStudentDataValue(inputID) || [];
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
          handleUpdateStudentData(inputID, [...selectedOptionList]);
        }
      };
      return (
        <div
          className={`mt-2 flex flex-wrap ${themeTextColor} ${
            lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
          } py-2 px-4 rounded-xl`}>
          {values.map((item, idx: number) =>
            selectMany ? (
              <SelectMany
                key={`question_${id}_${idx}`}
                onChange={onChange}
                getCheckValue={getCheckValue}
                item={item}
              />
            ) : (
              <SelectOne
                onChange={onChange}
                getCheckValue={getCheckValue}
                key={`question_${id}_${idx}`}
                item={item}
              />
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
    getStudentDataValue?: any,
    numbered?: boolean,
    index?: string
  ) => {
    switch (type) {
      case FORM_TYPES.TEXT:
      case FORM_TYPES.DATE_PICKER:
        return (
          <div id={id} key={id} className={`questionItemChild mb-4 px-4`}>
            <label className={`text-sm ${themeTextColor}`} htmlFor="label">
              {numbered && index} {label}
            </label>
            <input
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
              } ${themePlaceholderColor}`}
              name="title"
              type={type === FORM_TYPES.DATE_PICKER ? 'date' : 'text'}
              onChange={isInLesson ? (e) => onChange(e) : noop}
              value={isInLesson ? getStudentDataValue(inputID) : value}
            />
          </div>
        );

      case FORM_TYPES.TEXTAREA:
        return (
          <div id={id} key={id} className={`questionItemChild mb-4 px-4`}>
            <label className={`text-sm ${themeTextColor}`} htmlFor="label">
              {numbered && index} {label}
            </label>
            <textarea
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full h-64 py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
              }`}
              name="story"
              onChange={isInLesson ? (e) => onChange(e) : noop}
              value={isInLesson ? getStudentDataValue(inputID) : value}
            />
          </div>
        );
      case FORM_TYPES.RADIO:
      case FORM_TYPES.MULTIPLE:
        return (
          <div id={id} key={inputID} className={`questionItemChild mb-4 px-4`}>
            <label className={`text-sm ${themeTextColor}`} htmlFor="label">
              {numbered && index} {label}
            </label>
            {generateCheckbox(
              options,
              type === FORM_TYPES.MULTIPLE ? true : false,
              inputID
            )}
          </div>
        );

      case FORM_TYPES.EMOJI:
        return (
          <EmojiInput
            id={id}
            inputID={inputID}
            value={value}
            label={label}
            numbered={numbered}
            index={index}
            isInLesson={isInLesson}
            handleUpdateStudentData={handleUpdateStudentData}
            getStudentDataValue={getStudentDataValue}
          />
        );
      case FORM_TYPES.RATING:
        return (
          <StarRatingBlock
            id={id}
            inputID={inputID}
            label={label}
            numbered={numbered}
            index={index}
            isInLesson={isInLesson}
            handleUpdateStudentData={handleUpdateStudentData}
            getStudentDataValue={getStudentDataValue}
          />
        );
      case FORM_TYPES.LINK:
        return (
          <LinkInput
            numbered={numbered}
            index={index}
            id={id}
            value={value}
            inputID={inputID}
            label={label}
          />
        );
      case FORM_TYPES.ATTACHMENTS:
        return (
          <AttachmentBlock
            numbered={numbered}
            index={index}
            id={id}
            value={value}
            inputID={inputID}
            label={label}
          />
        );

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
                getStudentDataValue,
                numbered,
                `${i + 1}.`
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};
