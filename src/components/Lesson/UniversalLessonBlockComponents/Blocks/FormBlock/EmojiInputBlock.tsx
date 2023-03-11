// ~~~~~~~~~~~~~~ EMOJI FORM ~~~~~~~~~~~~~ //
import { useGlobalContext } from "contexts/GlobalContext";
import useInLessonCheck from "customHooks/checkIfInLesson";
import useStudentDataValue from "customHooks/studentDataValue";
import EmojiPicker from "emoji-picker-react";
import { IFormBlockProps } from "interfaces/UniversalLessonInterfaces";
import noop from "lodash/noop";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { FormLabel } from "../FormBlock";

const EmojiInput = ({
  inputID = "",
  label = "",
  value,

  numbered = false,
  index = "",
  isStudent,

  required = false,
}: IFormBlockProps) => {
  const gContext = useGlobalContext();
  const gState = gContext.state;
  const {
    lessonPage: { theme: lessonPageTheme = "dark", themeTextColor = "" } = {},
  } = gState;

  const { getDataValue, setDataValue } = useStudentDataValue();

  const isInLesson = useInLessonCheck();

  const onChange = (e: any) => {
    const { id, value } = e.target;

    if (isInLesson) {
      setDataValue(id, [value]);
    }
  };

  const themePlaceholderColor =
    lessonPageTheme === "light" ? "placeholder-gray-800" : "";

  /**
   * Task:
   *  - On updating the input field, the data must be set with -> setDataValue(inputID, [e.target.value]);
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
      const studentDataValue = getDataValue(inputID);
      const textWithEmoji = studentDataValue[0].concat(`${e.emoji} `);

      setDataValue(inputID, [textWithEmoji]);
      setShowEmojiSelector(false);
    } catch (error) {
      setShowEmojiSelector(false);
    }
  };

  const actionStyles = `ml-4 hover:bg-green-600 flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-300 ${themeTextColor}`;
  return (
    <div id={`${inputID}_for_error`} key={inputID} className={`mb-4 p-4`}>
      <FormLabel
        label={label}
        required={required}
        numbered={numbered}
        index={index}
      />

      <div className="flex items-center relative">
        <input
          id={inputID}
          disabled={false}
          className={`w-full py-2 px-4 ${themeTextColor} ${themePlaceholderColor} rounded-xl ${
            lessonPageTheme === "light" ? "bg-gray-200" : "bg-darker-gray"
          }`}
          name="emoji"
          type="text"
          onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
          value={isInLesson && isStudent ? getDataValue(inputID) : value}
        />
        {showEmojiSelector && (
          <ClickAwayListener onClickAway={() => setShowEmojiSelector(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="picker-wrapper absolute top-1 right-2 w-auto z-100"
            >
              <EmojiPicker
                onEmojiClick={(_: any, emoji: any) => onEmojiSelect(emoji)}
              />
            </div>
          </ClickAwayListener>
        )}
        <button
          onClick={() => setShowEmojiSelector(true)}
          className={`${actionStyles}`}
        >
          😀
        </button>
      </div>
    </div>
  );
};

export default EmojiInput;
