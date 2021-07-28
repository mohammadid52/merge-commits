import React, {useState, useEffect} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useULBContext} from '../../contexts/UniversalLessonBuilderContext';

interface RichTextEditorProps {
  onChange: (html: string, text: string) => void;
  initialValue: string;
  fullWHOverride?: boolean;
  rounded?: boolean;
  dark?: boolean;
  customStyle?: boolean;
  features?: string[];
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const {
    onChange,
    initialValue,
    fullWHOverride,
    dark = false,
    customStyle = false,
    rounded = false,
    features = [],
  } = props;
  const initialState: any = EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const {previewMode} = useULBContext();

  const options: string[] = [
    'inline',
    'blockType',
    'fontSize',
    'fontFamily',
    'list',
    'textAlign',
    'colorPicker',
    'link',
    'emoji',
    'remove',
    'history',
  ];
  const onEditorStateChange = (editorState: any) => {
    const editorStateHtml: string = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const editorStatePlainText: string = editorState.getCurrentContent().getPlainText();
    onChange(editorStateHtml, editorStatePlainText);
    setEditorState(editorState);
  };

  useEffect(() => {
    const html = initialValue ? initialValue : '<p></p>';
    const contentBlock = htmlToDraft(html);

    let editorState;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorState = EditorState.createWithContent(contentState);
    } else {
      editorState = EditorState.createEmpty();
    }
    setEditorState(editorState);
  }, []);

  const toolbarClassName = `${
    customStyle
      ? `${dark ? 'dark' : ''} toolbarClassName ${
          previewMode ? 'previewMode' : ''
        } text-black`
      : 'toolbarClassName'
  }`;
  const wrapperClassName = `${
    customStyle
      ? `${dark ? 'dark' : ''} wrapperClassName ${previewMode ? 'previewMode' : ''}  ${
          fullWHOverride ? 'flex flex-col' : ''
        }`
      : 'wrapperClassName'
  }`;
  const editorClassName = `${
    customStyle
      ? `${dark ? 'dark' : ''} editorClassName ${previewMode ? 'previewMode' : ''}  ${
          fullWHOverride ? 'flex-1' : ''
        }`
      : 'editorClassName'
  }`;

  return (
    <Editor
      editorState={editorState}
      toolbarClassName={toolbarClassName}
      wrapperClassName={wrapperClassName}
      editorClassName={editorClassName}
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: features.length > 0 ? features : options,
        inline: {
          inDropdown: false,
          options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
          className: `${dark ? 'dark' : ''} toolItemClassName`,
        },
        list: {inDropdown: true, className: 'dropdownClassName'},
        textAlign: {inDropdown: true, className: 'dropdownClassName'},
        link: {inDropdown: true, className: 'dropdownClassName'},
        history: {inDropdown: true, className: 'dropdownClassName'},
        fontFamily: {
          options: [
            'Arial',
            'Georgia',
            'Impact',
            'Courier',
            'Times New Roman',
            'Helvetica',
          ],
          className: 'plainText dropdownBlockClassName',
        },
        blockType: {
          className: 'plainText dropdownBlockClassName',
        },
        fontSize: {
          className: 'plainText dropdownClassName',
        },
        colorPicker: {
          className: ` ${
            customStyle ? `${dark ? 'dark' : ''} text-black` : ''
          }  toolItemClassName`,
          colors: ['#DC2626', '#D97706', '#34D399', '#3B82F6', '#fff'],
        },
      }}
    />
  );
};

export default RichTextEditor;
