import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
  fullscreen: boolean;
  dataProps?: {
    title?: string;
    story?: string;
    [key: string]: any;
  };
}

const StoryForm = (props: props) => {
  const { theme, state } = useContext(LessonControlContext);
  const { fullscreen, dataProps } = props;
  const [input, setInput] = useState({
    title: '',
    story: '',
  });

  useEffect(() => {
    setInput({
      title: dataProps && dataProps.title ? dataProps.title : '',
      story: dataProps && dataProps.story ? dataProps.story : '',
    });
  }, [dataProps]);

  return (
    <div className="w-full h-full rounded-xl">
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>Story </h3>
      <div className="relative h-full flex flex-col mb-5 mt-2">
        <label className={`${theme.elem.text}`} htmlFor="title">
          Title
        </label>

        <input
          id="title"
          className={`w-full py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
          name="title"
          type="text"
          placeholder="La Llorona"
          value={input.title}
          // onChange={handleInputChange}
        />
        <div className="py-2"></div>
        <textarea
          id="story"
          className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
          name="story"
          placeholder="Write your story here!"
          value={input.story}
          // onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default StoryForm;
