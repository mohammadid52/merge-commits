import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, {Component, useEffect, useState} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import useInLessonCheck from '../../../../../customHooks/checkIfInLesson';
// @ts-ignore
import {BlockPicker} from 'react-color';

// const ColorPicker = (props: {
//   currentState?: any;
//   expanded?: any;
//   onExpandEvent?: any;
//   onChange: any;
// }) => {
//   const stopPropagation = (event: {stopPropagation: () => void}) => {
//     event.stopPropagation();
//   };

//   const _onChange = (color: {hex: any}) => {
//     const {onChange} = props;
//     onChange('color', color.hex);
//   };

//   const renderModal = () => {
//     const {color} = props.currentState;
//     return (
//       <div onClick={stopPropagation}>
//         <BlockPicker color={color} onChangeComplete={_onChange} />
//       </div>
//     );
//   };

//   const {expanded, onExpandEvent} = props;
//   return (
//     <div aria-haspopup="true" aria-expanded={expanded} aria-label="rdw-color-picker">
//       <div onClick={onExpandEvent}>
//         <img src={'https://image.flaticon.com/icons/png/512/1250/1250615.png'} alt="" />
//       </div>
//       {expanded ? renderModal() : undefined}
//     </div>
//   );
// };

interface RichTextEditorProps {
  onChange: (html: string, text: string) => void;
  initialValue: string;
  dynamicInput?: string;
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

const CustomRichTextEditor = (props: RichTextEditorProps) => {
  const {
    onChange,
    initialValue,
    fullWHOverride,
    dark = false,
    mediumDark = false,
    customStyle = false,
    rounded = false,
    features = [],
    withStyles = false,
    theme,
  } = props;
  const initialState: any = EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  /**
   * Please don't do this:
   *
   * The useULBContext is only something dont in the  builder,
   * not in student lessons or teacher environments
   *
   * I added logic to fix this
   */
  const isInLesson = useInLessonCheck();
  const switchContext = isInLesson ? undefined : useULBContext();
  const previewMode = isInLesson ? false : switchContext.previewMode;

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

  /**
   * On 'initialValue' mount:
   *  - Allows updating the customRichText editor
   *  when incoming props are updated
   */
  useEffect(() => {
    const html = initialValue ? initialValue : '<p></p>';
    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [initialValue]);

  const editorRef = React.useRef();

  const header = $('.rdw-colorpicker-modal-header');
  setTimeout(() => {
    header.children('span').eq(1).trigger('click');
  }, 300);
  header.css({display: 'none'});

  useEffect(() => {
    if (editorRef && editorRef?.current && withStyles) {
      // @ts-ignore
      editorRef?.current?.editor.editor.addEventListener('paste', function (e) {
        // cancel paste
        e.preventDefault();

        // get text representation of clipboard
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        // insert text manually
        // this is also not the recommended way to add text but not the worst idea.
        // If you find better way or in future draftjs provides a feature for this
        // then replace this with that.
        // @ts-ignore
        editorRef.current.editor.editor.innerHTML = text;
      });
    }
  }, [editorRef]);

  const toolbarClassName = `${
    customStyle
      ? `${dark ? 'dark' : 'light'} ${
          mediumDark ? 'mediumDark' : ''
        } toolbarClassName customStyles ${previewMode ? 'previewMode' : ''} text-black`
      : 'toolbarClassName'
  }`;
  const wrapperClassName = `${
    customStyle
      ? `${theme} ${dark ? 'dark' : 'light'} ${
          mediumDark ? 'mediumDark' : ''
        } wrapperClassName ${previewMode ? 'previewMode' : ''}  ${
          fullWHOverride ? 'flex flex-col' : ''
        }`
      : 'wrapperClassName '
  }`;
  const editorClassName = `${
    customStyle
      ? `${dark ? 'dark' : 'light'} editorClassName ${
          previewMode ? 'previewMode' : ''
        }  ${fullWHOverride ? 'flex-1' : ''}`
      : 'editorClassName'
  }`;

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
          className: `toolItemClassName`,
          bold: {
            icon: 'https://image.flaticon.com/icons/png/512/114/114304.png',
            className: 'toolbarCustomIcon',
          },
          italic: {
            icon: 'https://image.flaticon.com/icons/png/512/1827/1827983.png',
            className: 'toolbarCustomIcon',
          },
          underline: {
            icon: 'https://image.flaticon.com/icons/png/512/154/154623.png',
            className: 'toolbarCustomIcon',
          },
          superscript: {
            icon: 'https://image.flaticon.com/icons/png/512/32/32176.png',
            className: 'toolbarCustomIcon',
          },
          subscript: {
            icon: 'https://image.flaticon.com/icons/png/512/1828/1828084.png',
            className: 'toolbarCustomIcon',
          },
        },

        remove: {
          icon: 'https://image.flaticon.com/icons/png/512/171/171383.png',
          className: 'toolbarCustomIcon',
        },
        list: {inDropdown: true, className: 'dropdownClassName toolbarCustomIcon'},
        textAlign: {inDropdown: true, className: 'dropdownClassName toolbarCustomIcon'},
        link: {inDropdown: true, className: 'dropdownClassName toolbarCustomIcon'},
        history: {inDropdown: true, className: 'dropdownClassName toolbarCustomIcon'},
        fontFamily: {
          options: [
            'Arial',
            'Georgia',
            'Impact',
            'Courier',
            'Times New Roman',
            'Helvetica',
          ],
          className: 'plainText dropdownBlockClassName toolbarCustomIcon',
        },
        blockType: {
          className: 'plainText dropdownBlockClassName toolbarCustomIcon',
        },
        fontSize: {
          className: 'plainText dropdownClassName toolbarCustomIcon',
        },
        colorPicker: {
          icon: 'https://image.flaticon.com/icons/png/512/1250/1250615.png',
          className: ` ${
            customStyle ? `${dark ? 'dark' : 'light'} text-black` : ''
          }  toolItemClassName ${theme} toolbarCustomIcon`,
          colors: ['#DC2626', '#D97706', '#34D399', '#3B82F6', '#fff'],
        },
      }}
    />
  );
};

export default CustomRichTextEditor;
