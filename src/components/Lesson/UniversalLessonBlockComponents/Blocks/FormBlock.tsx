import EmojiPicker from 'emoji-picker-react';
import React, {useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {HiEmojiHappy} from 'react-icons/hi';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import StarRatingBlock from './FormBlock/StarRatingBlock';

interface FormBlockProps extends RowWrapperProps {
  id?: string;
  value?: {id: string; type: string; label: string; value: string}[];
}

export const FormBlock = (props: FormBlockProps) => {
  const {id, mode, dataIdAttribute, value, handleEditBlockToggle} = props;

  const generateCheckbox = (values: {label: string; text: string}[]) => {
    if (values && Array.isArray(values)) {
      return (
        <div className="mt-2 flex flex-wrap text-gray-300 bg-darker-gray py-2 px-4 rounded-xl">
          {values.map(({label, text}, idx: number) => (
            <div className="w-auto flex items-center mx-4" key={`${label}_${idx}`}>
              <div className="h-2 w-2 border-gray-200 border-2 rounded-full mr-1" />
              {text}
            </div>
          ))}
        </div>
      );
    }
  };

  const EmojiInput = ({inputID, label, value}: any) => {
    const [textValue, setTextValue] = useState('');
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);

    const onEmojiSelect = (e: any) => {
      let textWithEmoji = textValue.concat(`${e.emoji} `);
      setTextValue(textWithEmoji);
      setShowEmojiSelector(false);
    };

    const actionStyles = `ml-4 hover:bg-green-600 flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-300 `;
    return (
      <div id={id} key={inputID} className={`mb-4 p-4`}>
        <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
          {label}
        </label>
        <div className="flex items-center relative">
          <input
            id={inputID}
            disabled={mode === 'building'}
            className={`w-full py-2 px-4 text-gray-800 rounded-xl bg-darker-gray`}
            name="emoji"
            onChange={(e: any) => setTextValue(e.target.value)}
            type="text"
            placeholder={value.length > 0 ? value : 'Please input...'}
            value={textValue}
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
          <button
            onClick={() => setShowEmojiSelector(true)}
            className={`${actionStyles}`}>
            😀
          </button>
        </div>
      </div>
    );
  };

  const composeInput = (inputID: string, type: string, label: string, value: any) => {
    switch (type) {
      case 'text-input':
        return (
          <div id={id} key={inputID} className={`mb-4 p-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            <input
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full py-2 px-4 text-gray-800 rounded-xl bg-darker-gray`}
              name="title"
              type="text"
              placeholder={value.length > 0 ? value : 'Please input...'}
              value={''}
            />
          </div>
        );
      case 'text-area':
        return (
          <div id={id} key={inputID} className={`mb-4 p-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            <textarea
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl bg-darker-gray`}
              name="story"
              placeholder={value.length > 0 ? value : 'Please input...'}
              value={''}
            />
          </div>
        );
      case 'radio-input':
        return (
          <div id={id} key={inputID} className={`mb-4 p-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            {generateCheckbox(value)}
          </div>
        );
      case 'emoji-input':
        return <EmojiInput inputID={inputID} value={value} label={label} />;
      case 'rating-star':
        return <StarRatingBlock id={id} inputID={inputID} label={label} />;
      default:
        return <p>No valid form input type</p>;
    }
  };

  return (
    <>
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => {
          return composeInput(`${id}_${i}`, v.type, v.label, v.value);
        })}
    </>
  );
};
