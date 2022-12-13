import {useGlobalContext} from 'contexts/GlobalContext';
import {getAsset, textEdit} from 'assets';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, {useEffect} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const WritingExerciseEditor = ({
  editorState,
  setEditorState,
  onChangeCallback,
  initialValue,
  minHeight,
  isStudentViewing
}: {
  editorState: any;
  initialValue?: string;
  isStudentViewing?: boolean;
  minHeight?: number;
  setEditorState: any;
  onChangeCallback: (html: string, text: string) => void;
}) => {
  const onInit = (val: string) => {
    const html = val ? val : '<p></p>';
    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  };
  const onInitCopy = (val: string) => {
    const html = val ? val : '<p></p>';
    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  };

  useEffect(() => {
    onInit(initialValue);
  }, []);

  useEffect(() => {
    isStudentViewing && onInitCopy(initialValue);
  }, [isStudentViewing, initialValue]);

  const onChange = async (value: any) => {
    const editorStateHtml: string = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const editorStatePlainText: string = editorState.getCurrentContent().getPlainText();
    setEditorState(value);
    onChangeCallback(editorStateHtml, editorStatePlainText);
  };

  const toolbarClassName = `${
    true
      ? `${true ? 'dark' : 'light'} toolbarClassName customStyles text-black`
      : 'toolbarClassName'
  }`;

  const {clientKey} = useGlobalContext();

  const themeColor = getAsset(clientKey, 'themeClassName');

  const wrapperClassName = `${
    true ? ` border-none dark  wrapperClassName` : 'wrapperClassName '
  } ${themeColor}`;
  const editorClassName = `${true ? `dark editorClassName` : 'editorClassName'}`;

  const options: string[] = ['inline', 'colorPicker'];
  const DEFAULT_INLINE_OPTIONS = ['bold', 'italic'];
  useEffect(() => {
    if (minHeight !== undefined) {
      const editor = document.querySelector('.rdw-editor-main');
      if (editor) {
        editor.setAttribute('style', `min-height:${minHeight}px`);
      }
    }
  }, [minHeight]);

  return (
    <div>
      <Editor
        stripPastedStyles
        ariaLabel="draftEditor"
        editorState={editorState}
        toolbarClassName={toolbarClassName}
        wrapperClassName={wrapperClassName}
        editorClassName={editorClassName}
        onEditorStateChange={(value) => {
          onChange(value);
        }}
        toolbar={{
          options: options,
          inline: {
            inDropdown: false,
            options: DEFAULT_INLINE_OPTIONS,
            className: `toolItemClassName`,
            bold: {
              icon: textEdit.bold,
              className: 'toolbarCustomIcon'
            },
            italic: {
              icon: textEdit.italic,
              className: 'toolbarCustomIcon'
            }
          },

          colorPicker: {
            icon: textEdit.colorPick,
            className: `

          ${
            true ? `dark text-black` : ''
          } toolbarNestedDropdown toolItemClassName  toolbarCustomIcon`,
            colors: ['#DC2626', '#34D399']
          }
        }}
      />
    </div>
  );
};

export default WritingExerciseEditor;
