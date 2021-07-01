import React, {useState, useContext, useRef} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import {QuestionProps} from '../Question';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';
import find from 'lodash/find';
import {get} from 'lodash';
import {BiImageAdd, BiSmile} from 'react-icons/bi';
import EmojiPicker from 'emoji-picker-react';
import Storage from '@aws-amplify/storage';
import {getImageFromS3} from '../../../../utilities/services';
import Loader from '../../../Atoms/Loader';
import {AiOutlineCheckCircle} from 'react-icons/ai';
import Tooltip from '../../../Atoms/Tooltip';
import ClickAwayListener from 'react-click-away-listener';
import FormInput from '../../../Atoms/Form/FormInput';

interface TextInputState {
  id: string;
  value: string;
}

const InputQuestions = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const {
    checkpointID,
    visible,
    isTeacher,
    questionIndex,
    question,
    handleInputChange,
    questionKey,
    value,
    attachments = false,
    emoji = false,
    type = 'text',
  } = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme, dispatch} = switchContext;

  const questionId = question.question.id;

  const checkpoint = get(state, `questionData[${checkpointID}]`, null);

  const textInitAns =
    checkpoint && find(checkpoint, (q) => q.qid === questionId).response.toString();

  const [contents, setContents] = useState<TextInputState>({
    id: '',
    value: textInitAns || '',
  });

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value, id} = e.target as HTMLInputElement;
    setContents({
      id: questionId,
      value: value,
    });
    handleInputChange(questionId, value, checkpointID);
  };
  const [showEmoji, setShowEmoji] = useState({show: false});
  const onEmojiSelect = (e: any) => {
    let value = contents.value.concat(e.emoji) || '';
    setContents({
      id: questionId,
      value,
    });
    handleInputChange(questionId, value, checkpointID);

    setShowEmoji({show: false});
  };

  // For Attachments - 31

  const uploadAttachment = async (file: any, id: string, type: string) => {
    // Upload Attachments
    return new Promise((resolve, reject) => {
      Storage.put(id, file, {
        contentType: type,
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const UPLOAD_KEY = 'survey_attachments';
  const [uploading, setUploading] = useState(false);
  const [fileObject, setfileObject] = useState<any>({});

  const addImageUrlToResponse = (url: string) => {
    let value = url;
    setContents({
      id: questionId,
      value,
    });
    handleInputChange(questionId, value, checkpointID);
  };

  const handleFileSelection = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setfileObject(file);
      const id: string = `${UPLOAD_KEY}/${Date.now().toString()}_${file.name}`;
      setUploading(true);

      await uploadAttachment(file, id, file.type);
      const imageUrl: any = await getImageFromS3(id);

      if (imageUrl) addImageUrlToResponse(imageUrl);
      setUploading(false);
    }
  };

  const Attachment = () => {
    const inputOther = useRef(null);

    const openFilesExplorer = () => inputOther.current.click();

    return (
      <div>
        <div>
          <span
            role="button"
            tabIndex={-1}
            onClick={openFilesExplorer}
            className={`border-0 border-white flex items-center justify-center text-base px-4 py-2 text-white hover:text-sea-green hover:border-sea-green transition-all duration-300 rounded-md shadow-sm`}>
            <BiImageAdd className={`w-auto mr-2`} />
            Upload Attachments
          </span>
          <input
            ref={inputOther}
            onChange={handleFileSelection}
            type="file"
            className="hidden"
            multiple={false}
          />
        </div>
        {fileObject.name && (
          <Tooltip show={!uploading} placement="bottom" text={'View Attachments'}>
            <div
              onClick={() => {
                if (!uploading) {
                  window.open(contents.value);
                }
              }}
              className="cursor-pointer flex items-center justify-between border-0 border-sea-green rounded-md shadow-sm mt-2 p-2 px-4">
              <p className="text-center text-white w-auto truncate">
                {uploading ? 'Uploading' : 'Uploaded'} - {fileObject.name}
              </p>

              {uploading ? (
                <div className=" w-auto">
                  <Loader color={`#fff`} />
                </div>
              ) : (
                <AiOutlineCheckCircle className="w-auto text-white text-lg" />
              )}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const actionStyles = `flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white text-gray-500`;
  return (
    visible &&
    question && (
      <div key={`question_${questionId}`} className={`w-auto my-4`}>
        <label htmlFor={question.question.label}>
          <p className={`font-semibold ${theme.elem.text} ${theme.underline} pb-2 mb-4`}>
            <span className="text-red-500"> {question.required ? '*' : null}</span>{' '}
            <b>{questionIndex + 1}. </b>
            {question.question.question}
          </p>
        </label>

        {emoji ? (
          <div className="flex items-center relative">
            <input
              id={questionId}
              className={`${theme.elem.textInput} w-full rounded-xl`}
              type={type}
              name={question.question.label}
              value={contents.value}
              onChange={(e) => (!isTeacher ? handleTextInputChange(e) : null)}
            />

            <span
              onClick={() =>
                setShowEmoji({
                  show: true,
                })
              }
              className={`${actionStyles}`}>
              <BiSmile className="text-xl" />
            </span>

            {showEmoji.show && (
              <div
                id="picker-wrapper"
                className="picker-wrapper absolute top-2 right-2 w-auto">
                <ClickAwayListener
                  onClickAway={() =>
                    setShowEmoji({
                      show: false,
                    })
                  }>
                  <EmojiPicker
                    groupVisibility={{
                      recently_used: false,
                    }}
                    onEmojiClick={(e: any, emoji: any) => onEmojiSelect(emoji)}
                  />
                </ClickAwayListener>
              </div>
            )}
          </div>
        ) : attachments ? (
          <Attachment />
        ) : (
          <FormInput
            type={type}
            value={contents.value}
            name={question.question.label}
            onChange={(e) => (!isTeacher ? handleTextInputChange(e) : null)}
            id={questionId}
            dark
          />
        )}
      </div>
    )
  );
};

export default InputQuestions;
