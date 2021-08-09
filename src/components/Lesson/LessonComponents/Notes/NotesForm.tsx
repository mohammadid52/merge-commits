import React, {useContext, useState} from 'react';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import useDictionary from '../../../../customHooks/dictionary';
import {FloatingSideMenuProps} from '../../../Dashboard/FloatingSideMenu/FloatingSideMenu';
import {GlobalContext} from '../../../../contexts/GlobalContext';

const NotesForm = (props: FloatingSideMenuProps) => {
  const {focusSection} = props;
  const {state, dispatch, lessonState, lessonDispatch, theme, clientKey} = useContext(
    GlobalContext
  );
  const {lessonDict} = useDictionary(clientKey);

  const [notesData, setNotesData] = useState<{content: string}>({content: ''});

  // useEffect(() => {
  //   dispatch({
  //     type: 'UPDATE_COMPONENT_STATE',
  //     payload: {
  //       componentName: 'notes',
  //       inputName: 'content',
  //       content: notesData.content,
  //     },
  //   });
  // }, [notesData]);

  const setEditorContent = (html: string, text: string, fieldHtml: string) => {
    setNotesData({
      ...notesData,
      [fieldHtml]: html,
    });
  };
  return (
    <div
      className={`
        transform transition duration-400 ease-in-out
        ${
          focusSection === 'Notes'
            ? 'w-full mb-2 opacity-100'
            : 'w-0 overflow-hidden opacity-0'
        }
      `}>
      <RichTextEditor
        initialValue={`Take notes here...`}
        onChange={(htmlContent, plainText) =>
          setEditorContent(htmlContent, plainText, 'content')
        }
        fullWHOverride={true}
      />
    </div>
  );
};

export default NotesForm;
