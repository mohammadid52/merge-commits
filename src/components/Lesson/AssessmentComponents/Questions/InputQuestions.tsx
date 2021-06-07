import React, {useState, useEffect, useContext} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import {QuestionProps} from '../Question';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';
import find from 'lodash/find';
import {get} from 'lodash';
import {BiSmile} from 'react-icons/bi';
import EmojiPicker from 'emoji-picker-react';

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

  const actionStyles = `flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white text-gray-500`;
  return (
    visible &&
    question && (
      <div key={`question_${questionId}`} className={`w-auto my-4`}>
        <label htmlFor={question.question.label}>
          <p className={`font-semibold ${theme.elem.text} ${theme.underline} pb-2 mb-4`}>
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
                <EmojiPicker
                  groupVisibility={{
                    recently_used: false,
                  }}
                  onEmojiClick={(e: any, emoji: any) => onEmojiSelect(emoji)}
                />
              </div>
            )}
          </div>
        ) : (
          <input
            id={questionId}
            className={`${theme.elem.textInput} w-full rounded-xl`}
            type={type}
            name={question.question.label}
            value={contents.value}
            onChange={(e) => (!isTeacher ? handleTextInputChange(e) : null)}
          />
        )}
      </div>
    )
  );
};

export default InputQuestions;
