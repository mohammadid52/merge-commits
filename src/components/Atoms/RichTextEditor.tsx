import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextEditorProps {
  onChange: (html: string) => void
  initialValue: string
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const { onChange, initialValue } = props;
  const initialState: any = EditorState.createEmpty()
  const [editorState, setEditorState] = useState(initialState);

  const options: string[] = [
    'inline',
    'colorPicker',
    'list',
    'textAlign',
    'blockType',
    'fontSize',
    'fontFamily',
    'history'
  ]
  const onEditorStateChange = (editorState: any) => {
    const editorStateHtml: string = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    onChange(editorStateHtml)
    setEditorState({
      editorState,
    });
  };

  useEffect(() => {
    const html = initialValue;
    const contentBlock = htmlToDraft(html);
    let editorState;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      editorState = EditorState.createWithContent(contentState);

    }
    //  else {
    //   editorState = EditorState.createEmpty()
    // }
  }, [])

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      toolbar={{
        options: options,
        inline: {
          inDropdown: false,
          options: ['bold', 'italic', 'underline'],
        },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        fontFamily: {
          options: ['Arial', 'Georgia', 'Impact', 'Courier', 'Times New Roman', 'Helvetica'],
          className: 'plainText'
        },
        blockType: {
          className: 'plainText'
        },
        fontSize: {
          className: 'plainText'
        }
      }}
    />
  )
}

export default RichTextEditor
