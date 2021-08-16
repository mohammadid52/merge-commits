import React, {useState, useEffect} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useULBContext} from '../../contexts/UniversalLessonBuilderContext';
import useInLessonCheck from '../../customHooks/checkIfInLesson';

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
  } = props;
  const initialState: any = EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);

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
      ? `${dark ? 'dark' : ''} ${mediumDark ? 'mediumDark' : ''} toolbarClassName ${
          previewMode ? 'previewMode' : ''
        } text-black`
      : 'toolbarClassName'
  }`;
  const wrapperClassName = `${
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
      : 'editorClassName'
  }`;

  const editorRef = React.useRef();

  useEffect(() => {
    if (editorRef && editorRef.current) {
      // @ts-ignore
    }
  }, [editorRef]);

  return (
    <Editor
      ref={editorRef}
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
          }  toolItemClassName ${theme}`,
          colors: ['#DC2626', '#D97706', '#34D399', '#3B82F6', '#fff'],
        },
      }}
    />
  );
};

export default RichTextEditor;
