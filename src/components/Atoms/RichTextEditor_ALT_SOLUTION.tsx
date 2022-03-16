import {ContentState, convertToRaw, EditorState, convertFromHTML} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import React, {useCallback, useEffect, useState} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useULBContext} from '../../contexts/UniversalLessonBuilderContext';

interface RichTextEditorProps {
  onChange: (html: string, text: string) => void;
  initialValue: string;
  theme?: 'iconoclastIndigo' | 'curate';
  fullWHOverride?: boolean;
  rounded?: boolean;
  dark?: boolean;
  mediumDark?: boolean;
  customStyle?: boolean;
  features?: string[];
  /**
   * Don't use this if the content is serious
   */
  withStyles?: boolean;
  maxHeight?: string;
  wrapperClass?: string;
  placeholder?: string;
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const {
    onChange,
    initialValue,
    fullWHOverride,
    dark = false,
    mediumDark = false,
    customStyle = false,
    rounded = false,
    features = [],
    theme,
    withStyles = false,
    maxHeight,
    wrapperClass = '',
    placeholder,
  } = props;
  const editorRef = React.useRef(null);

  const [editorState, setEditorState] = useState(null);
  const editorStateRef = React.useRef(null);

  const ulbContext = useULBContext();
  const previewMode = ulbContext?.previewMode ? ulbContext.previewMode : undefined;

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

  const getEditorStateHtml = (inputState: any) => {
    return draftToHtml(convertToRaw(inputState.getCurrentContent()));
  };

  const getEditorStateText = (inputState: any) => {
    return inputState.getCurrentContent()?.getPlainText() || '';
  };

  const checkNewContent = (a: string, b: string) => {
    console.log('a', a);
    console.log('b', b);
    return a !== b;
  };

  const updateEditorState = (inputState: any, plainText: string) => {
    setEditorState(inputState);
    editorStateRef.current = plainText;
    console.log('updateEditorState', plainText);
  };

  const onEditorStateChange = (inputState: any) => {
    const editorStateHtml = getEditorStateHtml(inputState);
    const editorStatePlainText = getEditorStateText(inputState);
    const withStylesHtml = editorRef?.current?.editor.editor.innerHTML;
    const withStylesText = editorRef?.current?.editor.editor.innerText;

    if (editorStateRef.current && editorRef && editorRef.current) {
      if (withStyles && checkNewContent(withStylesText, editorStateRef.current)) {
        // Please don't use this if the content is important and serious
        // @ts-ignore

        onChange(withStylesHtml, editorStatePlainText);
        updateEditorState(inputState, withStylesText);
      } else if (checkNewContent(editorStatePlainText, editorStateRef.current)) {
        onChange(editorStateHtml, editorStatePlainText);
        updateEditorState(inputState, editorStatePlainText);
      }
    }
  };

  const initRef = React.useRef(false);
  const initState = React.useRef(null);
  const initText = React.useRef(undefined);

  const initializeEditor = useCallback(() => {
    if (!initRef.current && !initState.current && !initText.current) {
      const initialHtml = initialValue ? initialValue : '<span></span>';
      const initialContent = convertFromHTML(initialHtml);
      initState.current = EditorState.createWithContent(
        ContentState.createFromBlockArray(initialContent.contentBlocks)
      );
      initText.current = initialHtml;

      if (initState.current) {
        updateEditorState(initState.current, initText.current);
        initRef.current = true;
      }
    }
  }, [setEditorState, getEditorStateText]);

  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  const toolbarClassName = `${
    customStyle
      ? `${dark ? 'dark' : ''} ${mediumDark ? 'mediumDark' : ''} toolbarClassName ${
          previewMode ? 'previewMode' : ''
        } text-black`
      : 'toolbarClassName'
  }`;
  const wrapperClassName = `${wrapperClass} ${
    customStyle
      ? `${dark ? 'dark' : ''} ${mediumDark ? 'mediumDark' : ''} wrapperClassName ${
          previewMode ? 'previewMode' : ''
        }  ${fullWHOverride ? 'flex flex-col' : ''}`
      : 'wrapperClassName'
  }`;
  const editorClassName = `${
    customStyle
      ? `${dark ? 'dark' : ''} editorClassName ${previewMode ? 'previewMode' : ''}  ${
          fullWHOverride ? 'flex-1' : ''
        }`
      : 'editorClassName '
  }  ${maxHeight ? maxHeight : ''}`;

  return (
    <Editor
      ref={editorRef}
      placeholder={placeholder}
      editorState={editorState}
      toolbarClassName={toolbarClassName}
      wrapperClassName={wrapperClassName}
      editorClassName={editorClassName}
      onEditorStateChange={editorState ? onEditorStateChange : () => {}}
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
          }  toolItemClassName ${theme}`,
          colors: ['#DC2626', '#D97706', '#34D399', '#3B82F6', '#fff'],
        },
      }}
    />
  );
};

export default RichTextEditor;
