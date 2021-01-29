import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextEditorProps {
  onChange: (html: string, text: string) => void
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
    const editorStatePlainText: string = editorState.getCurrentContent().getPlainText();
    onChange(editorStateHtml, editorStatePlainText)
    setEditorState(editorState);
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
    else {
      editorState = EditorState.createEmpty()
    }
    setEditorState(editorState);
  }, [])

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: options,
        inline: {
          inDropdown: false,
          options: ['bold', 'italic', 'underline'],
          className: 'toolItemClassName'
        },
        list: { inDropdown: true, className: 'dropdownClassName' },
        textAlign: { inDropdown: true, className: 'dropdownClassName' },
        link: { inDropdown: true, className: 'dropdownClassName' },
        history: { inDropdown: true, className: 'dropdownClassName' },
        fontFamily: {
          options: ['Arial', 'Georgia', 'Impact', 'Courier', 'Times New Roman', 'Helvetica'],
          className: 'plainText dropdownBlockClassName'
        },
        blockType: {
          className: 'plainText dropdownBlockClassName'
        },
        fontSize: {
          className: 'plainText dropdownClassName'
        },
        colorPicker: {
          className: 'toolItemClassName'
        }
      }}
    />
  )
}

export default RichTextEditor
