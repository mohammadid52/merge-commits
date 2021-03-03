import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import RichTextEditor from '../../../Atoms/RichTextEditor';

const NotesForm = () => {
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
    <div className={`${theme.section} px-4 pb-4 m-auto`}>
      <RichTextEditor initialValue={`Type something here...`}
                      onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'content')} />
    </div>
  );
};


export default NotesForm;