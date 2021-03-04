import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import Banner from '../Banner';
import { LessonHeaderBarProps } from '../../../Header/LessonHeaderBar';

const NotesForm = (props: LessonHeaderBarProps) => {
  const { overlay } = props;
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
        ${overlay === 'notes' ? 'opacity-100 -translate-y-0' : 'opacity-0 -translate-y-64'}
        transform transition duration-300 ease-in-out ...
      `}>
      <div className={`p-4 rounded-br-xl bg-mustard`}>
        <Banner title={`Notepad`} />
        <RichTextEditor initialValue={`Take notes here...`}
                        onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'content')} />
      </div>
    </div>
  );
};


export default NotesForm;