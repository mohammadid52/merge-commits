import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import Banner from '../Banner';
import { LessonHeaderBarProps } from '../../../Header/LessonHeaderBar';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRegWindowMinimize } from 'react-icons/fa';

const NotesForm = (props: LessonHeaderBarProps) => {
  const { overlay, setOverlay } = props;
  const { state, theme, dispatch } = useContext(LessonContext);

  const [notesData, setNotesData] = useState<{ content: string }>({ content: '' });

  useEffect(() => {
    dispatch({
      type: 'UPDATE_COMPONENT_STATE',
      payload: {
        componentName: 'notes',
        inputName: 'content',
        content: notesData.content,
      },
    });
  }, [notesData]);

  const setEditorContent = (html: string, text: string, fieldHtml: string) => {
    setNotesData({
      ...notesData,
      [fieldHtml]: html,
    });
  };
  return (
    <div className={`
        ${overlay === 'notes' ? theme.section : null} 
        ${overlay === 'notes' ? 'opacity-100 -translate-y-0 z-100' : 'opacity-0 -translate-y-256 z-0'}
        transform transition duration-300 ease-in-out ...
      `}>
      <div className={`relative px-4 pb-4 rounded-br-xl bg-tahini`}>
        <div className={`absolute w-auto right-0 top-0 p-2 m-4 text-white cursor-pointer z-50 transition duration-200 ease-in-out rounded bg-white bg-opacity-10 hover:bg-opacity-40`}
             onClick={() => setOverlay('')}>
          <IconContext.Provider value={{className: 'w-auto h-auto'}}>
            <FaRegWindowMinimize size={18}/>
          </IconContext.Provider>
        </div>
        <Banner subtitle={`Class Notes`} />
        <RichTextEditor initialValue={`Take notes here...`}
                        onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'content')} />
      </div>
    </div>
  );
};


export default NotesForm;