import {useNotifications} from 'contexts/NotificationContext';
import useAuth from 'customHooks/useAuth';
import useMultiKeypress from 'customHooks/useMultiKeypress';
import {textEdit} from 'assets';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, {useEffect, useState} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';

interface RichTextEditorProps {
  onChange: (html: string, text: string) => void;
  initialValue: string;
  dynamicInput?: string;
  theme?: 'iconoclastIndigo' | 'curate';
  fullWHOverride?: boolean;
  rounded?: boolean;
  placeholder?: string;
  dark?: boolean;
  mediumDark?: boolean;
  customStyle?: boolean;
  inlineOptions?: string[];
  features?: string[];
  id?: string;

  /**
   * Don't use this if the content is serious
   */
  withStyles?: boolean;
  fetchTeacherValue?: () => string | undefined | null;
}

const DEFAULT_INLINE_OPTIONS = ['bold', 'italic', 'underline'];

const CustomRichTextEditor = (props: RichTextEditorProps) => {
  const {
    onChange,
    id,
    initialValue,

    fullWHOverride,
    dark = false,
    mediumDark = false,
    customStyle = false,
    features = [],
    withStyles = false,
    theme,
    placeholder = '',
    inlineOptions = DEFAULT_INLINE_OPTIONS,
    fetchTeacherValue
  } = props;

  const initialState: any = EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);

  const [changesArr, setChangesArr] = useState<any[]>([]);

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
  const previewMode = isInLesson ? false : switchContext?.previewMode;

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
    'history'
  ];

  const onEditorStateChange = (editorState: any) => {
    const editorStateHtml: string = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const editorStatePlainText: string = editorState.getCurrentContent().getPlainText();
    onChange(editorStateHtml, editorStatePlainText);
    setEditorState(editorState);

    if (
      changesArr.length === 0 ||
      editorStateHtml !== changesArr[changesArr.length - 1].editorStateHtml
    ) {
      changesArr.push({editorStateHtml, editorStatePlainText});
      setChangesArr([...changesArr]);
    }
  };

  const onInit = (value: any) => {
    const html = value ? value : '<p></p>';
    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  };

  /**
   * On 'initialValue' mount:
   *  - Allows updating the customRichText editor
   *  when incoming props are updated
   */

  const {isStudent} = useAuth();

  const deps = !isStudent ? [initialValue] : [initialValue];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (
      initialValue &&
      !loaded &&
      editorState.getCurrentContent().getPlainText() !== initialValue
    ) {
      onInit(initialValue);
      setLoaded(true);
    }
  }, deps);

  const editorRef = React.useRef<any>(null);

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
  }, [editorRef, withStyles]);

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

  //rdw-colorpicker-modal-header

  useEffect(() => {
    $('.rdw-colorpicker-wrapper').on('click', (e) => {
      setTimeout(() => {
        if (!e.target.classList.contains('rdw-colorpicker-modal-style-label')) {
          $('.rdw-colorpicker-modal-header').find('span:last-child').trigger('click');
        }
      }, 50);
    });
  }, []);

  const [clearButtonLoaded, setClearButtonLoaded] = useState(false);

  const resetText = () => {
    changesArr.pop();
    setChangesArr([...changesArr]);
    if (editorRef && editorRef?.current) {
      onInit(changesArr[changesArr.length - 1].editorStateHtml);
    }
  };

  const {clearNotification, setNotification} = useNotifications();

  const resetHandler = () => {
    if (changesArr.length > 1) {
      clearNotification();
      resetText();
    } else {
      setNotification({title: 'No changes were made', show: true});
    }
  };

  useEffect(() => {
    // rdw-editor-toolbar
    if (!clearButtonLoaded) {
      if ($('.rdw-editor-toolbar').find('#highlight-input-btns').length === 0) {
        const elem = `
       <div id="highlight-input-btns"  class="flex items-center clear-editor-text-btn">
       <div id="highlight-reset-btn"  title="Reset text" class=" rdw-option-wrapper iconoclastIndigo dark text-black toolItemClassName  toolbarCustomIcon">
       <img src=${textEdit.previous} alt="">
       </div>
       <div  id="highlight-hard-reset-btn-${id}" data-inputId=${id} title="Hard Reset"  class="${
          fetchTeacherValue === undefined ? 'hidden' : 'rdw-option-wrapper'
        }  iconoclastIndigo dark text-black toolItemClassName  toolbarCustomIcon">
     <img src=${textEdit.reset} alt="">
       </div>
       </div>`;
        $('.rdw-editor-toolbar').append(elem);

        setClearButtonLoaded(true);
      }
    }
  }, []);

  const ctrlZPressed = useMultiKeypress('z');

  useEffect(() => {
    if (ctrlZPressed) {
      resetHandler();
    }
  }, [ctrlZPressed]);

  useEffect(() => {
    $('#highlight-reset-btn').on('click', () => {
      resetHandler();
    });
  }, [changesArr]);

  useEffect(() => {
    $(`#highlight-hard-reset-btn-${id}`).on('click', () => {
      fetchTeacherValue && onInit(fetchTeacherValue());
    });
  }, []);

  return (
    <>
      <Editor
        ref={editorRef}
        editorState={editorState}
        placeholder={placeholder}
        toolbarClassName={toolbarClassName}
        wrapperClassName={wrapperClassName}
        editorClassName={editorClassName}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: features.length > 0 ? features : options,
          inline: {
            inDropdown: false,
            options: inlineOptions,
            className: `toolItemClassName`,
            bold: {
              icon: textEdit.bold,
              className: 'toolbarCustomIcon'
            },
            italic: {
              icon: textEdit.italic,
              className: 'toolbarCustomIcon'
            },
            underline: {
              icon: textEdit.underline,
              className: 'toolbarCustomIcon'
            },
            superscript: {
              icon: textEdit.superscript,
              className: 'toolbarCustomIcon'
            },
            subscript: {
              icon: textEdit.subscript,
              className: 'toolbarCustomIcon'
            }
          },

          remove: {
            icon: textEdit.remove,
            className: 'toolbarCustomIcon'
          },
          list: {
            inDropdown: true,
            className: 'dropdownClassName toolbarCustomIcon'
          },
          textAlign: {
            inDropdown: true,
            className: 'dropdownClassName toolbarCustomIcon'
          },
          link: {
            inDropdown: true,
            className: 'dropdownClassName toolbarCustomIcon'
          },
          history: {
            inDropdown: true,
            className: 'dropdownClassName toolbarCustomIcon'
          },
          fontFamily: {
            options: [
              'Arial',
              'Georgia',
              'Impact',
              'Courier',
              'Times New Roman',
              'Helvetica'
            ],
            className: 'plainText dropdownBlockClassName toolbarCustomIcon'
          },
          blockType: {
            className: 'plainText dropdownBlockClassName toolbarCustomIcon'
          },
          fontSize: {
            className: 'plainText dropdownClassName toolbarCustomIcon'
          },
          colorPicker: {
            icon: textEdit.colorPick,
            className: `
          ${theme}
          ${customStyle ? `${dark ? 'dark' : 'light'} text-black` : ''}  
          toolbarNestedDropdown toolItemClassName  toolbarCustomIcon`,
            colors: ['#DC2626', '#34D399', '#fff']
          }
        }}
      />
    </>
  );
};

export default CustomRichTextEditor;
