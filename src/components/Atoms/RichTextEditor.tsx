import {ContentState, convertToRaw, EditorState, convertFromHTML} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import React, {useEffect, useState} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {logError} from '@graphql/functions';
import useAuth from '@customHooks/useAuth';

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
  minHeight?: number;
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const {
    onChange,
    minHeight,
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
    placeholder
  } = props;

  const initialState: any = EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const {authId, email} = useAuth();

  const ulbContext = useULBContext();
  const previewMode = ulbContext?.previewMode ? ulbContext.previewMode : undefined;

  useEffect(() => {
    if (minHeight !== undefined) {
      const editor = document.querySelector('.rdw-editor-main');
      if (editor) {
        editor.setAttribute('style', `min-height:${minHeight}px`);
        editor.classList.add('large-editor');
      }
    }
  }, [minHeight]);

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
    'history'
  ];
  const onEditorStateChange = (editorState: any) => {
    const editorStateHtml: string = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    const editorStatePlainText: string = editorState.getCurrentContent().getPlainText();

    if (withStyles) {
      // Please don't use this if the content is important and serious
      if (editorRef && editorRef.current) {
        // @ts-ignore
        const withStylesHtml = editorRef?.current?.editor.editor.innerHTML;
        onChange(withStylesHtml, editorStatePlainText);
      }
    } else {
      onChange(editorStateHtml, editorStatePlainText);
    }

    setEditorState(editorState);
  };

  const checkInitialValue = (initValue: any) => {
    if (typeof initValue === 'object' && initValue?.value) {
      return initValue?.value;
    }
    return initValue;
  };

  // Adding below code in trycatch because it was giving html.trim error
  useEffect(() => {
    const html = initialValue ? checkInitialValue(initialValue) : '<p></p>';

    try {
      const contentBlock = convertFromHTML(html); // changed "htmlToDraft()" to "convertFromHTML()" -> Don't understand why htmlToDraft() was creating extra blank lines

      let editorState;
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );

        editorState = EditorState.createWithContent(contentState);
      } else {
        editorState = EditorState.createEmpty();
      }
      setEditorState(editorState);
    } catch (error) {
      logError(error, {authId, email}, 'RichTextEditor');
      console.error('error@RichTextEditor in useEffect: ', error);
    }
  }, []);

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

  const editorRef = React.useRef();

  return (
    <Editor
      ref={editorRef}
      placeholder={placeholder}
      editorState={editorState}
      toolbarClassName={toolbarClassName}
      wrapperClassName={wrapperClassName}
      editorClassName={editorClassName}
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: features.length > 0 ? features : options,
        inline: {
          inDropdown: false,
          options: ['bold', 'italic', 'underline'],
          className: `${dark ? 'dark' : ''} toolItemClassName`
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
            'Helvetica'
          ],
          className: 'plainText dropdownBlockClassName'
        },
        blockType: {
          className: 'plainText dropdownBlockClassName'
        },
        fontSize: {
          className: 'plainText dropdownClassName'
        },
        colorPicker: {
          className: ` ${
            customStyle ? `${dark ? 'dark' : ''} text-black` : ''
          }  toolItemClassName ${theme}`,
          colors: ['#DC2626', '#D97706', '#34D399', '#3B82F6', '#fff']
        }
      }}
    />
  );
};

export default RichTextEditor;
