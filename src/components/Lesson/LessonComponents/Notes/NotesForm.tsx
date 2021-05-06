import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import Banner from '../Banner';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRegWindowMinimize } from 'react-icons/fa';
import useDictionary from '../../../../customHooks/dictionary';
import { FloatingSideMenuProps } from '../../../Dashboard/FloatingSideMenu/FloatingSideMenu';

const NotesForm = (props: FloatingSideMenuProps) => {
  const { focusSection } = props;
  const { theme, dispatch, clientKey, userLanguage } = useContext(LessonContext);
  const { lessonDict } = useDictionary(clientKey);

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
        transform transition duration-400 ease-in-out
        ${focusSection === 'Notes' ? 'w-full h-full mb-2 opacity-100' : 'w-0 overflow-hidden opacity-0'}
      `}>
        <RichTextEditor initialValue={`Take notes here...`}
                        onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'content')}
                        fullWHOverride={true}/>
      </div>
  );
};


export default NotesForm;