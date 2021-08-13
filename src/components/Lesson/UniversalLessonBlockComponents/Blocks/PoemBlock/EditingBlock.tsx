import {ContentState, convertFromHTML, EditorState} from 'draft-js';
import React from 'react';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import CustomRichTextEditor from '../HighlighterBlock/CustomRichTextEditor';

interface EditingBlockProps {
  id?: string;
  poemWriting?: string;
  handleUpdateStudentData?: (domID: string, input: string[]) => void;
  setPoemWriting?: React.Dispatch<React.SetStateAction<string>>;
  fields?: {poemHtml: string; poemText: string};
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
}

const EditingBlock = (props: EditingBlockProps) => {
  const {
    id,
    poemWriting,
    fields,
    setFields,
    setPoemWriting,
    handleUpdateStudentData,
  } = props;

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {};
  const sampleMarkup =
    '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
    '<a href="http://www.facebook.com">Example link</a>';
  // handleUpdateStudentData(id, [html]);
  const blocksFromHTML = convertFromHTML(sampleMarkup);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  console.log();
  return (
    <div className="w-full flex flex-col">
      <div className={`w-full h-full rounded-xl text-black`}>
        <RichTextEditor
          initialValue={fields.poemHtml}
          onChange={(html, text) =>
            setFields({...fields, poemText: text, poemHtml: html})
          }
        />
      </div>
    </div>
  );
};

export default EditingBlock;
