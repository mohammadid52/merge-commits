// ~~~~~~~~~~~~~~ EMOJI FORM ~~~~~~~~~~~~~ //
import React, {useContext, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import EmojiPicker from 'emoji-picker-react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../../customHooks/checkIfInLesson';
import {StudentPageInput} from '../../../../../interfaces/UniversalLessonInterfaces';
import {FormControlProps} from '../FormBlock';
import noop from 'lodash/noop';
const EmojiInput = ({
  id,
  inputID,
  label,
  value,
  isInLesson,
  numbered,
  index,
  handleUpdateStudentData,
  getStudentDataValue,
}: FormControlProps) => {
  const {
    lessonState,
    lessonDispatch,
    theme,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const themePlaceholderColor = lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';

  // const [fields, setFields] = useState<any>({});
  const onChange = (e: any) => {
    const {id, value} = e.target;
    // console.log('onChange - id - value - ', id, ' - ', value);
    // setFields({...fields, [id]: value});
    if (isInLesson) {
      handleUpdateStudentData(id, [value]);
    }
  };

  /**
   * Task:
   *  - On updating the input field, the data must be set with -> handleUpdateStudentData(inputID, [e.target.value]);
   *  - The useEffect is listening for a change in this array, we then use -> setTextValue() to
   *  set the internal state of this component
   *  - This data flow is necessary
   *
   *  - For some reason this input field keeps being deselected...
   *
   *  - Check this:
   *  FORM_TYPES.TEXTAREA:
   *  FORM_TYPES.TEXT
   *
   **/

  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

  const onEmojiSelect = (e: any) => {
    try {
      const studentDataValue = getStudentDataValue(inputID);
      const textWithEmoji = studentDataValue[0].concat(`${e.emoji} `);

      handleUpdateStudentData(inputID, [textWithEmoji]);
      setShowEmojiSelector(false);
    } catch (error) {
      setShowEmojiSelector(false);
    }
  };

  const actionStyles = `ml-4 hover:bg-green-600 flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-300 ${themeTextColor}`;
  return (
    <div id={id} key={inputID} className={`mb-4 p-4`}>
      <label className={`text-sm ${themeTextColor} my-2`} htmlFor="label">
        {numbered && index} {label}
      </label>

      <div className="flex items-center relative">
        <input
          id={inputID}
          disabled={false}
          className={`w-full py-2 px-4 ${themeTextColor} ${themePlaceholderColor} rounded-xl ${
            lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
          }`}
          name="emoji"
          type="text"
          onChange={isInLesson ? (e) => onChange(e) : noop}
          value={isInLesson ? getStudentDataValue(inputID) : value}
        />
        {showEmojiSelector && (
          <ClickAwayListener onClickAway={() => setShowEmojiSelector(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="picker-wrapper absolute top-1 right-2 w-auto z-100">
              <EmojiPicker
                groupVisibility={{
                  recently_used: false,
                }}
                onEmojiClick={(e: any, emoji: any) => onEmojiSelect(emoji)}
              />
            </div>
          </ClickAwayListener>
        )}
        <button onClick={() => setShowEmojiSelector(true)} className={`${actionStyles}`}>
          😀
        </button>
      </div>
    </div>
  );
};

export default EmojiInput;
